'use client';

import React from 'react'
import Image from 'next/image'

const MenuCategorie = ({ onSelect }) => {
  return (
    <>
      <button
        className="bg-transparent border-transparent d-flex flex-column"
        onClick={() => onSelect(0)}
      >
        <Image src="icons/icon-all.svg" alt="toko_tani.logo" width={70} height={70} />
        <span> All </span>
      </button>

      <button
        className="bg-transparent border-transparent d-flex flex-column"
        onClick={() => onSelect(1)}
      >
        <Image src="icons/pupuk.svg" alt="toko_tani.logo" width={70} height={70} />
        <span> Pupuk </span>
      </button>

      <button
        className="bg-transparent border-transparent d-flex flex-column"
        onClick={() => onSelect(2)}
      >
        <Image src="icons/obat.svg" alt="toko_tani.logo" width={70} height={70} />
        <span> Obat </span>
      </button>

      <button
        className="bg-transparent border-transparent d-flex flex-column"
        onClick={() => onSelect(3)}
      >
        <Image src="icons/alat-tani.svg" alt="toko_tani.logo" width={70} height={70} />
        <span> Alat Tani </span>
      </button>
    </>
  )
}

export default MenuCategorie
