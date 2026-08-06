"use client";

import React from "react";
import Link from "next/link";
import { mockProducts } from "@/data/products";
import ProductCard from "./ProductCard";
import { FiArrowRight } from "react-icons/fi";

export default function ProductGrid() {
  // Show all products in the grid
  const displayedProducts = mockProducts.slice(0, 4);

  return (
    <section className="w-full py-16 sm:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            Our Bestsellers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Period Care Made Better
          </h2>
          <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
            Crafted with certified organic cotton top-sheets and biodegradable layers to keep you comfortable and leak-free.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/products"
            className="inline-flex items-center text-brand-navy hover:text-brand-pink font-semibold border-b border-brand-navy hover:border-brand-pink pb-1 transition duration-200 group text-sm sm:text-base"
          >
            Shop All Products
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
