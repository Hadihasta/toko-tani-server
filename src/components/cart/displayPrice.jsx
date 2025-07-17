import { useState } from 'react'
import { IconCirclePlus, IconCircleMinus } from '@tabler/icons-react'

const DisplayPrice = ({ data, updateQuantity } ) => {
  const [quantity, setQuantity] = useState(data.quantity)



  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
        updateQuantity(data.id, quantity + 1);
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1)
        updateQuantity(data.id, quantity - 1);
    }
  }

  const totalPrice = quantity * data.price

  return (
    <div className="flex flex-col flex-grow-1">
      <div
        className="displayPrice-wrapper flex flex-auto align-items-center justify-content-center  fs-15 px-2 "
        style={{ gap: '0.5rem' }}
      >
        <div
          className="counter rounded-circle bg-greenSecondary flex justify-center border border-success border-3 fw-bold"
          style={{ width: '30px' }}
        >
          {quantity}
        </div>
        <div className="times">X</div>
        <div className="price font-bold  ">{data.price}</div>
        <div> = </div>
        <div className="total-price font-bold  text-greenSurface">{totalPrice}</div>
      </div>

      <div className="action-wrapper flex flex-row gap-1 px-4 ">
        <div className="flex flex-grow justify-center">
          <button
            onClick={handleDecrement}
            className="w-full bg-errorButton rounded-4 flex  justify-center py-1"
          >
            <IconCircleMinus className="text-white"></IconCircleMinus>
          </button>
        </div>
        <div className="flex flex-grow justify-center">
          <button
            onClick={handleIncrement}
            className="w-full  rounded-4 bg-successButton flex  justify-center py-1"
          >
            <IconCirclePlus className="text-white"></IconCirclePlus>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisplayPrice
