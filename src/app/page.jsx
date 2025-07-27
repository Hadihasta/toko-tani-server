"use client";
import Image from "next/image";
import ButtonLink from "@/components/buttonLink.jsx";
import { motion } from "framer-motion";


export default function Home() {
  return (
    <div>
      <div id="landing-page-wrapper ">
        <div className=" h-100vh container-sm  d-flex flex-column justify-content-center align-items-center ">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 12,
              delay: 0.3,
            }}
          >
            <div className=" mbp-60 mbp-sm-20 content-wrapper d-flex flex-column justify-content-center align-items-center"  style={{justifyItems : 'center' } }>
              <Image
                src="/images/logo_tani.svg"
                alt="toko_tani.logo"
                width={200}
                height={200}
              />
              <div className="mt-2 text-greenSurface fs-20 text-center">
                Toko Sedulur Tani
              </div>
              <div className="fw-300 fs-12 px-2 flex  justify-content-center  align-items-center text-center ">
                Selamat datang di store Sedulur Tani beragam menarik obat
                tanaman, pupuk dan alat pertanian
              </div>
            </div>
          </motion.div>

          <div style={{ zIndex: 1 }} className="button-wrapper">
            <ButtonLink href="/login" text="Get Started" />
          </div>
        </div>
      </div>
    </div>
  );
}
