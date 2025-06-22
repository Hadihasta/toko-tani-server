"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconSortAscending, 
  IconSortDescending,
  IconPackage,
  IconAlertTriangle
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function StockTable({ 
  stocks, 
  onEdit, 
  onDelete, 
  onView,
  loading = false 
}) {
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'price' || sortField === 'quantity') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (sortField === 'name' || sortField === 'sku') {
      aValue = aValue?.toLowerCase() || '';
      bValue = bValue?.toLowerCase() || '';
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStockStatus = (stock) => {
    if (stock.quantity <= 0) {
      return { status: 'out-of-stock', label: 'Habis', color: 'text-red-600 bg-red-100' };
    } else if (stock.quantity <= stock.minStock) {
      return { status: 'low-stock', label: 'Stok Menipis', color: 'text-orange-600 bg-orange-100' };
    } else {
      return { status: 'in-stock', label: 'Tersedia', color: 'text-green-600 bg-green-100' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-8">
        <IconPackage className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data stock</h3>
        <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan stock baru.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Nama Produk</span>
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('sku')}
            >
              <div className="flex items-center space-x-1">
                <span>SKU</span>
                {sortField === 'sku' && (
                  sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('quantity')}
            >
              <div className="flex items-center space-x-1">
                <span>Stok</span>
                {sortField === 'quantity' && (
                  sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center space-x-1">
                <span>Harga</span>
                {sortField === 'price' && (
                  sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('updatedAt')}
            >
              <div className="flex items-center space-x-1">
                <span>Terakhir Update</span>
                {sortField === 'updatedAt' && (
                  sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStocks.map((stock, index) => {
            const status = getStockStatus(stock);
            return (
              <motion.tr
                key={stock.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <IconPackage className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.description?.substring(0, 50)}
                        {stock.description?.length > 50 && '...'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {stock.quantity}
                  </div>
                  {stock.minStock > 0 && (
                    <div className="text-xs text-gray-500">
                      Min: {stock.minStock}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(stock.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                    {status.status === 'low-stock' && <IconAlertTriangle className="w-3 h-3 mr-1" />}
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.category?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(stock.updatedAt), 'dd MMM yyyy HH:mm', { locale: id })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(stock)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Lihat Detail"
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(stock)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                      title="Edit"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(stock)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Hapus"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 