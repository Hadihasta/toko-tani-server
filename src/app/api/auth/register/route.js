import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Menggunakan instance prisma dari file terpusat
import bcrypt from "bcrypt";

// POST /api/auth/register - Handle user registration
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, password, phone } = body;

    // 1. Validasi input dasar
    if (!name || !password || !phone) {
      return NextResponse.json(
        { error: "Nama, password, dan nomor telepon wajib diisi." },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
        return NextResponse.json(
            { error: "Password minimal harus 6 karakter." },
            { status: 400 }
        );
    }

    // 2. Cek apakah user sudah ada (berdasarkan nama atau telepon)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { phone: phone }
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nama atau nomor telepon sudah terdaftar." },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat user baru dengan role default 'user'
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        phone,
        role: "user", // Role default untuk pengguna yang mendaftar
      },
      // Jangan kembalikan password di response
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        created_at: true,
      }
    });

    return NextResponse.json(
        {
            success: true,
            message: "Registrasi berhasil! Silakan login.",
            data: user
        },
        { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
