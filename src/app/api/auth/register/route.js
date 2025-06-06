import { NextResponse } from "next/server";
const prisma = require("@/lib/prisma");

export async function POST(req) {
  const body = await req.json();
  const { name, role, password, phone } = body;

  if (!name || !phone || !password) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name: name,
      role: role,
      phone: phone,
      password: password,
    }, // password belum di-hash!
  });

  return NextResponse.json(
    { message: "Berhasil register", user },
    { status: 201 }
  );
}
