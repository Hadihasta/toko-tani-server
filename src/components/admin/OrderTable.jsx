"use client";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.CANCELLED}`}>
      {status}
    </span>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function OrderTable({ orders, onViewOrder }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Tidak ada pesanan dengan status ini.</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Invoice</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pelanggan</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tanggal</th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Aksi</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {orders.map((order) => (
          <motion.tr 
            key={order.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
              <div className="font-medium text-gray-900">{order.invoice}</div>
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div className="text-gray-900">{order.user.name}</div>
                <div className="text-gray-500">{order.user.phone}</div>
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {formatCurrency(order.transaction.total_price)}
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <StatusBadge status={order.status} />
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
            </td>
            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <button
                onClick={() => onViewOrder(order)}
                className="text-green-600 hover:text-green-900"
              >
                Lihat Detail
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
} 