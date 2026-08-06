"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { FiHeart } from "react-icons/fi";

export default function WishlistPage() {
  const { wishlist } = useShop();

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-8">
            Your Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-border/60 rounded-3xl p-8 space-y-6">
              <FiHeart className="w-16 h-16 mx-auto stroke-[1.2] text-brand-slate" />
              <div className="space-y-2">
                <p className="font-serif text-xl font-bold text-brand-navy">Your wishlist is empty</p>
                <p className="text-sm text-brand-slate">Save your favorite organic care items here for quick access later.</p>
              </div>
              <Link 
                href="/products"
                className="inline-flex bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlist.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
