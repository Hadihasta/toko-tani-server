import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt.js";
import { generateToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json(
        { error: "Please Input Name and Password..." },
        { status: 400 }
      );
    }

    const result = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Nama belum didaftarkan" },
        { status: 400 }
      );
    }

    const checkPassword = await comparePassword(password, result.password);
    if (!checkPassword) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: result.id, role: result.role });

    return NextResponse.json(
      { message: "Login berhasil", name, token },
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
