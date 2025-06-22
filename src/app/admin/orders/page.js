"use client";
import { useState, useEffect } from 'react';
import apiClient from '@/services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IconSearch, IconFilter, IconLoader } from '@tabler/icons-react';
import OrderTable from '@/components/admin/OrderTable';
import OrderDetailModal from '@/components/admin/OrderDetailModal';

const statusFilters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('PENDING');

  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const url = status === 'ALL' ? '/admin/orders' : `/admin/orders?status=${status}`;
      const response = await apiClient.get(url);
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data pesanan.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async (orderId, status, notes) => {
    const toastId = toast.loading('Memperbarui status pesanan...');
    try {
      await apiClient.put(`/admin/orders/${orderId}`, { status, notes });
      toast.success('Status pesanan berhasil diperbarui!', { id: toastId });
      // Refresh list
      fetchOrders(activeStatus);
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Gagal memperbarui status pesanan.', { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
          <p className="mt-2 text-sm text-gray-700">
            Daftar semua pesanan yang masuk. Setujui atau tolak pembayaran di sini.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {statusFilters.map(status => (
            <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    activeStatus === status 
                    ? 'bg-green-600 text-white shadow' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
                {status}
            </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <IconLoader className="animate-spin h-12 w-12 text-green-600" />
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <OrderTable orders={orders} onViewOrder={handleViewOrder} />
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
} 