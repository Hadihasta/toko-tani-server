import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function GET(req) {
  try {
    // Ambil token dari Authorization header
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    // Verifikasi token
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Ambil user ID
    const id_user = user.id

    const cart = await prisma.cart.findFirst({
      where: { user_id: id_user },
    })

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 })
    }

    return NextResponse.json({ data: cart }, { status: 200 })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    )
  }
}
