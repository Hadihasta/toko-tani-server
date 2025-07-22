import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1)
    const limit = Math.max(parseInt(searchParams.get('limit')) || 10, 1)

    const total = await prisma.checkout.count()

    const totalPage = Math.ceil(total / limit)

    const data = await prisma.checkout.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
          cart: {
      select: {
        total_cost: true,
      },
    },

      },
    })

    return NextResponse.json(
      {
        message: 'Success Get All Checkout',
        pagination: {
          totalData: total,
          totalPage,
          currentPage: page,
          limit,
        },
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error GET /checkout with pagination:', error)
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    )
  }
}
