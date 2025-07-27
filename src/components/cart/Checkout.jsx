'use client'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'

const Checkout = ({ totalPrice, cartItems, payload }) => {
  const router = useRouter()


  const handleCheckout = () => {
    router.push('/checkout')
    createCheckout(payload)
  }

  const createCheckout = async (payload) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout/create-checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

    } catch (error) {
      if (error.status === 401) {
        router.push('/login')
      } else {
        console.log(error, ' something goes wrong....')
      }
    }
  }

  return (
    <div>
      <div className="bg-yellowCard w-100 h-30 px-4 py-2 d-flex flex-column justify-content-around">
        <div className="total-wrapper d-flex flex-row justify-content-end gap-3">
          <div className="text-greenSurface fw-bold">Total</div>
          <div className=" text-greenSurface fw-bold">{totalPrice}</div>
        </div>
        <button
          onClick={handleCheckout}
          className=" fw-bold  text-greenSurface border-transparent  "
        >
          <div className="bg-orange px-3 py-2 w-100  d-flex justify-content-center  align-items-center rounded-2 ">
            Checkout
          </div>
        </button>
      </div>
    </div>
  )
}

export default Checkout
