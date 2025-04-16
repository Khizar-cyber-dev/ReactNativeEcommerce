import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCart, getProducts, getCurrentUser, updateProductQuantity, deleteProduct } from '../services/api/appwrite';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          initializeUser(currentUser.$id);
        } else {
          console.warn('No user is logged in.');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const initializeUser = (id) => {
    if (!id) {
      console.warn('initializeUser called with an invalid ID.');
      return;
    }
    setUserId(id);
    loadUserCart(id);
  };

  const loadUserCart = async (userId) => {
    try {
      const cartData = await getCart(userId);
      if (cartData && cartData.length > 0) {
        const formattedCart = cartData.map(product => ({
          productId: product.$id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
        }));
        setCart(formattedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const increaseQuantity = async (productId) => {
    if (!userId) return;

    const product = cart.find(item => item.productId === productId);
    if (product) {
      const newQuantity = product.quantity + 1;
      await updateProductQuantity(userId, productId, newQuantity);
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!userId) return;

    const product = cart.find(item => item.productId === productId);
    if (product && product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      await updateProductQuantity(userId, productId, newQuantity);
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ));
    } else if (product && product.quantity === 1) {
      await deleteProduct(userId, productId);
      setCart(cart.filter(item => item.productId !== productId));
    }
  };

  const deleteFromCart = async (productId) => {
    if (!userId) return;

    await deleteProduct(userId, productId);
    setCart(cart.filter(item => item.productId !== productId));
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