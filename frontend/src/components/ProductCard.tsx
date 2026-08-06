"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, useShop } from "@/context/ShopContext";
import { FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const [isAdding, setIsAdding] = useState(false);

  const favorited = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    // Add default first variant if available
    const defaultVariant = product.variants ? product.variants[0] : "Regular";
    addToCart(product, 1, defaultVariant);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white border border-brand-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 border border-brand-border/40 shadow-sm text-brand-dark-navy hover:text-brand-pink transition duration-200"
        aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FiHeart 
          className={`w-4 h-4 transition ${
            favorited ? "fill-brand-pink text-brand-pink scale-110" : ""
          }`} 
        />
      </button>

      <Link href={`/products/${product._id}`} className="block flex-1 flex flex-col">
        {/* Product Image */}
        <div className="w-full aspect-[4/3] bg-brand-bg relative overflow-hidden group-hover:opacity-95 transition-opacity">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.originalPrice && product.originalPrice > product.price && product.stock > 0 && (
            <span className="absolute bottom-4 left-4 bg-brand-pink text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
              Sale -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {product.stock <= 0 && (
            <span className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs uppercase font-bold tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Category Tag */}
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-pink">
              {product.category}
            </span>

            {/* Title */}
            <h3 className="font-serif font-bold text-lg text-brand-navy leading-snug group-hover:text-brand-pink transition">
              {product.name}
            </h3>

            {/* Ratings & Reviews */}
            {product.rating && (
              <div className="flex items-center space-x-1 text-yellow-500">
                <FiStar className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-semibold text-brand-navy">{product.rating}</span>
                <span className="text-[10px] text-brand-slate">({product.reviewsCount})</span>
              </div>
            )}
            
            {/* Short Description */}
            <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-brand-border/40 mt-4">
            {/* Pricing */}
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-base text-brand-navy">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-brand-slate line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Quick Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                product.stock <= 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isAdding 
                    ? "bg-brand-pink text-white" 
                    : "bg-brand-navy/5 text-brand-navy hover:bg-brand-navy hover:text-white"
              }`}
              title={product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            >
              {product.stock <= 0 ? (
                <span className="text-[10px] font-bold text-slate-400 px-1">Sold Out</span>
              ) : isAdding ? (
                <span className="text-xs font-bold px-1 animate-pulse">Added!</span>
              ) : (
                <FiShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
