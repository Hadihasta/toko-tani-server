'use client'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import MenuNavigate from '@/components/dashboard/menuNavigate'
// import ProductCard from '@/components/product/productCard'

const CartPage = () => {
  const [cart, setCart] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const getMasterCart = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/get-cartid`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCart(res.data.data)
        // console.log(res, ' <<< we did it ')
      } catch (error) {
        console.log(error, ' <<<  ')
      }
    }
    getMasterCart()
  }, [])
  return (
    <>
      <div className="fullHeight-wrapper flex flex-col"
         style={{ height: '100%' }}>
        <div className="head-wrapper relative px-4">
          <div
            className="d-flex bg-yellowBackground"
            style={{
              height: '30px',
              borderRadius: '0px 0px 60px 60px',
            }}
          />
        </div>
        <div className="content-wrapper px-4   flex-grow-1  overflow-x-visible overflow-scroll">
          <h1>Cart</h1>
          {cart && <pre>{JSON.stringify(cart, null, 2)}</pre>}
        </div>
        <MenuNavigate />
      </div>
    </>
  )
}

export default CartPage
