import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(request) {
  try {
    // Verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Token tidak valid" },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Get user stats
    const [
      totalProducts,
      totalSales,
      pendingOrders,
      completedOrders
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { user_id: userId }
      }),
      
      // Total sales (completed orders)
      prisma.checkout.aggregate({
        where: {
          user_id: userId,
          status: 'PAID'
        },
        _sum: {
          cart: {
            total_cost: true
          }
        }
      }),
      
      // Pending orders
      prisma.checkout.count({
        where: {
          user_id: userId,
          status: 'PENDING'
        }
      }),
      
      // Completed orders
      prisma.checkout.count({
        where: {
          user_id: userId,
          status: 'PAID'
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalSales: totalSales._sum.cart?.total_cost || 0,
        pendingOrders,
        completedOrders
      }
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 