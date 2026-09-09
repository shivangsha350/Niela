"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product, useShop } from "@/context/ShopContext";
import { FiStar, FiHeart, FiShoppingBag, FiPlus, FiMinus, FiCheckCircle } from "react-icons/fi";

interface ClientProps {
  productId: string;
  initialProduct?: Product;
}

export default function ProductDetailsClient({ productId, initialProduct }: ClientProps) {
  const { products, loading } = useShop();

  const product =
    products.find(
      (p) => p._id === productId || p.slug === productId || p.dbId === productId
    ) || initialProduct;

  if (loading && !product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-brand-bg">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return <ProductDetailsInner product={product} />;
}

function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-bg">
      <Header />
      <main className="flex-grow py-20 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white border border-brand-border/60 rounded-3xl p-10 space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center mx-auto text-brand-pink text-2xl">
            🔍
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-navy">Product Not Found</h2>
          <p className="text-sm text-brand-slate">
            The product you are looking for might have been removed or does not exist.
          </p>
          <Link
            href="/products"
            className="inline-block bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-md"
          >
            Back to Shop
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductDetailsInner({ product }: { product: Product }) {
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : "Regular"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("features");
  const [isAdding, setIsAdding] = useState(false);

  // Sync state if product changes (e.g., after edit in admin panel)
  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0 && !product.images.includes(activeImage)) {
        setActiveImage(product.images[0]);
      }
      if (product.variants && product.variants.length > 0 && !product.variants.includes(selectedVariant)) {
        setSelectedVariant(product.variants[0] || "Regular");
      }
    }
  }, [product, activeImage, selectedVariant]);

  const favorited = isInWishlist(product._id);
  const otherProducts = products.filter((p) => p._id !== product._id).slice(0, 3);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedVariant);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const tabs = [
    { id: "features", label: "Product Features" },
    { id: "usage", label: "How to Use" },
    { id: "reviews", label: `Reviews (${product.reviewsCount || 0})` },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-xs sm:text-sm text-brand-slate mb-8">
            <Link href="/" className="hover:text-brand-pink transition">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-brand-pink transition">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-navy font-semibold">{product.name}</span>
          </nav>

          {/* Product Info Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 border border-brand-border/60 rounded-3xl shadow-sm mb-16">
            
            {/* Gallery Panel */}
            <div className="space-y-4">
              <div className="w-full aspect-[4/3] bg-brand-bg border border-brand-border/40 rounded-2xl overflow-hidden relative">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails Row */}
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 bg-brand-bg border rounded-xl overflow-hidden transition ${
                      activeImage === img
                        ? "border-brand-pink ring-2 ring-brand-pink/20"
                        : "border-brand-border hover:border-brand-pink"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Config Panel */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
                  {product.category}
                </span>
                
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
                  {product.name}
                </h1>

                {/* Ratings */}
                {product.rating && (
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-brand-navy">{product.rating} / 5.0</span>
                    <span className="text-xs text-brand-slate">({product.reviewsCount} verified reviews)</span>
                  </div>
                )}

                {/* Price */}
                {(() => {
                  const displayPrice = product.variantPrices && product.variantPrices[selectedVariant] 
                    ? product.variantPrices[selectedVariant] 
                    : product.price;

                  const displayOriginalPrice = product.variantOriginalPrices && product.variantOriginalPrices[selectedVariant] 
                    ? product.variantOriginalPrices[selectedVariant] 
                    : product.originalPrice;

                  return (
                    <div className="flex items-baseline space-x-3 pt-2">
                      <span className="font-bold text-2xl text-brand-navy">₹{displayPrice}</span>
                      {displayOriginalPrice && (
                        <span className="text-sm text-brand-slate line-through">₹{displayOriginalPrice}</span>
                      )}
                      {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save ₹{displayOriginalPrice - displayPrice}
                        </span>
                      )}
                    </div>
                  );
                })()}

                <p className="text-sm sm:text-base text-brand-slate leading-relaxed pt-2">
                  {product.description}
                </p>

                {/* Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2.5 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                      Select Size/Pack:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                            selectedVariant === v
                              ? "bg-brand-navy border-brand-navy text-white"
                              : "bg-white border-brand-border/60 text-brand-navy hover:border-brand-pink"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action panel: Counter, Add to Cart & Wishlist */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {/* Quantity Counter */}
                  {product.stock > 0 && (
                    <div className="flex items-center justify-between border border-brand-border rounded-xl px-4 py-2.5 bg-brand-bg min-w-[120px] self-start sm:self-auto">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1 text-brand-navy hover:text-brand-pink transition"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm text-brand-navy px-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-1 text-brand-navy hover:text-brand-pink transition"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock <= 0}
                    className={`flex-1 px-8 py-3.5 rounded-xl text-sm font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2 ${
                      product.stock > 0
                        ? "bg-brand-navy hover:bg-brand-navy/95 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    {product.stock > 0 
                      ? (isAdding ? "Adding to Cart..." : "Add to Cart") 
                      : "Out of Stock"}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-3.5 rounded-xl border border-brand-border/60 text-brand-navy hover:text-brand-pink transition duration-200"
                    aria-label="Wishlist toggle"
                  >
                    <FiHeart className={`w-5 h-5 ${favorited ? "fill-brand-pink text-brand-pink" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Badges strip */}
              <div className="border-t border-brand-border/60 pt-6 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs text-brand-slate font-medium">
                <div className="p-2.5 bg-brand-bg/50 border border-brand-border/40 rounded-xl">🔒 Secure checkout</div>
                <div className="p-2.5 bg-brand-bg/50 border border-brand-border/40 rounded-xl">📦 Discreet delivery</div>
                <div className="p-2.5 bg-brand-bg/50 border border-brand-border/40 rounded-xl">🌿 Chemical-free</div>
              </div>
            </div>

          </div>

          {/* Detailed Tabs Panel */}
          <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-10 shadow-sm mb-16">
            <div className="flex border-b border-brand-border/60 gap-8 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm sm:text-base font-semibold border-b-2 transition duration-200 ${
                    activeTab === tab.id
                      ? "border-brand-navy text-brand-navy"
                      : "border-transparent text-brand-slate hover:text-brand-pink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[150px]">
              {activeTab === "features" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features && product.features.map((feat, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FiCheckCircle className="w-5 h-5 text-brand-pink mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-brand-slate">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "usage" && (
                <div className="space-y-4 text-brand-slate text-sm sm:text-base leading-relaxed">
                  <p><strong>Step 1:</strong> Unwrap the pad and release it from the biodegradable packaging strip.</p>
                  <p><strong>Step 2:</strong> Press the adhesive back of the pad firmly onto the center of your underwear.</p>
                  <p><strong>Step 3:</strong> Wrap the side wings around the underside of your underwear to lock it in place.</p>
                  <p><strong>Step 4:</strong> Change every 4 to 6 hours (or as required) to maintain hygiene and ultimate freshness.</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-brand-border/40 pb-6">
                    <span className="text-4xl font-serif font-bold text-brand-navy">{product.rating}</span>
                    <div>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-brand-slate mt-1 font-semibold">Average rating from {product.reviewsCount} buyers</p>
                    </div>
                  </div>
                  
                  {/* Sample Customer Review */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-brand-navy">
                      <span className="font-bold">Meera Nair</span>
                      <span className="text-brand-slate">Verified Buyer • 2 weeks ago</span>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                      &ldquo;Absolutely in love with this product! These are super gentle on the skin. I didn&apos;t get any irritation and the absorbency is top notch compared to plastic pads.&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cross Sell Section */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {otherProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
