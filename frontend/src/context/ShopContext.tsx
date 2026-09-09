"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockProducts } from "@/data/products";
import { apiService } from "@/services/api";

export interface Product {
  _id: string;
  dbId?: string;
  slug?: string;
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
  variantPrices?: { [variantName: string]: number };
  variantOriginalPrices?: { [variantName: string]: number };
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
  products: Product[];
  updateProductsList: (newList: Product[]) => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load state on mount and sync live products
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("niela_cart");
      const storedWishlist = localStorage.getItem("niela_wishlist");
      const storedUser = localStorage.getItem("niela_user");
      const storedToken = localStorage.getItem("niela_token");
      const storedProducts = localStorage.getItem("niela_admin_products");

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
      if (storedProducts) {
        try { setProducts(JSON.parse(storedProducts)); } catch (e) { console.error(e); }
      } else {
        setProducts(mockProducts);
        localStorage.setItem("niela_admin_products", JSON.stringify(mockProducts));
      }
      setLoading(false);

      // Fetch latest live products from backend MongoDB Atlas
      apiService.products
        .getAll()
        .then((data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            const liveList: Product[] = data.map((item: any) => ({
              _id: item.slug || item._id,
              dbId: item._id,
              slug: item.slug || item._id,
              name: item.name,
              description: item.description,
              price: item.price,
              originalPrice: item.originalPrice,
              images: item.images && item.images.length > 0 ? item.images : ["/images/regular_pads.png"],
              category: item.category,
              stock: item.stock !== undefined ? item.stock : 50,
              rating: item.rating || 5.0,
              reviewsCount: item.reviewsCount || 0,
              features: item.features || [],
              variants: item.variants || [],
              variantPrices: item.variantPrices || {},
              variantOriginalPrices: item.variantOriginalPrices || {},
            }));
            setProducts(liveList);
            try {
              localStorage.setItem("niela_admin_products", JSON.stringify(liveList));
            } catch {}
          }
        })
        .catch((err) => {
          console.warn("[ShopContext] Using cached/mock products:", err.message);
        });

      // Synchronize changes across browser tabs & local events
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === "niela_admin_products" && e.newValue) {
          try {
            setProducts(JSON.parse(e.newValue));
          } catch {}
        }
      };

      const handleCustomUpdate = () => {
        const current = localStorage.getItem("niela_admin_products");
        if (current) {
          try {
            setProducts(JSON.parse(current));
          } catch {}
        }
      };

      window.addEventListener("storage", handleStorageUpdate);
      window.addEventListener("niela_products_updated", handleCustomUpdate);

      return () => {
        window.removeEventListener("storage", handleStorageUpdate);
        window.removeEventListener("niela_products_updated", handleCustomUpdate);
      };
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

      // Extract variant price if it exists
      let finalPrice = product.price;
      let finalOriginalPrice = product.originalPrice;
      if (product.variantPrices && product.variantPrices[variant]) {
        finalPrice = product.variantPrices[variant];
      }
      if (product.variantOriginalPrices && product.variantOriginalPrices[variant]) {
        finalOriginalPrice = product.variantOriginalPrices[variant];
      }

      // Create a copy of the product with the variant-specific price
      const productWithVariantPrice = {
        ...product,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
      };

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        newCart[existingItemIndex].product = productWithVariantPrice;
        return newCart;
      }

      return [...prevCart, { product: productWithVariantPrice, quantity, selectedVariant: variant }];
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

  const updateProductsList = (newList: Product[]) => {
    setProducts(newList);
    try {
      localStorage.setItem("niela_admin_products", JSON.stringify(newList));
      window.dispatchEvent(new Event("niela_products_updated"));
    } catch (e) {
      console.error("Failed to save products to localStorage:", e);
      alert("Storage Quota Exceeded! The uploaded image file size is too large for the browser's storage capacity. Please use a smaller file or clear your browser data.");
    }
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
        products,
        updateProductsList,
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
