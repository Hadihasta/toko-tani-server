'use client'

import MenuNavigate from '@/components/dashboard/menuNavigate'
import { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'

const Checkout = () => {
  const [totalCost, setTotalCost] = useState('')
  const [checkoutStatus, setCheckoutStatus] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    const getMasterCheckout = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/get-cart-totalcost`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const formatted = formatRupiah(res.data.data.total_cost)
        setTotalCost(formatted)
      } catch (error) {
        console.error('Gagal mengambil total cost:', error)
      }
    }

    const getStatusCheckout = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checkout/get-status-checkout`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setCheckoutStatus(res.data)
      } catch (error) {
        console.error('Error on status checkout', error)
      }
    }

    getMasterCheckout()
    getStatusCheckout()
  }, [])

  function formatRupiah(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const token = localStorage.getItem('token')

      const checkoutRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checkout/get-checkout-active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const checkoutId = checkoutRes.data?.checkout_id
      if (!checkoutId) {
        throw new Error('Gagal mendapatkan checkout_id')
      }

      const formData = new FormData()
      formData.append('invoice', file)
      formData.append('checkout_id', checkoutId)

      const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoice/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setCheckoutStatus(uploadRes.data.data)
    } catch (error) {
      console.error('Upload gagal:', error)
    }
  }

  return (
    <div
      className="fullHeight-wrapper flex flex-col"
      style={{ height: '100%' }}
    >
      <div className="head-wrapper relative px-4">
        <div
          className="d-flex bg-yellowBackground"
          style={{ height: '30px', borderRadius: '0px 0px 60px 60px' }}
        />
      </div>

      <div className="body-wrapper p-3 m-4 bg-yellowCard rounded flex flex-col flex-grow-1">
        <div className="bank-wrapper flex flex-col justify-content-center align-items-center">
          <div className="font-bold fs-12">Transfer Bank BCA</div>
          <div className="font-medium fs-15">a.n Bambang Sumatra 0942XXXXX</div>
        </div>

        <div className="Total-wrapper flex flex-col justify-content-center align-items-center flex-1">
          <div className="text-greenSurface font-bold fs-24">
            <span>Rp.</span>
            {totalCost}
          </div>
        </div>

        <div className="flex justify-content-center align-items-center flex-1">
          {(checkoutStatus?.status === undefined || checkoutStatus?.status === 'PENDING') && (
            <button
              onClick={handleUploadClick}
              className="button-wrapper bg-orange font-bold px-3 py-2 w-100 flex justify-content-center align-items-center text-greenSurface  rounded-2"
            >
              Upload Bukti Transfer
            </button>
          )}

          {checkoutStatus?.status === 'PAID' && (
            <p className="text-sm text-greenSurface font-bold">Menunggu Admin Untuk Memproses Pesananmu</p>
          )}

          {checkoutStatus?.status === 'APPROVED' && (
            <p className="text-sm text-greenSurface font-bold">Dana diterima, Admin sedang memproses pengiriman</p>
          )}
          {checkoutStatus?.status === 'FINISH' && (
            <p className="text-sm text-greenSurface font-bold">Pesanan sudah dikirim</p>
          )}

          {checkoutStatus?.status === 'CANCELLED' && (
            <div className="flex flex-col justify-center align-items-center ">
              <p className="text-sm text-pink-800 font-bold">Maaf, Stock sedang Habis</p>
              <p className="text-sm  font-bold">Silakan hubungi 08218222XXXX untuk Refund</p>
            </div>
          )}
          {checkoutStatus?.status === 'FAILED' && (
            <div className="flex flex-col justify-center align-items-center ">
              <p className="text-sm text-pink-800 font-bold">Maaf, Dana tidak masuk</p>
              <p className="text-sm  font-bold">Silakan hubungi 08218222XXXX untuk Bantuan</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <MenuNavigate />
    </div>
  )
}

export default Checkout
