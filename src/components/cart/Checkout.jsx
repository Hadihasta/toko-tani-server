import { useRouter } from 'next/navigation'

const Checkout = ({ totalPrice }) => {
  const router = useRouter()

  const handleCheckout = () => {
    // router.push('/checkout')
    console.log('fetch api and redirect ')
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
