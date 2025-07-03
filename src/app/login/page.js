'use client'
import Image from 'next/image'
import ButtonLink from '@/components/buttonLink.jsx'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useReducer } from 'react'
import axios from '@/lib/axios'

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
  const [setCredential, setCredentialDispatch] = useReducer(loginCredentialReducer, initialCredential)

  const handleLogin = async () => {
    const { name, password } = setCredential
    console.log(setCredential, ' <<< ')
    // if (!name || !password) {
    //   alert("Harap isi username dan password.");
    //   return;
    // }

    try {
     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, setCredential);
      // console.log("Login berhasil", res.data);
      // localStorage.setItem("token", res.data.token);

      // redirect ke halaman dashboard user
      // window.location.href = "/user/dashboard";
      console.log(res)
    } catch (error) {
      console.log(error , " << ")
      // alert(error.response?.data?.message || "Login gagal. Coba lagi.");
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
