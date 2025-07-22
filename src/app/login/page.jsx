'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useReducer } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'

const initialCredential = { name: '', password: '' }

const loginCredentialReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialCredential
    default:
      return state
  }
}
const LoginPage = () => {
  const router = useRouter()
  const [setCredential, setCredentialDispatch] = useReducer(loginCredentialReducer, initialCredential)

  const handleLogin = async () => {
    const { name, password } = setCredential

    const body = {
      name,
      password,
    }

    let message = ''

    if (!name || !password) {
      message = 'Harap isi Username dan Password.'
      toast(message, {
        style: {
          backgroundColor: '#ffa2a2',
          color: '#e7000b',
          border: '#460809',
        },
      })
      return
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, body)
      if (res.data.status_code === 200) {
        let message = res.data.message
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('id_user', res.data.id_user)
        toast(message, {
          style: {
            backgroundColor: '#b9f8cf',
            color: '#009966',
            border: '#05df72',
          },
        })
      }

      if (res.data.role === 'admin') {
        router.push('admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      let message = error.response.data.error
      toast(message, {
        style: {
          backgroundColor: '#ffa2a2',
          color: '#e7000b',
          border: '#460809',
        },
      })
    }
  }

  return (
    <>
      <div id="login-page">
        <div className=" index-head h-100vh container-sm flex flex-col justify-content-center align-items-center ">
          <div>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 25, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 60,
                damping: 12,
                delay: 0.3,
              }}
            >
              <div className="pb-4 content-wrapper flex flex-col justify-content-center align-items-center">
                <Image
                  src="/images/logo_tani.svg"
                  alt="toko_tani.logo"
                  width={200}
                  height={200}
                />
              </div>
            </motion.div>
          </div>

          <div className="form-wrapper pt-5">
            <div>
              <Input
                placeholder="Username"
                name="name"
                value={setCredential.name}
                onChange={(e) =>
                  setCredentialDispatch({
                    type: 'CHANGE',
                    field: 'name',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="pt-3">
              <Input
                name="password"
                value={setCredential.password}
                onChange={(e) =>
                  setCredentialDispatch({
                    type: 'CHANGE',
                    field: 'password',
                    value: e.target.value,
                  })
                }
                type="password"
                placeholder="Password"
              />
            </div>
          </div>

          <div
            style={{ zIndex: 1 }}
            className="button-wrapper pt-3"
          >
            <button
              onClick={handleLogin}
              className="py-2 px-4 rounded-4 bg-softPrimary text-greenPrimary fw-700"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
