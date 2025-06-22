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

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    // Get admin stats
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    ] = await Promise.all([
      // Total users (excluding admin)
      prisma.user.count({
        where: { role: 'user' }
      }),
      
      // Total products
      prisma.product.count(),
      
      // Total orders
      prisma.checkout.count(),
      
      // Total revenue (completed orders)
      prisma.checkout.aggregate({
        where: {
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
          status: 'PENDING'
        }
      }),
      
      // Completed orders
      prisma.checkout.count({
        where: {
          status: 'PAID'
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.cart?.total_cost || 0,
        pendingOrders,
        completedOrders
      }
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 