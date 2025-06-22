"use client";
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IconX, IconLoader } from '@tabler/icons-react';
import Image from 'next/image';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
};

export default function OrderDetailModal({ isOpen, onClose, order, onUpdate }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleAction = async (status) => {
    setLoading(true);
    await onUpdate(order.id, status, notes);
    setLoading(false);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IconX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Detail Pesanan: {order.invoice}
                </Dialog.Title>
                
                <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
                    {/* Kolom Kiri: Detail Pesanan */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800">Detail Pelanggan</h4>
                            <p className="text-sm text-gray-600">Nama: {order.user.name}</p>
                            <p className="text-sm text-gray-600">Telepon: {order.user.phone}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Item Pesanan</h4>
                            <ul className="divide-y divide-gray-200">
                                {order.cart.cartProducts.map(item => (
                                    <li key={item.id} className="py-2 flex justify-between">
                                        <span className="text-sm text-gray-600">{item.product.name} (x{item.quantity})</span>
                                        <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800">Total Pembayaran</h4>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(order.transaction.total_price)}</p>
                        </div>
                    </div>
                    {/* Kolom Kanan: Bukti Transfer & Aksi */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800">Bukti Pembayaran</h4>
                            {order.transaction.paymentProofUrl ? (
                                <a href={order.transaction.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                                    <Image src={order.transaction.paymentProofUrl} alt="Bukti Pembayaran" width={300} height={300} className="mt-2 rounded-md border object-contain"/>
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada bukti pembayaran.</p>
                            )}
                        </div>
                        
                        {order.status === 'PENDING' && (
                             <div>
                                <h4 className="font-semibold text-gray-800">Aksi Admin</h4>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tambahkan catatan (opsional, misal alasan penolakan)"
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                />
                                <div className="mt-2 flex space-x-3">
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => handleAction('APPROVED')}
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm disabled:bg-gray-400"
                                    >
                                        {loading && <IconLoader className="animate-spin -ml-1 mr-2 h-5 w-5"/>}
                                        Setujui
                                    </button>
                                     <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => handleAction('REJECTED')}
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:bg-gray-300"
                                    >
                                        {loading && <IconLoader className="animate-spin -ml-1 mr-2 h-5 w-5"/>}
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        )}
                       
                    </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 