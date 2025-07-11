'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useCallback, useContext  } from 'react'
import ProductCard from '@/components/product/productCard'

export default function ProductsClient({ initialData, initialPage, limit }) {
 
//  const { addToCart } = useContext(CartContext)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = Number(initialPage) }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/get-all-product?page=${pageParam}&limit=${limit}`
      )
      return res.json()
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPage) {
        return lastPage.pagination.currentPage + 1
      }
      return undefined
    },
    initialPageParam: Number(initialPage),
    initialData: {
      pages: [initialData],
      pageParams: [Number(initialPage)],
    },
  })

 
  const observer = useRef()

  const lastProductRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  )


  return (

    <div>
      <div className="grid grid-cols-2 gap-4">
        {data.pages.flatMap((page, i) =>
          page.data.map((product, index) => {
            const isLastProduct = i === data.pages.length - 1 && index === page.data.length - 1

            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductRef : null}
              >
               <ProductCard product={product} onAddToCart={() => addToCart(product)} />
              </div>
            )
          })
        )}
      </div>

      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  )
}
