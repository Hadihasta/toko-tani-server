import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    // Ambil query params dari URL
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const query = parseInt(searchParams.get('query')) || 0 // query = category_id

    // Hitung total data (dengan atau tanpa filter)
    const total = await prisma.product.count({
      where: query === 0 ? {} : { category_id: query }
    })

    const totalPage = Math.ceil(total / limit)

    // Ambil data produk (dengan atau tanpa filter)
    const result = await prisma.product.findMany({
      where: query === 0 ? {} : { category_id: query },
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
    console.error(error)
    return NextResponse.json(
      { message: 'Something Goes Wrong...' },
      { status: 400 }
    )
  }
}
