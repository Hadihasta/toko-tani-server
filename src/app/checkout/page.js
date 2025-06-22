"use client";
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { IconArrowLeft, IconUpload, IconFileCheck, IconLoader } from '@tabler/icons-react';
import apiClient from '@/services/api';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('Silakan pilih file gambar.');
      setPaymentProof(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      toast.error('Harap unggah bukti transfer Anda.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Keranjang Anda kosong.');
      router.push('/menu');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Memproses pesanan...');

    const formData = new FormData();
    const cartData = JSON.stringify({ items: cart, total: cartTotal });
    formData.append('cart', cartData);
    formData.append('paymentProof', paymentProof);

    try {
      const response = await apiClient.post('/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Pesanan berhasil dibuat!', { id: toastId });
      clearCart(); // Kosongkan keranjang setelah berhasil
      router.push(`/order-success?orderId=${response.data.data.orderId}`);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Gagal memproses pesanan. Silakan coba lagi.';
      toast.error(errorMessage, { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0EAD6]">
        <IconLoader className="animate-spin h-12 w-12 text-gray-500" />
        <p className="mt-4 text-gray-600">Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F0EAD6', minHeight: '100vh' }}>
      <header className="sticky top-0 z-10 p-4" style={{ backgroundColor: '#D4B996' }}>
        <div className="container mx-auto flex items-center relative">
          <Link href="/cart" passHref>
            <a className="text-white absolute left-0">
              <IconArrowLeft size={24} />
            </a>
          </Link>
          <h1 className="text-xl font-bold text-white text-center w-full">Pembayaran</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white/80 p-6 rounded-2xl shadow-md text-center">
            <p className="text-gray-600">Silakan transfer ke rekening berikut:</p>
            <h2 className="font-bold text-lg mt-1">Transfer Bank BCA</h2>
            <p className="text-sm text-gray-500 mt-1">a.n Bambang Sumarta - 08442XXXX</p>
            
            <div className="my-6">
              <p className="text-gray-600">Total Pembayaran</p>
              <p className="text-4xl font-bold text-green-600 my-2">{formatCurrency(cartTotal)}</p>
            </div>

            <label htmlFor="file-upload" className="cursor-pointer w-full inline-block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                {previewUrl ? (
                  <div>
                    <Image src={previewUrl} alt="Preview Bukti Transfer" width={150} height={150} className="mx-auto rounded-lg object-contain" />
                    <div className="flex items-center justify-center text-green-600 font-semibold mt-4">
                      <IconFileCheck size={20} className="mr-2"/>
                      <span>Gambar Terpilih</span>
                    </div>
                    <span className="text-xs text-blue-500 hover:underline mt-1">Ganti gambar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <IconUpload size={40} className="text-gray-400"/>
                    <span className="mt-2 text-gray-600 font-semibold">Upload Bukti Transfer</span>
                    <span className="text-xs text-gray-500">PNG, JPG, JPEG</span>
                  </div>
                )}
              </div>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !paymentProof}
              className="w-full bg-orange-400 text-white font-bold py-4 rounded-full hover:bg-orange-500 transition-colors text-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading && <IconLoader className="animate-spin mr-2" />}
              {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 