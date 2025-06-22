"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconCircleCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    // Jika tidak ada orderId, mungkin lebih baik redirect ke halaman utama
    if (typeof window !== 'undefined') {
      router.push('/menu');
    }
    return null;
  }

  return (
    <div style={{ backgroundColor: '#F0EAD6', minHeight: '100vh' }} className="flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white/90 p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        <IconCircleCheck size={80} className="mx-auto text-green-500" />
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Pesanan Diterima!</h1>
        <p className="text-gray-600 mt-3">
          Terima kasih telah berbelanja. Pesanan Anda dengan nomor identifikasi
          <span className="font-bold text-gray-800"> #{orderId}</span> sedang kami proses.
        </p>
        <p className="text-gray-600 mt-2">
          Kami akan segera mengkonfirmasi pembayaran Anda.
        </p>
        <Link href="/menu" passHref>
          <a className="mt-8 inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors">
            Kembali ke Menu
          </a>
        </Link>
      </motion.div>
    </div>
  );
} 