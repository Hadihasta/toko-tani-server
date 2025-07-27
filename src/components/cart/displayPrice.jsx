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
    <div className="d-flex flex-column flex-grow-1 justify-content-center gap-2">
      <div
        className="displayPrice-wrapper d-flex flex-auto align-items-center justify-content-center  fs-15 px-2 "
        style={{ gap: '0.5rem' }}
      >
        <div
          className="counter rounded-circle bg-greenSecondary d-flex justify-content-center border border-success border-3 fw-bold"
          style={{ width: '30px' }}
        >
          {quantity}
        </div>
        <div className="times">X</div>
        <div className="price fw-bold  ">{data.price}</div>
        <div> = </div>
        <div className="total-price fw-bold  text-greenSurface">{totalPrice}</div>
      </div>

      <div className="action-wrapper d-flex flex-row gap-1 px-4 justify-content-center">
        <div className="d-flex flex-grow w-50">
          <button
            onClick={handleDecrement}
            className="w-100 border bg-errorButton rounded-4 d-flex justify-content-center py-1"
          >
            <IconCircleMinus className="text-white"></IconCircleMinus>
          </button>
        </div>
        <div className="d-flex flex-grow  w-50">
          <button
            onClick={handleIncrement}
            className="w-100 border  rounded-4 bg-successButton d-flex  justify-content-center py-1"
          >
            <IconCirclePlus className="text-white"></IconCirclePlus>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisplayPrice
