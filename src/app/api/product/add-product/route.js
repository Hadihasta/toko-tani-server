import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try{
  const data = await req.formData()

  const user_id = data.get('user_id')
  const name = data.get('name')
  const photo = data.get('photo')
  const description = data.get('description')
  const price = data.get('price')
  const weight = data.get('weight')
  const stock = data.get('stock')
  const category_id = data.get('category_id')

  if (!name || !photo || !price || !stock) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const bytes = await photo.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const fileName = `${Date.now()}-${photo.name}`
  const filePath = path.join(uploadDir, fileName)

  await writeFile(filePath, buffer)

  const photoPath = `/uploads/${fileName}`
//   const slug = name.toLowerCase().replace(/\s+/g, '-')

  const createProduct = await prisma.product.create({
    data: {
      user_id:Number(user_id),
      name,
      description,
      photo: photoPath,
      price: Number(price),
      weight: Number(weight),
      stock: Number(stock),
      category_id: Number(category_id), 
    //   slug,
      is_active: true,
      keywords: name,
    },
  })

  return NextResponse.json({ message: 'Berhasil Menambahkan Product', createProduct }, { status: 201 })

    } catch (error) {
    return NextResponse.json(
      { message: 'Something Goes wrong....' },
      {
        status: 400,
      }
    )
  }
}
