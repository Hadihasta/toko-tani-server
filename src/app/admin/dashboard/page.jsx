'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import TableData from '@/components/login/tableData'

const Dashboard = () => {
  const [dataTable, setDataTable] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10) 
  const [totalPage, setTotalPage] = useState(1)

  const fetchCheckoutData = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/get-all-checkout?page=${pageNumber}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setDataTable(res.data.data)
      setTotalPage(res.data.pagination.totalPage)
   
    } catch (error) {
      console.error('Gagal mengambil data:', error)
    }
  }

  useEffect(() => {
    fetchCheckoutData(page)
  }, [page])

  const handleNextPage = () => {
    if (page < totalPage) setPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  return (
    <div className="p-3">
      <div className="d-flex flex-row justify-content-center fw-bold mb-2">Transaction</div>

      <TableData data={dataTable} />

      <div className="d-flex justify-content-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2">Page {page} of {totalPage}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPage}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Dashboard
