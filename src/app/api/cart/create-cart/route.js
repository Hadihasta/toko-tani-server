import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user_id = user.id
    const { products } = await req.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ message: 'Invalid products array' }, { status: 400 })
    }

    // Pastikan user punya cart
    let cart = await prisma.cart.findFirst({ where: { user_id } })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id, total_cost: 0, address: '' },
      })
    }

    // Loop update setiap product
    for (const item of products) {
      const { id, quantity } = item

      const product = await prisma.product.findUnique({ where: { id: id } })
      if (!product) continue

      const existingCartProduct = await prisma.cartProduct.findFirst({
        where: { cart_id: cart.id, id },
      })

      if (existingCartProduct) {
        if (quantity === 0) {
          // Hapus produk kalau quantity = 0
          await prisma.cartProduct.delete({
            where: { id: existingCartProduct.id },
          })
        } else {
          // Replace quantity dengan nilai baru
          await prisma.cartProduct.update({
            where: { id: existingCartProduct.id },
            data: { quantity },
          })
        }
      } else {
        if (quantity > 0) {
          // Tambah produk baru kalau belum ada & quantity > 0
          await prisma.cartProduct.create({
            data: {
              cart_id: cart.id,
              product_id: product.id,
              quantity,
              price: product.price,
            },
          })
        }
        // kalau quantity = 0 dan belum ada → nothing to do
      }
    }

    // Update total_cost
    const cartProducts = await prisma.cartProduct.findMany({
      where: { cart_id: cart.id },
    })

    const totalCost = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total_cost: totalCost },
    })

    return NextResponse.json(
      { message: 'Cart updated successfully', cart_id: cart.id },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
