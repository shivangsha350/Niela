"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  features?: string[];
  variants?: string[]; // e.g., ["Regular", "Super", "Super Plus"]
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  token: string | null;
  loading: boolean;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateCartQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  loginUser: (userData: User, jwtToken: string) => void;
  logoutUser: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("niela_cart");
      const storedWishlist = localStorage.getItem("niela_wishlist");
      const storedUser = localStorage.getItem("niela_user");
      const storedToken = localStorage.getItem("niela_token");

      if (storedCart) {
        try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); }
      }
      if (storedWishlist) {
        try { setWishlist(JSON.parse(storedWishlist)); } catch (e) { console.error(e); }
      }
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
      }
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    }
  }, []);

  // Synchronize cart changes to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("niela_cart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Synchronize wishlist changes to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("niela_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, loading]);

  const addToCart = (product: Product, quantity = 1, variant = "Regular") => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product._id === product._id && item.selectedVariant === variant
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, selectedVariant: variant }];
    });
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product._id === productId && item.selectedVariant === variant))
    );
  };

  const updateCartQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item._id === product._id);
      if (exists) {
        return prevWishlist.filter((item) => item._id !== product._id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  const loginUser = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("niela_user", JSON.stringify(userData));
    localStorage.setItem("niela_token", jwtToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("niela_user");
    localStorage.removeItem("niela_token");
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        token,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        loginUser,
        logoutUser,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
