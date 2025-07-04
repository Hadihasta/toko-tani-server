import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const data = await req.formData()
    console.log(data , " <<< ")

  const file = data.get('photo')

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const fileName = `${Date.now()}-${file.name}`
  const filePath = path.join(uploadDir, fileName)

  await writeFile(filePath, buffer)

  const photoPath = `/product-asset/${fileName}`

  return NextResponse.json({ photo: photoPath }, { status: 200 })
}
