import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
    })

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found for this user' }, { status: 404 })
    }

    const body = await req.json()
    const { total_cost, items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid items payload' }, { status: 400 })
    }

    const cartProductOps = items.map((item) => {
      if (item.quantity === 0) {
        return prisma.cartProduct.delete({
          where: { id: item.cartProduct_id },
        })
      } else {
        return prisma.cartProduct.update({
          where: { id: item.cartProduct_id },
          data: { quantity: item.quantity },
        })
      }
    })

    const updateCart = prisma.cart.update({
      where: { id: cart.id },
      data: { total_cost },
    })

    await Promise.all([...cartProductOps, updateCart])

  
    // Cek apakah sudah ada checkout pending untuk user ini
    let checkout = await prisma.checkout.findFirst({
      where: {
        user_id: userId,
        status: 'PENDING',
      },
    })

    if (checkout) {
      // Update checkout jika sudah ada
      checkout = await prisma.checkout.update({
        where: { id: checkout.id },
        data: {
          cart_id: cart.id,
        },
      })
    } else {
      // Buat checkout baru jika belum ada
      checkout = await prisma.checkout.create({
        data: {
          user_id: userId,
          cart_id: cart.id,
          status: 'PENDING',
          invoice: null, // biarkan null di awal
        },
      })
    }

    return NextResponse.json({
      message: 'Cart updated and checkout created successfully',
      checkout,
    }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Invalid token or server error', error: error.message },
      { status: 500 }
    )
  }
}
