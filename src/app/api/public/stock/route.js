import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // Menggunakan instance prisma dari file terpusat

// GET /api/public/stock - Get all stocks for public view
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    // Build where clause
    const where = {
      quantity: {
        gt: 0 // Hanya tampilkan produk yang stoknya lebih dari 0
      }
    };
    
    if (category) {
      // Find category by name to get its ID
      const categoryObj = await prisma.category.findFirst({
        where: { name: { equals: category, mode: 'insensitive' } }
      });
      if (categoryObj) {
        where.categoryId = categoryObj.id;
      }
    }

    // Get stocks
    const stocks = await prisma.stock.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        sku: true,
        quantity: true,
        imageUrl: true, // Asumsikan ada field imageUrl di model Stock Anda
        category: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: stocks
    });

  } catch (error) {
    console.error('Error fetching public stocks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 