'use client'

import MenuNavigate from '@/components/dashboard/menuNavigate'

const handleUploudButton = () => {
  console.log('file input later')
}

const Checkout = () => {
  return (
    <>
      <div
        className="fullHeight-wrapper flex flex-col"
        style={{ height: '100%' }}
      >
        <div className="head-wrapper relative px-4">
          <div
            className="d-flex bg-yellowBackground"
            style={{
              height: '30px',
              borderRadius: '0px 0px 60px 60px',
            }}
          />
        </div>
        <div className="body-wrapper p-3 m-4 bg-yellowCard  rounded flex flex-col flex-grow-1">
          <div className="bank-wrapper flex flex-col  justify-content-center  align-items-center  ">
            <div className=" font-bold fs-12">Transfer Bank BCA</div>

            <div className="font-medium fs-15">a.n Bambang Sumatra 0942XXXXX</div>
          </div>

          <div className="Total-wrapper  flex flex-col  justify-content-center  align-items-center flex-1">
            <div className="text-greenSurface font-bold fs-24 ">Rp.500.000</div>
          </div>

          <div className="flex justify-content-center  align-items-center flex-1">
            <button
              onClick={handleUploudButton}
              className="text-greenSecondary font-bold"
            >
              <div className="button-wrapper bg-orange px-3 py-2 w-100  flex justify-content-center  align-items-center rounded-2  ">
                Upload Bukti Transfer
              </div>
            </button>
          </div>
        </div>
        <MenuNavigate />
      </div>
    </>
  )
}

export default Checkout
