// CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCart, getProducts, getCurrentUser, updateProductQuantity, deleteProduct } from '../services/api/appwrite';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          initializeUser(currentUser.$id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const initializeUser = (id) => {
    if (!id) return;
    setUserId(id);
    loadUserCart(id);
  };

  const loadUserCart = async (userId) => {
    try {
      const cartData = await getCart(userId);
      const formattedCart = cartData.map(product => ({
        productId: product.$id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        userId: product.userId,
      })).filter(product => product.userId === userId);
      setCart(formattedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const increaseQuantity = async (productId) => {
    if (!userId) return;

    const product = cart.find(item => item.productId === productId);
    if (product) {
      const newQuantity = product.quantity + 1;
      try {
        await updateProductQuantity(userId, productId, newQuantity);
        setCart(cart.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        ));
      } catch (error) {
        console.error('Error increasing product quantity:', error);
      }
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!userId) return;

    const product = cart.find(item => item.productId === productId);
    if (product && product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      try {
        await updateProductQuantity(userId, productId, newQuantity);
        setCart(cart.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        ));
      } catch (error) {
        console.error('Error decreasing product quantity:', error);
      }
    } else if (product && product.quantity === 1) {
      try {
        await deleteProduct(userId, productId);
        setCart(cart.filter(item => item.productId !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const deleteFromCart = async (productId) => {
    if (!userId) return;

    try {
      await deleteProduct(userId, productId);
      setCart(cart.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        userId,
        products,
        initializeUser,
        loadUserCart,
        increaseQuantity,
        decreaseQuantity,
        deleteFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
