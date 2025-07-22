import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { id, status } = body

    // Validasi input
    if (!id || !status) {
      return NextResponse.json(
        { message: 'ID dan status harus disertakan' },
        { status: 400 }
      )
    }

    // Update checkout
    const updatedCheckout = await prisma.checkout.update({
      where: { id: Number(id) },
      data: { status },
    })

    return NextResponse.json(
      {
        message: 'Berhasil memperbarui status checkout',
        data: updatedCheckout,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saat update checkout status:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error: error.message },
      { status: 500 }
    )
  }
}
