import { useContext } from 'react'
import { CartContext } from '@/store/CartContextProvider'
import { IconCirclePlus, IconCircleMinus } from '@tabler/icons-react'

const ProductCard = ({ product }) => {
  const { items, addItemToCart, removeItemFromCart } = useContext(CartContext)

  return (
    <>
      <div
        className="bg-yellowCard rounded-4 p-3 "
        style={{ minWidth: '115px', height: '275px' }}
      >
        <div className="card-wrapper h-100 d-flex  flex-column  ">
          <div className="description-wrapper  flex  flex-col align-items-center flex-grow-1">
            <div className="flex-grow-1 d-flex  flex-row justify-content-center">
              <img
                src={product.photo}
                alt={product.name}
                className="w-full object-contain "
                style={{ minHeight: '80px', maxHeight: '120px', maxWidth: '115px' }}
              />
              <div id="counter">
                <div>
                  {items.map((item) => {
                    if (item.id === product.id) {
                      const quantity = item.quantity
                      return (
                        <div
                          key={item.id}
                          className="rounded-circle bg-greenSecondary d-flex justify-content-center border border-success border-3 fw-bold"
                          style={{ width: '30px', position: 'relative', left: '-10px', top: '-10px' }}
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
              className="label-wrapper d-flex  flex-column align-items-center"
              style={{ minHeight: '80px' }}
            >
              <div className="product-name fw-bold">{product.name}</div>
              <div className="product-Price fw-semibold text-greenSurface">{product.price}</div>
            </div>
          </div>
          <div className="action-wrapper d-flex  flex-row gap-1 ">
            <div
              className="d-flex  rounded-4 flex-grow-1 bg-errorButton justify-content-center"
              onClick={() => removeItemFromCart(product)}
            >
              <button className="w-full bg-transparent border-transparent  d-flex  justify-center py-1">
                <IconCircleMinus className="text-white "></IconCircleMinus>
              </button>
            </div>
            <div
              className="d-flex rounded-4 flex-grow-1  bg-successButton  justify-content-center"
              onClick={() => addItemToCart(product)}
            >
              <button className="w-full bg-transparent border-transparent  d-flex   justify-center py-1">
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
