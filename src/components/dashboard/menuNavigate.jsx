'use client'

import { useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { IconList, IconShoppingCart } from '@tabler/icons-react'
import { CartContext } from '@/store/CartContextProvider'

export default function MenuNavigate() {
  const { items, updateCart } = useContext(CartContext)
  const router = useRouter()
  const pathname = usePathname() 

  const handleSection = async (section) => {
    switch (section) {
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'cart':
        await updateCart()
        router.push('/cart')
        break
      default:
        break
    }
  }

  return (
    <div className="footer-wrapper" style={{ height: '105px' }}>
      <div className="footer-content bg-yellowBackground" style={{ height: '105px' }}>
        <div className="content-wrapper d-flex justify-content-evenly" style={{ height: '100%' }}>
          <button className='bg-transparent border-transparent' onClick={() => handleSection('dashboard')}>
            <IconList
              size={75}
              className={pathname.includes('/dashboard') ? 'text-greenThird' : 'text-greenSecondary'}
            />
          </button>
          <div className="d-flex flex-row">
            <button className='bg-transparent border-transparent' onClick={() => handleSection('cart')}>
              <IconShoppingCart
                size={75}
                className={pathname.includes('/cart') ? 'text-greenThird' : 'text-greenSecondary'}
              />
            </button >
            <div id="counter">
              {items.length > 0 && (
                <div
                  className="rounded-circle bg-greenSecondary d-flex justify-content-center border border-success border-3 fw-bold"
                  style={{ width: '30px', position: 'relative', bottom: '-40px' }}
                >
                  {items.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
