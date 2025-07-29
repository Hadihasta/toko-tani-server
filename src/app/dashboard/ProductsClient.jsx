'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useCallback, useState } from 'react'
import ProductCard from '@/components/product/productCard'
import MenuCategorie from '@/components/dashboard/menuCategorie'

export default function ProductsClient({ initialData, initialPage, limit, query }) {
  const [category, setCategory] = useState(query || 0)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', category],
    queryFn: async ({ pageParam = Number(initialPage) }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/get-all-product?page=${pageParam}&limit=${limit}&query=${category}`
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

  const addToCart = (product) => {
    // console.log('Add to cart:', product)
  }

  return (
    <div className="container">
      <div
        className="icon-wrapper position-relative d-flex  justify-content-evenly"
        style={{ top: -30, left: 0, right: 0, maxWidth: '530px' }}
      >
        <MenuCategorie onSelect={(id) => setCategory(id)} />
      </div>

      <div className="row g-1">
        {data.pages.flatMap((page, i) =>
          page.data.map((product, index) => {
            const isLastProduct = i === data.pages.length - 1 && index === page.data.length - 1

            return (
              <div
                key={product.id}
                className="col-6"
                ref={isLastProduct ? lastProductRef : null}
              >
                <ProductCard product={product} onAddToCart={() => addToCart(product)} />
              </div>
            )
          })
        )}
      </div>

      {isFetchingNextPage && <p className="text-center my-2">Loading more...</p>}
    </div>
  )
}
