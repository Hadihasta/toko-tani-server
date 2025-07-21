import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const data = await req.formData()

    const checkout_id = data.get('checkout_id')
    const file = data.get('invoice') // file upload

    if (!checkout_id || !file || typeof file.name !== 'string') {
      return NextResponse.json({ message: 'Data tidak lengkap atau file tidak valid' }, { status: 400 })
    }

    // Pastikan checkout ID ada di database
    const existingCheckout = await prisma.checkout.findUnique({
      where: { id: Number(checkout_id) },
    })

    if (!existingCheckout) {
      return NextResponse.json({ message: 'Checkout tidak ditemukan' }, { status: 404 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'invoices')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const invoicePath = `/invoices/${fileName}`

    const updateCheckout = await prisma.checkout.update({
      where: { id: Number(checkout_id) },
      data: {
        invoice: invoicePath,
        status: 'PAID', // Ubah status jadi pending saat user upload invoice
      },
    })

    return NextResponse.json(
      { message: 'Invoice berhasil diupload', data: updateCheckout },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading invoice:', error)
    return NextResponse.json(
      { message: 'Gagal upload invoice', error: error.message },
      { status: 500 }
    )
  }
}
