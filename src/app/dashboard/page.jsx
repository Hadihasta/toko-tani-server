import QueryProvider from '../providers/QueryProvider'
import ProductsClient from './ProductsClient'
import MenuNavigate from '@/components/dashboard/menuNavigate'
import CartContextProvider from '@/store/CartContextProvider'

// Aboout this page : SSR for the firs render

const DashboardPage = async ({ searchParams }) => {
  const page = searchParams.page || '1'
  const limit = searchParams.limit || '10'
  // const query = searchParams.query || ''

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/get-all-product?page=${page}&limit=${limit}`

  const res = await fetch(apiUrl, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const data = await res.json()

  return (
    <CartContextProvider>
      <QueryProvider>
        <div
          className="d-flex flex-column"
          style={{ height: '100%' }}
        >
          <div className="content-wrapper px-4   flex-grow-1  overflow-x-visible overflow-scroll ">
            <div className="head-wrapper relative">
              <div
                className="d-flex bg-yellowBackground"
                style={{
                  height: '56px',
                  borderRadius: '0px 0px 60px 60px',
                }}
              />
            </div>
            <div className="body-wrapper">
              <div>
                <ProductsClient
                  initialData={data}
                  initialPage={page}
                  limit={limit}
                  // query={query}
                />
              </div>
            </div>
          </div>
          <MenuNavigate />
        </div>
      </QueryProvider>
    </CartContextProvider>
  )
}

export default DashboardPage
