import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `novacart_cart_${userId}`;

  const [items, setItems] = useState(() => {
    try {
      if (isAdmin) return [];
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Sync / isolate cart when user logs in, logs out, or switches accounts
  useEffect(() => {
    if (isAdmin) {
      setItems([]);
      setIsCartOpen(false);
      return;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    }
  }, [userId, isAdmin, storageKey]);

  // Persist items for the active user session
  useEffect(() => {
    if (isAdmin) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, storageKey, isAdmin]);

  const addToCart = (product, quantity = 1) => {
    if (isAdmin || !product) return { success: false, reason: 'admin_or_invalid' };

    const maxStock = typeof product.stock_quantity === 'number'
      ? product.stock_quantity
      : (parseInt(product.stock_quantity, 10) || 0);

    // Block adding if product has 0 or negative stock
    if (maxStock <= 0) {
      return { success: false, reason: 'out_of_stock', maxStock: 0 };
    }

    const requestedAdd = Math.max(1, parseInt(quantity, 10) || 1);
    let addedActual = 0;
    let hitLimit = false;

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const currentQty = existing.quantity;
        if (currentQty >= maxStock) {
          hitLimit = true;
          return prev;
        }
        const newQty = Math.min(maxStock, currentQty + requestedAdd);
        addedActual = newQty - currentQty;
        if (newQty === maxStock) hitLimit = true;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        const newQty = Math.min(maxStock, requestedAdd);
        addedActual = newQty;
        if (newQty === maxStock) hitLimit = true;
        return [...prev, { product, quantity: newQty }];
      }
    });

    setIsCartOpen(true);
    return { success: true, added: addedActual, hitLimit, maxStock };
  };

  const removeFromCart = (productId) => {
    if (isAdmin) return;
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (isAdmin) return;
    const targetQty = parseInt(quantity, 10) || 0;
    if (targetQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.product.id !== productId) return item;
        const maxStock = typeof item.product?.stock_quantity === 'number'
          ? item.product.stock_quantity
          : (parseInt(item.product?.stock_quantity, 10) || 0);
        const clampedQty = maxStock > 0 ? Math.min(targetQty, maxStock) : targetQty;
        return { ...item, quantity: Math.max(1, clampedQty) };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(e);
    }
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NOVA20') {
      setDiscountPercent(0.20);
      setPromoCode('NOVA20');
      return { success: true, message: '20% discount applied!' };
    }
    if (clean === 'SUPABASE') {
      setDiscountPercent(0.15);
      setPromoCode('SUPABASE');
      return { success: true, message: '15% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try NOVA20' };
  };

  const itemCount = isAdmin ? 0 : items.reduce((acc, item) => acc + item.quantity, 0);

  // All pricing natively in Algerian Dinars (DZD)
  const subtotal = Math.round(
    items.reduce((acc, item) => {
      const price = parseFloat(item.product.price) || 0;
      return acc + price * item.quantity;
    }, 0)
  );

  const discount = Math.round(subtotal * discountPercent);
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider value={{
      items: isAdmin ? [] : items,
      itemCount,
      subtotal,
      discount,
      total,
      isCartOpen: isAdmin ? false : isCartOpen,
      setIsCartOpen: isAdmin ? () => {} : setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromo,
      promoCode,
      discountPercent
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
