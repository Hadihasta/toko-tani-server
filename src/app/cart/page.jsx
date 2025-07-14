'use client'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import MenuNavigate from '@/components/dashboard/menuNavigate'
import ProductDisplay from '@/components/cart/productDisplay'
import DisplayPrice from '@/components/cart/displayPrice'

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

      } catch (error) {
        console.log(error , " something goes wrong....")
      }
    }
    getMasterCart()
  }, [])
  return (
    <>
      <div
        className="fullHeight-wrapper flex flex-col"
        style={{ height: '100%' }}
      >
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
          {cart?.cartProducts?.map((products, index) => {
            return (
              <div className="display-wrapper py-3 flex"
               key={products.id}>
                <ProductDisplay data={products}/>
                <DisplayPrice data={products} />
              </div>
            )
          })}
        </div>
        <MenuNavigate />
      </div>
    </>
  )
}

export default CartPage
