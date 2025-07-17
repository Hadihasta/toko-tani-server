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
      <div className="bg-yellowCard w-100 h-30 px-4 py-2 flex flex-col justify-content-around">
        <div className="total-wrapper flex flex-row justify-content-end gap-3">
          <div className="text-greenSurface font-bold">Total</div>
          <div className=" text-greenSurface font-bold">{totalPrice}</div>
        </div>
        <button
          onClick={handleCheckout}
          className=" font-bold  text-greenSurface "
        >
          <div className="bg-orange px-3 py-2 w-100  flex justify-content-center  align-items-center rounded-2 ">
            Checkout
          </div>
        </button>
      </div>
    </div>
  )
}

export default Checkout
