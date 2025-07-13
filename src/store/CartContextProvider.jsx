'use client'
import { useState } from 'react'
import { createContext } from 'react'

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
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


  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    removeItemFromCart: handleRemoveItemFromCart,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
