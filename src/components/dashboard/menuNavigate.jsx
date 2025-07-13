'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { IconList, IconShoppingCart } from '@tabler/icons-react'
import { CartContext } from '@/store/CartContextProvider'

export default function MenuNavigate() {
  const {items, updateCart}= useContext(CartContext)


  // console.log(items ,  "<<<<" )
  const router = useRouter()

const handleSection = async (section) => {
  switch (section) {
    case 'dashboard':
      router.push('/dashboard');
      break;
    case 'cart':
      await updateCart()
      router.push('/cart');
      break;
    default:
      break;
  }
};

  return (
    <div
      className="footer-wrapper"
      style={{ height: '105px' }}
    >
      <div
        className="footer-content bg-yellowBackground"
        style={{ height: '105px' }}
      >
        <div
          className="content-wrapper flex justify-content-evenly"
          style={{ height: '100%' }}
        >
          <button onClick={() => handleSection('dashboard')}>
            <IconList
              size={75}
              className="text-greenSecondary"
            />
          </button>
          <div className="flex flex-row">
            <button onClick={() => handleSection('cart')}>
              <IconShoppingCart
                size={75}
                className="text-greenSecondary"
              />
            </button>
            <div id="counter">
              {items.length > 0 && (
                <div
                  className="rounded-circle bg-greenSecondary flex justify-center border border-success border-3 fw-bold"
                  style={{  width: '30px', position: 'relative', bottom: '-40px' }}
                >
                 {items.length }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
