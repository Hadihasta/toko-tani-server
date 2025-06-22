"use client";
import Image from "next/image";
import ButtonLink from "@/components/buttonLink.jsx";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useReducer } from "react";

const initialState = { name: "", password: "" };

const reducer = (state, action) => {
  console.log(state, action, " <<<<< ");
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
  return (
    <>
      <div id="login-page">
        <div className=" index-head h-100vh container-sm flex flex-col justify-content-center align-items-center ">
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
                type="password"
                placeholder="Password"
              />
            </div>
          </div>

          <div style={{ zIndex: 1 }} className="button-wrapper pt-3">
            <ButtonLink href="" text="Log in" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
