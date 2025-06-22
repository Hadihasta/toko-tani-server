import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt.js";
import { generateToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, password } = body;

    console.log("Login attempt for user:", name);

    if (!name || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const result = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    console.log("User found:", result ? "Yes" : "No");

    if (!result) {
      return NextResponse.json(
        { error: "Username tidak ditemukan" },
        { status: 400 }
      );
    }

    const checkPassword = await comparePassword(password, result.password);
    console.log("Password check:", checkPassword ? "Valid" : "Invalid");

    if (!checkPassword) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: result.id, role: result.role });
    console.log("Token generated successfully");

    return NextResponse.json(
      { 
        success: true,
        message: "Login berhasil", 
        name: result.name, 
        token,
        user: {
          id: result.id,
          name: result.name,
          role: result.role
        }
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
