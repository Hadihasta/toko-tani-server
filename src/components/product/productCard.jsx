import { useContext } from 'react'
import { CartContext } from '@/store/CartContextProvider'
import { IconCirclePlus, IconCircleMinus } from '@tabler/icons-react'

const ProductCard = ({ product }) => {
  const { items, addItemToCart , removeItemFromCart} = useContext(CartContext)


  return (
    <>
      <div
        className="bg-yellowCard rounded-4 p-3 "
        style={{ minWidth: '115px', height: '275px' }}
      >
        <div className="card-wrapper h-100 flex  flex-col ">
          <div className="description-wrapper  flex  flex-col align-items-center flex-grow-1">
            <div className="flex-grow-1 flex flex-row">
              <img
                src={product.photo}
                alt={product.name}
                className="w-full object-contain "
                style={{ minHeight: '80px', maxHeight: '120px' }}
              />
              <div id="counter">
                <div>
                  {items.map((item) => {
                    if (item.id === product.id) {
                      const quantity = item.quantity
                      return (
                        <div
                          key={item.id}
                          className="rounded-circle bg-greenSecondary flex justify-center border border-success border-3 fw-bold"
                          style={{  width: '30px', position: 'relative', left: '-10px', top: '-10px' }}
                        >
                          {quantity}
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </div>
            <div
              className="label-wrapper flex  flex-col align-items-center"
              style={{ minHeight: '80px' }}
            >
              <div className="product-name">{product.name}</div>
              <div className="product-Price">{product.price}</div>
            </div>
          </div>
          <div className="action-wrapper flex flex-row gap-1 ">
            <div className="flex flex-grow justify-center">
              <button
               onClick={() => removeItemFromCart(product)}
              className="w-full bg-errorButton rounded-4 flex  justify-center py-1">
                <IconCircleMinus className="text-white"></IconCircleMinus>
              </button>
            </div>
            <div className="flex flex-grow justify-center">
              <button
                onClick={() => addItemToCart(product)}
                className="w-full  rounded-4 bg-successButton flex  justify-center py-1"
              >
                <IconCirclePlus className="text-white"></IconCirclePlus>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
