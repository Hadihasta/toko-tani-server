import React from 'react'
import { Table, TableBody, TableFooter, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

const handleStatusChange = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/update-checkout-by-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status: newStatus }),
    })

    if (!res.ok) {
      throw new Error('Failed to update status')
    }

    await toast('Status updated', {
      style: {
        backgroundColor: '#b9f8cf',
        color: '#009966',
        border: '#05df72',
      },
    })

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

const TableData = ({ data }) => {

  const totalAllCost = data?.reduce((acc, item) => {
    return acc + (item?.cart?.total_cost || 0)
  }, 0)

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number)
  }

  return (
    <Table>
      <TableHeader className="bg-yellowBackground">
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Bukti Transfer</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.user.name}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === 'PENDING'
                    ? 'bg-yellow-200 text-yellow-800'
                    : item.status === 'APPROVED'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'PAID'
                    ? 'bg-purple-200 text-purple-800'
                    : item.status === 'FINISH'
                    ? 'bg-green-700 text-white'
                    : item.status === 'FAILED'
                    ? 'bg-pink-200 text-pink-800'
                    : item.status === 'CANCELLED'
                    ? 'bg-red-700 text-white'
                    : ''
                }`}
              >
                {item.status}
              </span>
            </TableCell>
            <TableCell>{item.user.phone}</TableCell>
            <TableCell className="text-right">{formatRupiah(item.cart.total_cost)}</TableCell>
            <TableCell className="text-right">
              {item.invoice ? (
                <a
                  href={item.invoice}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  click here
                </a>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell className="text-right">
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PAID">PAID</option>
                <option value="FINISH">FINISH</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total </TableCell>
          <TableCell
            className="text-right"
            colSpan={2}
          >
            {formatRupiah(totalAllCost)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TableData
