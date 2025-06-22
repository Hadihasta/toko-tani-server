import Image from "next/image";
// import { IconArrowLeft } from "@tabler/icons-react";
/* <IconArrowLeft size="100" className="bg-primary" /> */
export default function Home() {
  return (
    <div>
      <div id="landing-page-wrapper ">
        <div className=" h-100vh container-sm flex flex-col justify-content-center align-items-center ">
          <div className=" mbp-60 mbp-sm-20 content-wrapper flex flex-col justify-content-center align-items-center">
            <Image
              src="/images/logo_tani.svg"
              alt="toko_tani.logo"
              width={200}
              height={200}
            />
            <div className="text-greenSurface fs-20 text-center">
              Toko Sedulur Tani
            </div>
            <div className="fw-300 fs-12 px-2 flex  justify-content-center  align-items-center text-center ">
              Selamat datang di store Sedulur Tani beragam menarik obat tanaman,
              pupuk dan alat pertanian
            </div>
          </div>

          <div className="  button-wrapper">
            <button className="py-2 px-4 rounded-4 bg-softPrimary text-greenPrimary fw-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
