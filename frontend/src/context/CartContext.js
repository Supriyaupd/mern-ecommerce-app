import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    try {
      setCartLoading(true);
      const { data } = await API.get('/cart');
      setCart(data.cart || []);
    } catch { setCart([]); }
    finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart', { productId, quantity });
    setCart(data.cart);
  };

  const updateCartItem = async (productId, quantity) => {
    const { data } = await API.put(`/cart/${productId}`, { quantity });
    setCart(data.cart);
  };

  const removeFromCart = async (productId) => {
    await API.delete(`/cart/${productId}`);
    setCart((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
