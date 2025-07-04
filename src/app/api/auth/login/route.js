import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword } from '@/lib/bcrypt.js'
import { generateToken } from '@/lib/jwt'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, password } = body

    if (!name || !password) {
      return NextResponse.json({ error: 'Please Input Name and Password...' , status_code: 400 }, { status: 400 })
    }

    const result = await prisma.user.findFirst({
      where: {
        name: name,
      },
    })

    if (result) {
      const checkPassword = await comparePassword(password, result.password)
      if (!checkPassword) {
        return NextResponse.json({ error: 'Username atau Password Salah'  , status_code: 401 }, { status: 401 })
      } else {
        const token = generateToken({ id: result.id, role: result.role })

        return NextResponse.json(
          { message: 'login Succes', name, token  , status_code: 200   },
          {
            status: 200,
          }
        )
      }
    } else {
      return NextResponse.json({ error: 'User not found'  ,status_code: 404  }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'nama belum didaftarkan' },
      {
        status: 400,
      }
    )
  }
}
