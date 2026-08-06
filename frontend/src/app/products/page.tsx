"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/products";
import { FiFilter, FiChevronDown } from "react-icons/fi";

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // Sync category filter with search parameters (e.g. ?category=pads)
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

  // Filter and sort products
  useEffect(() => {
    let result = [...mockProducts];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort Products
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortBy]);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "pads", label: "Sanitary Pads" },
    { value: "liners", label: "Panty Liners" },
    { value: "cups", label: "Menstrual Cups" },
    { value: "kits", label: "Starter Kits" },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Banner Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
              Period Care Store
            </h1>
            <p className="text-sm sm:text-base text-brand-slate">
              GOTS certified organic cotton top sheets, plastic-free biodegradable materials, and medical grade cups. Better for you, better for the environment.
            </p>
          </div>

          {/* Filtering Controls Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition duration-200 ${
                    selectedCategory === cat.value
                      ? "bg-brand-navy border-brand-navy text-white"
                      : "bg-white border-brand-border/60 text-brand-navy hover:border-brand-pink"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <span className="text-xs font-semibold text-brand-slate flex items-center gap-1.5">
                <FiFilter className="w-3.5 h-3.5" /> Sort By:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-brand-border/60 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-brand-navy focus:outline-none focus:border-brand-pink cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy pointer-events-none w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-brand-border/60 rounded-3xl p-8 space-y-3">
              <p className="font-serif text-xl font-bold text-brand-navy">No products found</p>
              <p className="text-sm text-brand-slate">Try selecting another category or check back later.</p>
              <button 
                onClick={() => setSelectedCategory("all")}
                className="mt-2 bg-brand-navy text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-brand-navy/95 transition"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-between bg-brand-bg">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <ProductsCatalog />
    </Suspense>
  );
}
