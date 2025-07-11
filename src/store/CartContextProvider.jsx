'use client'
import { useState } from 'react'
import { createContext } from 'react'

  export const CartContext = createContext({
    items : [],
    addItemToCart: () => {},
    // updateItemQuantity: () => {},
})

export default function CartContextProvider({ children }) {
const [shoppingCart, setShoppingCart] = useState({ items: [] })


  const handleAddItemToCart = (product) => {
    // console.log(product , " trigger on store")
    setShoppingCart((prev) => {
      const updatedItems = [...prev.items]
      const existingItemIndex = updatedItems.findIndex((item) => item.id === product.id)
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1
      } else {
        updatedItems.push({ ...product, quantity: 1 })
      }
      return { items: updatedItems }
    })
  }

const ctxValue = { 
  items : shoppingCart.items,
  addItemToCart : handleAddItemToCart
}


  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
