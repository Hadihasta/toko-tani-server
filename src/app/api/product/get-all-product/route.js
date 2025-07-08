import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    // Ambil query params dari URL
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1 // default page 1
    const limit = parseInt(searchParams.get('limit')) || 10 // default limit 10

    // Hitung total data
    const total = await prisma.product.count()
    const totalPage = Math.ceil(total / limit)

    // Ambil data sesuai page
    const result = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json(
      {
        message: 'Success Get All Product',
        pagination: {
          totalData: total,
          totalPage: totalPage,
          currentPage: page,
          limit: limit,
        },
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Something Goes Wrong...' },
      { status: 400 }
    )
  }
}
