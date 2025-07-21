// /app/api/checkout/get-checkout-id/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const checkout = await prisma.checkout.findFirst({
      where: { user_id: userId },
      select: { id: true }, 
    })

    if (!checkout) {
      return NextResponse.json({ message: 'Checkout not found' }, { status: 404 })
    }

    return NextResponse.json({ checkout_id: checkout.id }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
  }
}
