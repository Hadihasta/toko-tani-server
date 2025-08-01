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
      className="fullHeight-wrapper d-flex flex-column"
      style={{ height: '100%' }}
    >
      <div className="head-wrapper relative px-4">
        <div
          className="d-flex bg-yellowBackground"
          style={{ height: '30px', borderRadius: '0px 0px 60px 60px' }}
        />
      </div>

      <div className="body-wrapper p-3 m-4 bg-yellowCard rounded d-flex flex-column flex-grow-1">
        <div className="bank-wrapper d-flex flex-column justify-content-center align-items-center">
          <div className="fw-bold fs-12">Transfer Bank BCA</div>
          <div className="fw-medium fs-15">a.n Bambang Sumatra 0942XXXXX</div>
        </div>

        <div className="Total-wrapper d-flex flex-column justify-content-center align-items-center flex-grow-1">
          <div className="text-greenSurface fw-bold fs-24">
            <span>Rp.</span>
            {totalCost}
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center flex-1">
          {(checkoutStatus?.status === undefined || checkoutStatus?.status === 'PENDING') && (
            <button
              onClick={handleUploadClick}
              className="button-wrapper bg-orange fw-bold px-3 py-2 w-100 d-flex justify-content-center border align-items-center text-greenSurface  rounded-2"
            >
              Upload Bukti Transfer
            </button>
          )}

          {checkoutStatus?.status === 'PAID' && (
            <p className="text-sm text-greenSurface fw-bold d-flex text-center">Menunggu Admin Untuk Memproses Pesananmu</p>
          )}

          {checkoutStatus?.status === 'APPROVED' && (
            <p className="text-sm text-greenSurface fw-bold text-center">Dana diterima, Admin sedang memproses pengiriman</p>
          )}
          {checkoutStatus?.status === 'FINISH' && (
            <p className="text-sm text-greenSurface fw-bold text-center">Pesanan sudah dikirim</p>
          )}

          {checkoutStatus?.status === 'CANCELLED' && (
            <div className="flex flex-column justify-center align-items-center ">
              <p className="text-sm text-danger fw-bold text-center">Maaf, Stock sedang Habis</p>
              <p className="text-sm  fw-bold text-center">Silakan hubungi 08218222XXXX untuk Refund</p>
            </div>
          )}
          {checkoutStatus?.status === 'FAILED' && (
            <div className="flex flex-column justify-center align-items-center ">
              <p className="text-sm text-danger fw-bold text-center">Maaf, Dana tidak masuk</p>
              <p className="text-sm  fw-bold text-center">Silakan hubungi 08218222XXXX untuk Bantuan</p>
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
