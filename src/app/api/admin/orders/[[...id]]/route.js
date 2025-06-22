import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/orders - Get all orders for admin
export async function GET(request) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const orders = await prisma.checkout.findMany({
      where,
      include: {
        user: {
          select: { name: true, phone: true }
        },
        transaction: {
          select: { total_price: true, paymentProofUrl: true }
        },
        cart: {
          include: {
            cartProducts: {
              include: {
                product: {
                  select: { name: true, sku: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/orders/[id] - Update order status (Approve/Reject)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const checkoutId = parseInt(params.id);
    const body = await request.json();
    const { status, notes } = body; // status: 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid.' }, { status: 400 });
    }
    
    const checkout = await prisma.checkout.findUnique({ where: { id: checkoutId }});
    
    if(!checkout) {
        return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }
    
    // Jika pesanan ditolak, kembalikan stok produk
    if (status === 'REJECTED' && checkout.status === 'PENDING') {
        const cart = await prisma.cart.findUnique({ 
            where: { id: checkout.cart_id },
            include: { cartProducts: true }
        });
        
        if (cart) {
            await prisma.$transaction(
                cart.cartProducts.map(item => 
                    prisma.product.update({
                        where: { id: item.product_id },
                        data: { stock: { increment: item.quantity } }
                    })
                )
            );
        }
    }

    const updatedCheckout = await prisma.checkout.update({
      where: { id: checkoutId },
      data: {
        status: status,
        notes: notes,
        paid_at: status === 'APPROVED' ? new Date() : null
      }
    });

    return NextResponse.json({ 
        success: true, 
        message: `Pesanan berhasil di-${status.toLowerCase()}.`,
        data: updatedCheckout 
    });

  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 