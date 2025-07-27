import React from 'react'

const ProductDisplay = (data) => {

  return (
    <div>
      <div
        className="bg-yellowCard rounded-4 p-3 "
        style={{ minWidth: '8rem' ,maxWidth: '8rem', height: '275px' }}
      >
        <div className="card-wrapper h-100 d-flex  flex-column ">
          <div className="description-wrapper  flex  flex-col align-items-center flex-grow-1">
            <div className="flex-grow-1 d-flex flex-row">
              <img
                src={data.data.product.photo}
                alt={data.data.product.name}
                className="w-full object-contain "
                style={{ minHeight: '80px', maxHeight: '120px' , maxWidth: '90px' }}
              />
            </div>
            <div
              className="label-wrapper d-flex  flex-column align-items-center"
              style={{ minHeight: '80px' }}
            >
              <div className="product-name fw-bold">{data.data.product.name}</div>
              <div className="product-Price">{data.data.product.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay
