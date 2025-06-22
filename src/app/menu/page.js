"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconShoppingCart, IconList, IconLoader, IconCategory, IconX } from '@tabler/icons-react';
import ProductCard from '@/components/menu/ProductCard';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import apiClient from '@/services/api'; // Menggunakan apiClient yang sudah ada

// Kategori statis untuk filter
const categories = [
  { name: 'All', icon: <IconCategory size={24} /> },
  { name: 'Pupuk', icon: '/images/icon_pupuk.png' },
  { name: 'Obat', icon: '/images/icon_obat.png' },
  { name: 'Alat Tani', icon: '/images/icon_alat.png' },
];

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { cartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/public/stock');
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch (err) {
        setError('Gagal memuat produk. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => p.category && p.category.name.toLowerCase() === activeCategory.toLowerCase())
      );
    }
  }, [activeCategory, products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#F0EAD6', minHeight: '100vh', paddingBottom: '80px' }}>
      <header className="sticky top-0 z-10 p-4" style={{ backgroundColor: '#D4B996', backdropFilter: 'blur(10px)' }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Toko Tani</h1>
          {/* Bisa ditambahkan logo di sini */}
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-[72px] z-10 py-3" style={{ backgroundColor: 'rgba(240, 234, 214, 0.8)', backdropFilter: 'blur(5px)'}}>
        <div className="container mx-auto flex justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 flex flex-col items-center space-y-1 ${
                activeCategory === cat.name
                  ? 'bg-green-600 text-white shadow-lg scale-110'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              {typeof cat.icon === 'string' ? <img src={cat.icon} alt={cat.name} className="w-8 h-8"/> : cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto p-4">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <IconLoader size={48} className="animate-spin text-green-600" />
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <AnimatePresence>
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {filteredProducts.length === 0 && !loading && (
            <div className="text-center col-span-full mt-10">
                <IconX size={48} className="mx-auto text-gray-400"/>
                <p className="mt-2 text-gray-600">Tidak ada produk di kategori ini.</p>
            </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4" style={{ backgroundColor: '#D4B996' }}>
        <div className="container mx-auto flex justify-around items-center">
          <Link href="/menu" passHref>
            <motion.a whileTap={{ scale: 0.9 }} className="flex flex-col items-center text-white">
              <IconList size={28} />
              <span className="text-xs">Menu</span>
            </motion.a>
          </Link>
          <Link href="/cart" passHref>
            <motion.a whileTap={{ scale: 0.9 }} className="relative flex flex-col items-center text-white">
              <IconShoppingCart size={28} />
              <span className="text-xs">Keranjang</span>
              {cartCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </motion.div>
              )}
            </motion.a>
          </Link>
        </div>
      </footer>
    </div>
  );
} 