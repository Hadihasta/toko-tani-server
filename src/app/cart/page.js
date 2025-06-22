"use client";
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMinus, IconPlus, IconTrash, IconShoppingCart, IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, decrementItem, addToCart, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      // Jika sudah login, arahkan ke halaman checkout
      router.push('/checkout');
    } else {
      // Jika belum, arahkan ke login dan simpan tujuan redirect
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <div style={{ backgroundColor: '#F0EAD6', minHeight: '100vh' }}>
      <header className="sticky top-0 z-10 p-4" style={{ backgroundColor: '#D4B996' }}>
        <div className="container mx-auto flex items-center">
          <Link href="/menu" passHref>
            <a className="text-white">
              <IconArrowLeft size={24} />
            </a>
          </Link>
          <h1 className="text-xl font-bold text-white mx-auto">Keranjang Saya</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-32">
        {cart.length === 0 ? (
          <div className="text-center mt-20">
            <IconShoppingCart size={64} className="mx-auto text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Keranjang Anda kosong</h2>
            <p className="text-gray-500 mt-2">Sepertinya Anda belum menambahkan apa pun.</p>
            <Link href="/menu" passHref>
              <a className="mt-6 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition-colors">
                Mulai Belanja
              </a>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{cartCount} Item</h2>
              <button onClick={clearCart} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                Kosongkan Keranjang
              </button>
            </div>
            
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div
                    layout
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center bg-white/80 p-4 rounded-2xl shadow-md"
                  >
                    <Image
                      src={item.imageUrl || '/images/placeholder.png'}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-contain"
                    />
                    <div className="flex-grow ml-4">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => decrementItem(item.id)} className="p-1 rounded-full bg-gray-200">
                          <IconMinus size={16} />
                        </motion.button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} className="p-1 rounded-full bg-gray-200">
                          <IconPlus size={16} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 mt-2">
                          <IconTrash size={20} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>
      
      {cart.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-semibold">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 transition-colors text-lg"
                >
                    Lanjut ke Pembayaran
                </button>
            </div>
        </footer>
      )}
    </div>
  );
} 