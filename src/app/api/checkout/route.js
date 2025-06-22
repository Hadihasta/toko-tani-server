import { NextResponse } from 'next/server';
import formidable from 'formidable';
import prisma from '@/lib/prisma'; // Menggunakan instance prisma dari file terpusat
import { verifyToken } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

// Menonaktifkan bodyParser default dari Next.js agar formidable bisa bekerja
export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const saveFile = async (file) => {
  const data = await fs.promises.readFile(file.filepath);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
  
  // Membuat direktori jika belum ada
  await fs.promises.mkdir(uploadDir, { recursive: true });
  
  const fileName = `${Date.now()}-${file.originalFilename}`;
  const filePath = path.join(uploadDir, fileName);
  
  await fs.promises.writeFile(filePath, data);
  await fs.promises.unlink(file.filepath); // Hapus file sementara
  
  return `/uploads/proofs/${fileName}`; // Mengembalikan path yang bisa diakses publik
};

// POST /api/checkout - Handle checkout process
export async function POST(request) {
  try {
    // 1. Verifikasi token otentikasi
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    // 2. Parse form data (cart dan file)
    const { fields, files } = await parseForm(request);
    
    const cartData = JSON.parse(fields.cart[0]);
    const paymentProofFile = files.paymentProof ? files.paymentProof[0] : null;

    if (!cartData || cartData.items.length === 0 || !paymentProofFile) {
      return NextResponse.json({ error: 'Data tidak lengkap atau bukti pembayaran tidak ada' }, { status: 400 });
    }

    // 3. Simpan bukti pembayaran
    const paymentProofUrl = await saveFile(paymentProofFile);

    // 4. Lakukan operasi database dalam sebuah transaksi
    const result = await prisma.$transaction(async (tx) => {
      // a. Cek ketersediaan stok untuk semua item
      for (const item of cartData.items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Stok untuk produk ${item.name} tidak mencukupi.`);
        }
      }

      // b. Buat data Checkout
      const checkout = await tx.checkout.create({
        data: {
          status: 'PENDING',
          invoice: `INV-${Date.now()}-${userId}`,
          user: { connect: { id: userId } },
          cart: { 
            create: {
              user_id: userId,
              address: 'Alamat Pengiriman Default', // Ganti dengan alamat user jika ada
              total_cost: cartData.total,
              cartProducts: {
                create: cartData.items.map(item => ({
                  product_id: item.id,
                  quantity: item.quantity,
                  price: item.price
                }))
              }
            }
          }
        },
        include: { cart: { include: { cartProducts: true } } }
      });
      
      // c. Buat transaksi pembayaran
      await tx.transaction.create({
        data: {
          total_price: cartData.total,
          user: { connect: { id: userId } },
          checkout: { connect: { id: checkout.id } },
          paymentProofUrl: paymentProofUrl
        }
      });

      // d. Kurangi stok produk
      for (const item of cartData.items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
      
      return checkout;
    });

    return NextResponse.json({
      success: true,
      message: 'Checkout berhasil! Menunggu konfirmasi admin.',
      data: {
        orderId: result.id,
        invoice: result.invoice
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Checkout error:', error);
    // Cek jika error karena stok tidak cukup
    if (error.message.includes('Stok untuk produk')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 