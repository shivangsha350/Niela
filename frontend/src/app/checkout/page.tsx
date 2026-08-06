"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, user } = useShop();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push("/cart");
    }
  }, [cart, router, isProcessing]);

  const discountAmount = 0; // standard coupon check is in cart page, checkout matches final
  const shippingFee = cartSubtotal >= 499 ? 0 : 99;
  const grandTotal = cartSubtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !city || !zip || !phone) {
      setError("Please fill in all shipping details.");
      return;
    }

    setIsProcessing(true);
    setError("");

    // Create a mock order object
    const newOrder = {
      _id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart.map(item => ({
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        variant: item.selectedVariant
      })),
      shippingDetails: {
        fullName,
        address,
        city,
        zip,
        phone
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      orderStatus: "Processing",
      totalAmount: grandTotal,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      // Save order to localStorage order list
      if (typeof window !== "undefined") {
        const storedOrders = localStorage.getItem("niela_orders");
        const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
        ordersList.unshift(newOrder);
        localStorage.setItem("niela_orders", JSON.stringify(ordersList));
      }

      clearCart();
      setIsProcessing(false);
      
      // Redirect to Order Confirmation / Tracking Page
      router.push(`/orders/${newOrder._id}`);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-8">
            Checkout Details
          </h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Shipping & Payment Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Address */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Shipping Address
                </h3>

                {error && (
                  <p className="text-red-500 text-xs font-semibold">{error}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Diya Sharma"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. diya@gmail.com"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, apartment, suite"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Pincode (ZIP)</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="400001"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  {/* COD */}
                  <label className="flex items-center gap-3 p-4 border border-brand-border rounded-xl hover:border-brand-pink transition cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-brand-navy w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">Cash on Delivery (COD)</p>
                      <p className="text-xs text-brand-slate">Pay with cash at your doorstep upon package delivery.</p>
                    </div>
                  </label>

                  {/* Razorpay mock */}
                  <label className="flex items-center gap-3 p-4 border border-brand-border rounded-xl hover:border-brand-pink transition cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-brand-navy w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">Online Cards / UPI (Razorpay Checkout)</p>
                      <p className="text-xs text-brand-slate">Instant secure payment with cards, netbanking, or UPI wallet apps.</p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Checkout Summary Side */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Order Summary
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={`${item.product._id}-${item.selectedVariant}`} className="flex justify-between items-center text-xs gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-brand-bg rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-navy truncate max-w-[140px]">{item.product.name}</p>
                          <p className="text-brand-slate font-medium">Qty: {item.quantity} • {item.selectedVariant}</p>
                        </div>
                      </div>
                      <span className="font-bold text-brand-navy text-right">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-brand-border/40" />

                {/* Calculation Rows */}
                <div className="space-y-2 text-sm text-brand-slate">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-navy">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold text-xs">Free</span>
                    ) : (
                      <span className="font-semibold text-brand-navy">₹{shippingFee}</span>
                    )}
                  </div>
                </div>

                <hr className="border-brand-border/40" />

                <div className="flex justify-between items-center text-brand-navy">
                  <span className="font-bold text-base">Grand Total</span>
                  <span className="font-bold text-xl">₹{grandTotal}</span>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-brand-navy text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm"
                  >
                    {isProcessing ? "Processing Order..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay with Razorpay"}
                  </button>
                </div>
              </div>
            </div>

          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
