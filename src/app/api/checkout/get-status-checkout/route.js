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
      select: {
        id: true,
        status: true,
        invoice: true,
        paid_at: true,
        created_at: true,
        updated_at: true
      },
    })

    if (!checkout) {
      return NextResponse.json({ message: 'Checkout not found' }, { status: 404 })
    }

    return NextResponse.json({
      checkout_id: checkout.id,
      status: checkout.status,
      invoice: checkout.invoice,
      paid_at: checkout.paid_at,
      created_at: checkout.created_at,
      updated_at: checkout.updated_at
    }, { status: 200 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
  }
}
