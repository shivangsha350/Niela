"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import apiService from "@/services/api";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, user } = useShop();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay Script dynamically on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Ignored
      }
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push("/cart");
    }
  }, [cart, router, isProcessing]);

  const discountAmount = 0; // standard coupon check is in cart page, checkout matches final
  const shippingFee = cartSubtotal >= 499 ? 0 : 99;
  const grandTotal = cartSubtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !city || !zip || !phone) {
      setError("Please fill in all shipping details.");
      return;
    }

    if (!user) {
      setError("Please login to place an order.");
      router.push("/login?redirect=checkout");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // 1. Create order in MongoDB backend (initial state)
      const orderPayload = {
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
        paymentMethod: "razorpay",
        totalAmount: grandTotal
      };

      const backendOrder = await apiService.orders.create(orderPayload);

      // 2. Generate Razorpay ticket
      const paymentTicket = await apiService.payments.createOrder(grandTotal);

      // 3. Handle payment (Simulated vs Real)
      if (paymentTicket.simulated) {
        // If simulation mode is active (because keys are not set)
        // Automatically verify payment on backend
        const verifyResponse = await apiService.payments.verifySignature({
          orderId: backendOrder._id,
          razorpay_order_id: paymentTicket.id,
          razorpay_payment_id: "sim_pay_" + Math.floor(100000 + Math.random() * 900000),
          razorpay_signature: "simulated_signature"
        });

        if (verifyResponse.success) {
          // Sync with frontend LocalStorage orders
          const finalOrder = {
            ...backendOrder,
            paymentStatus: "Paid",
            paymentId: "sim_pay_12345",
            createdAt: new Date().toISOString()
          };

          if (typeof window !== "undefined") {
            const storedOrders = localStorage.getItem("niela_orders");
            const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
            ordersList.unshift(finalOrder);
            localStorage.setItem("niela_orders", JSON.stringify(ordersList));
          }

          clearCart();
          setIsProcessing(false);
          router.push(`/orders/${backendOrder._id}`);
        } else {
          throw new Error("Simulated payment verification failed");
        }
      } else {
        // Real Razorpay Checkout flow
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
          amount: paymentTicket.amount,
          currency: paymentTicket.currency,
          name: "Niela Care",
          description: "Organic Period Care Purchase",
          order_id: paymentTicket.id,
          handler: async function (response: any) {
            try {
              const verifyResponse = await apiService.payments.verifySignature({
                orderId: backendOrder._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.success) {
                const finalOrder = {
                  ...backendOrder,
                  paymentStatus: "Paid",
                  paymentId: response.razorpay_payment_id,
                  createdAt: new Date().toISOString()
                };

                if (typeof window !== "undefined") {
                  const storedOrders = localStorage.getItem("niela_orders");
                  const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
                  ordersList.unshift(finalOrder);
                  localStorage.setItem("niela_orders", JSON.stringify(ordersList));
                }

                clearCart();
                setIsProcessing(false);
                router.push(`/orders/${backendOrder._id}`);
              } else {
                setError("Payment signature verification failed. Please contact support.");
                setIsProcessing(false);
              }
            } catch (verifyErr: any) {
              setError(verifyErr.message || "Payment verification failed. Please try again.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone
          },
          theme: {
            color: "#db2777"
          },
          modal: {
            ondismiss: function () {
              setError("Payment cancelled by user.");
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      setIsProcessing(false);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to place order. Please try again."
      );
    }
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
                  {/* Razorpay Option only (COD removed) */}
                  <label className="flex items-center gap-3 p-4 border border-brand-pink bg-brand-bg/20 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={true}
                      readOnly
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
