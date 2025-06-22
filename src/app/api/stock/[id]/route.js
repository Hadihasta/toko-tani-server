import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/stock/[id] - Get stock by ID
export async function GET(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    const stock = await prisma.stock.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        supplier: true,
        stockHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stock
    });

  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stock/[id] - Update stock
export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, sku, quantity, price, categoryId, supplierId, minStock } = body;

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStock) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Check if SKU already exists (if changed)
    if (sku && sku !== existingStock.sku) {
      const skuExists = await prisma.stock.findUnique({
        where: { sku }
      });

      if (skuExists) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Update stock
    const updatedStock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        description: description || undefined,
        sku: sku || undefined,
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        minStock: minStock !== undefined ? parseInt(minStock) : undefined,
        categoryId: categoryId || null,
        supplierId: supplierId || null,
        updatedBy: authResult.user.id
      },
      include: {
        category: true,
        supplier: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedStock,
      message: 'Stock updated successfully'
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/[id] - Delete stock
export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStock) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Delete stock
    await prisma.stock.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Stock deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 