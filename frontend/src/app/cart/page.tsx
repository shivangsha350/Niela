"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiPercent } from "react-icons/fi";

export default function CartPage() {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart, clearCart } = useShop();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "NIELA10") {
      setDiscountPercent(10);
      setCouponSuccess("Coupon 'NIELA10' applied successfully! 10% discount has been subtracted.");
      setCouponError("");
    } else if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code.");
      setCouponSuccess("");
    } else {
      setCouponError("Invalid coupon code. Try 'NIELA10'.");
      setCouponSuccess("");
      setDiscountPercent(0);
    }
  };

  const discountAmount = Math.round(cartSubtotal * (discountPercent / 100));
  const shippingFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49;
  const grandTotal = cartSubtotal - discountAmount + shippingFee;

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-8">
            Your Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-border/60 rounded-3xl p-8 space-y-6">
              <FiShoppingBag className="w-16 h-16 mx-auto stroke-[1.2] text-brand-slate" />
              <div className="space-y-2">
                <p className="font-serif text-xl font-bold text-brand-navy">Your cart is empty</p>
                <p className="text-sm text-brand-slate">Looks like you haven&apos;t added any period care essentials yet.</p>
              </div>
              <Link 
                href="/products"
                className="inline-flex bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Cart List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white border border-brand-border/60 rounded-3xl overflow-hidden shadow-sm p-6 space-y-6">
                  {cart.map((item) => (
                    <div 
                      key={`${item.product._id}-${item.selectedVariant}`}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-b border-brand-border/40 pb-6 last:border-0 last:pb-0"
                    >
                      {/* Product details info */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-brand-bg rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link 
                            href={`/products/${item.product._id}`}
                            className="font-serif font-bold text-brand-navy hover:text-brand-pink transition text-base sm:text-lg"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-brand-slate mt-1 font-semibold">Pack Variant: {item.selectedVariant}</p>
                          <p className="font-bold text-sm text-brand-navy mt-1">₹{item.product.price}</p>
                        </div>
                      </div>

                      {/* Quantity & subtotal operations */}
                      <div className="flex items-center justify-between sm:justify-end gap-8">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-brand-border rounded-xl px-2 py-1 bg-brand-bg">
                          <button 
                            onClick={() => updateCartQuantity(item.product._id, item.selectedVariant, item.quantity - 1)}
                            className="p-1.5 hover:text-brand-pink transition"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product._id, item.selectedVariant, item.quantity + 1)}
                            className="p-1.5 hover:text-brand-pink transition"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-base text-brand-navy min-w-[60px] text-right">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product._id, item.selectedVariant)}
                            className="p-2 text-brand-slate hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                            aria-label="Remove item"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="text-left">
                  <button
                    onClick={clearCart}
                    className="text-xs text-brand-slate hover:text-red-500 font-semibold underline decoration-dotted transition"
                  >
                    Clear shopping bag
                  </button>
                </div>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Coupon Code Block */}
                <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                    <FiPercent className="w-4 h-4 text-brand-pink" /> Promo Coupon
                  </h3>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NIELA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border border-brand-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-pink text-brand-navy"
                    />
                    <button
                      type="submit"
                      className="bg-brand-navy text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-brand-navy/95 transition"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                  {couponSuccess && <p className="text-emerald-600 text-xs mt-2 font-medium">{couponSuccess}</p>}
                  <p className="text-[10px] text-brand-slate mt-2 italic">Use code &apos;NIELA10&apos; to test a 10% discount.</p>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-2.5 text-sm text-brand-slate">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-brand-navy">₹{cartSubtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount (10%)</span>
                        <span>- ₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-semibold uppercase text-xs">Free</span>
                      ) : (
                        <span className="font-semibold text-brand-navy">₹{shippingFee}</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center text-brand-navy">
                    <span className="font-bold text-base">Grand Total</span>
                    <span className="font-bold text-xl">₹{grandTotal}</span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/checkout"
                      className="w-full inline-flex items-center justify-center bg-brand-navy text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm group"
                    >
                      Proceed to Checkout
                      <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link href="/products" className="text-xs text-brand-slate hover:text-brand-pink transition font-medium">
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
