"use client";
import Image from "next/image";
import Button from "@/components/Button.jsx";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useReducer, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const initialState = { name: "", password: "" };

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const LoginPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login, loading, error, isAuthenticated, getDashboardPath } = useAuth();
  const router = useRouter();

  // Redirect jika sudah login
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const dashboardPath = getDashboardPath();
      console.log('Redirecting to:', dashboardPath);
      router.push(dashboardPath);
    }
  }, [isAuthenticated, loading, router, getDashboardPath]);

  const handleLogin = async () => {
    // Validasi input
    if (!state.name.trim() || !state.password.trim()) {
      alert('Username dan password harus diisi!');
      return;
    }

    try {
      console.log('Attempting login for:', state.name);
      await login({
        name: state.name,
        password: state.password
      });
      
      console.log('Login successful, user should be redirected');
      
      // Reset form setelah login berhasil
      dispatch({ type: "RESET" });
      
      // Redirect akan dilakukan oleh useEffect di atas
    } catch (err) {
      // Error sudah ditangani oleh useAuth hook
      console.error('Login error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div id="login-page">
        <div className=" index-head h-100vh container-sm flex flex-col justify-content-center align-items-center ">
          {/* Loading overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span>Memproses...</span>
              </div>
            </div>
          )}

          <div>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 25, opacity: 1 }}
              transition={{
                type: "spring",
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
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-danger mb-3"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            <div>
              <Input
                placeholder="Username"
                name="name"
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "CHANGE",
                    field: "name",
                    value: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
            <div className="pt-3">
              <Input
                name="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: "CHANGE",
                    field: "password",
                    value: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                type="password"
                placeholder="Password"
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ zIndex: 1 }} className="button-wrapper pt-3">
            <Button 
              text="Log in" 
              onClick={handleLogin}
              loading={loading}
              disabled={!state.name.trim() || !state.password.trim() || loading}
            />
          </div>

          <div className="text-center mt-4 text-sm">
            <span className="text-gray-600">Belum punya akun? </span>
            <Link href="/register" className="font-medium text-green-600 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
