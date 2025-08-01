import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt.js";

export async function POST(req) {
  const body = await req.json();
  const { name, role, password, phone } = body;
  if (!name || !phone || !password) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

let finalRole = ""

  if (role === "") { 
    finalRole = "user" 
  }else { 
    finalRole = "admin"
  }
    

  const result = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });

  if (result) {
    return NextResponse.json(
      { message: "nama sudah digunakan", result },
      { status: 400 }
    );
  }

  const bcryptPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name: name,
      role: finalRole,
      phone: phone,
      password: bcryptPassword,
    },
  });

  return NextResponse.json(
    { message: "Berhasil register silakan login", user },
    { status: 201 }
  );
}
