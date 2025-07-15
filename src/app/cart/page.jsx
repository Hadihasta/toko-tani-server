'use client'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import MenuNavigate from '@/components/dashboard/menuNavigate'
import ProductDisplay from '@/components/cart/productDisplay'
import DisplayPrice from '@/components/cart/displayPrice'
import Checkout from '@/components/cart/Checkout'

const CartPage = () => {
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState(cart)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const getMasterCart = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/get-cartid`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCart(res.data.data)
        setCartItems(res.data.data.cartProducts)
      } catch (error) {
        console.log(error, ' something goes wrong....')
      }
    }
    getMasterCart()
  }, [])

  const updateQuantity = (id, newQty) => {
  setCartItems(prev => {
    const updated = prev.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    console.log(updated , " <<< ");
    // kirim ini ke api namun olah dulu 
    return updated;
  });
};
  const totalPrice = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0

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
              <div
                className="display-wrapper py-3 flex"
                key={products.id}
              >
                <ProductDisplay data={products} />
                <DisplayPrice
                  key={products.id}
                  data={products}
                  updateQuantity={updateQuantity}
                />
              </div>
            )
          })}
        </div>
        <Checkout totalPrice={totalPrice} />
        <MenuNavigate />
      </div>
    </>
  )
}

export default CartPage
