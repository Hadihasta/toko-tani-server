import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function GET(req) {
  try {
    // 1. Ambil token dari Authorization header
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    // 2. Verify token
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 3. Ambil id_user dari payload JWT
    const id_user = user.id

    // 4. Query cart sesuai user_id
    const cart = await prisma.cart.findFirst({
      where: { user_id: id_user },
      include: {
        cartProducts: { include: { product: true } }, // kalau mau detail produk
      },
    })

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 })
    }

    return NextResponse.json({ data: cart }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Something Goes Wrong...' },
      { status: 500 }
    )
  }
}
