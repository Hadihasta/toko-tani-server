'use client'

import { useRouter } from 'next/navigation'
import { IconList, IconShoppingCart } from '@tabler/icons-react'

export default function MenuNavigate() {
  const router = useRouter()

  const handleSection = (section) => {
    switch (section) {
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'cart':
        router.push('/cart')
        break
      default:
        break
    }
  }

  return (
    <div className="footer-wrapper" style={{ height: '105px' }}>
      <div className="footer-content bg-yellowBackground" style={{ height: '105px' }}>
        <div className="content-wrapper flex justify-content-evenly" style={{ height: '100%' }}>
          <button onClick={() => handleSection('dashboard')}>
            <IconList size={75} className="text-greenSecondary" />
          </button>
          <button onClick={() => handleSection('cart')}>
            <IconShoppingCart size={75} className="text-greenSecondary" />
          </button>
        </div>
      </div>
    </div>
  )
}
