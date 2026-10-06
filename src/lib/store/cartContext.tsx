"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductItem, Variant } from "./catalog";
import { BRAND } from "@/lib/constants/brand";

export interface CartItem {
  id: string; // variant id
  product: ProductItem;
  variant: Variant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  currency: string;
  setCurrency: (currency: string) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: ProductItem, variant: Variant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingThreshold: number;
  freeShippingProgress: number;
  wishlist: string[]; // product slugs
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrencyState] = useState<string>(BRAND.defaultCurrency);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("auren_cart");
      if (storedCart) setItems(JSON.parse(storedCart));

      const storedCurrency = localStorage.getItem("auren_currency");
      if (storedCurrency) setCurrencyState(storedCurrency);

      const storedWishlist = localStorage.getItem("auren_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("auren_cart", JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("auren_currency", currency);
    } catch {}
  }, [currency, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("auren_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isLoaded]);

  const addToCart = (product: ProductItem, variant: Variant, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: variant.id, product, variant, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isWishlisted = (slug: string) => wishlist.includes(slug);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  const shippingThreshold = 100;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        currency,
        setCurrency: setCurrencyState,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingThreshold,
        freeShippingProgress,
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
