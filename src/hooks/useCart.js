"use client";
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCart([]);
    } finally {
      setIsCartInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartInitialized]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          toast.error(`Stok ${product.name} tidak mencukupi!`);
          return prevCart;
        }
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Add new item to cart
        if (quantity > product.quantity) {
          toast.error(`Stok ${product.name} tidak mencukupi!`);
          return prevCart;
        }
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} dihapus dari keranjang`);
      }
      return prevCart.filter(item => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.id === productId);

      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      
      if (itemToUpdate && newQuantity > itemToUpdate.maxStock) {
        toast.error(`Stok ${itemToUpdate.name} tidak mencukupi!`);
        return prevCart;
      }

      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);
  
  const decrementItem = useCallback((productId) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean); // Remove null items
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    toast.success("Keranjang berhasil dikosongkan");
  }, []);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    decrementItem,
    clearCart,
    cartCount,
    cartTotal,
    isCartInitialized
  };
}; 