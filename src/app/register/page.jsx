'use client'

import { Input } from '@/components/ui/input'
import { useReducer } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const initialCredential = { name: '', password: '', phone: '' }

const registerCredentialReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialCredential
    default:
      return state
  }
}

const register = () => {
      const router = useRouter()
  const [setCredential, setCredentialDispatch] = useReducer(registerCredentialReducer, initialCredential)

  const handleRegister = async () => {
    const { name, password, phone } = setCredential

    const body = {
      name,
      password,
      role: '',
      phone,
    }



    let message = ''

    if (!name || !password || !phone) {
      message = 'Harap isi Username, Password dan, Nomor Telfon .'
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, body)
      if (res.status === 201) {
        let message = res.data.message
      
        toast(message, {
          style: {
            backgroundColor: '#b9f8cf',
            color: '#009966',
            border: '#05df72',
          },
        })

           router.push('/login')
      }

 
    } catch (error) {
      let message = error.response.data.message
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
      <div id="register-page">
        <div className=" index-head h-100vh container-sm  d-flex flex-column justify-content-center align-items-center ">
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
            <div className="pt-3">
              <Input
                name="phone"
                value={setCredential.phone}
                onChange={(e) =>
                  setCredentialDispatch({
                    type: 'CHANGE',
                    field: 'phone',
                    value: e.target.value,
                  })
                }
                placeholder="phone number"
              />
            </div>
          </div>

          <div
            style={{ zIndex: 1 }}
            className="button-wrapper pt-3 d-flex flex-column gap-4"
          >
            <button
              onClick={handleRegister}
              className="py-2 px-4 border rounded-4 bg-softPrimary text-greenPrimary fw-700"
            >
              Register Your Account
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default register
