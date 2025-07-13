'use client'
import { useState } from 'react'
import { createContext } from 'react'
import axios from '@/lib/axios'

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  updateCart: () => {},
})

export default function CartContextProvider({ children }) {
  const [shoppingCart, setShoppingCart] = useState({ items: [] })

  const handleAddItemToCart = (product) => {
    setShoppingCart((prev) => {
      const updatedItems = [...prev.items]
      if (updatedItems.length === 0) {
        updatedItems.push({ ...product, quantity: 1 })
        // console.log(updatedItems, 'item pertama di cart')
        return { items: updatedItems }
      } else {
        const updatedItems = [...prev.items]

        const existingItemIndex = updatedItems.findIndex((item) => item.id === product.id)

        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex].quantity += 1

          // console.log(updatedItems[existingItemIndex].quantity, ' <<<< ini item lama yang ada')
        } else {
          updatedItems.push({ ...product, quantity: 1 })
          // console.log(updatedItems, '<<<< kalo gk ada ini item baru')
        }

        return { items: updatedItems }
      }
    })
  }

  const handleRemoveItemFromCart = (product) => {
    setShoppingCart((prev) => {
      const updatedItems = [...prev.items]
      if (updatedItems.length === 0) {
        return { items: updatedItems }
      } else {
        let updatedItems = [...prev.items]

        const existingItemIndex = updatedItems.findIndex((item) => item.id === product.id)

        if (existingItemIndex !== -1) {
          if (updatedItems[existingItemIndex].quantity > 0) {
            updatedItems[existingItemIndex].quantity -= 1
          }
        }
        updatedItems = updatedItems.filter((item) => item && item.quantity > 0)

        return { items: updatedItems }
      }
    })
  }

  const handleUpdatecart = async () => {
    try {
      const token = localStorage.getItem('token')


      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/create-cart`,
        {
          products: shoppingCart.items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

    } catch (err) {
      console.error('Update cart failed:', err)
    }
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    removeItemFromCart: handleRemoveItemFromCart,
    updateCart: handleUpdatecart,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
