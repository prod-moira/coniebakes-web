'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (productId: string, variantLabel: string, change: number) => void;
  removeFromCart: (productId: string, variantLabel: string) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cb_cart');
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Failed to parse cart from storage:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cb_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === newItem.productId && item.variantLabel === newItem.variantLabel
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      return [...prevCart, { ...newItem, quantity }];
    });
  };

  const updateQuantity = (productId: string, variantLabel: string, change: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.productId === productId && item.variantLabel === variantLabel) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string, variantLabel: string) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.productId === productId && item.variantLabel === variantLabel)
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
