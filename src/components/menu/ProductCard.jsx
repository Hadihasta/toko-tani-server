"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useCart } from '@/hooks/useCart';

export default function ProductCard({ product }) {
  const { cart, addToCart, decrementItem } = useCart();
  
  const itemInCart = cart.find(item => item.id === product.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    decrementItem(product.id);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col justify-between p-4 border border-gray-200"
      style={{
        backgroundColor: 'rgba(255, 250, 230, 0.5)', // Warna krem lembut dengan transparansi
        backdropFilter: 'blur(5px)' // Efek blur di belakang kartu
      }}
    >
      <div>
        <div className="relative w-full h-40">
          <Image
            src={product.imageUrl || '/images/placeholder.png'}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <div className="text-center mt-4">
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <p className="text-md text-gray-600 mt-1">{formatCurrency(product.price)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-around items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={quantityInCart === 0}
          className={`p-2 rounded-full text-white transition-colors duration-300 ${
            quantityInCart > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <IconMinus size={20} />
        </motion.button>

        <span className="text-xl font-semibold w-12 text-center">
          {quantityInCart}
        </span>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
        >
          <IconPlus size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
} 