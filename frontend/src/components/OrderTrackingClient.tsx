"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiCheckCircle, FiPackage, FiTruck, FiSmile, FiDownload } from "react-icons/fi";
import apiService from "@/services/api";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

interface OrderDetails {
  _id: string;
  items: OrderItem[];
  shippingDetails: {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrderTrackingClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      setDownloading(true);
      await apiService.orders.downloadInvoice(order._id);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert("Failed to generate/download invoice PDF. Please try again or contact support.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await apiService.orders.getDetails(orderId);
        if (data) {
          setOrder(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API order details fetch failed, trying local fallback:", err);
      }

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const storedOrders = localStorage.getItem("niela_orders");
        if (storedOrders) {
          try {
            const ordersList: OrderDetails[] = JSON.parse(storedOrders);
            const foundOrder = ordersList.find(o => o._id === orderId);
            if (foundOrder) {
              setOrder(foundOrder);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-brand-bg">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="flex-grow py-16 bg-brand-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 border border-brand-border/60 rounded-3xl space-y-4 max-w-sm mx-auto shadow-sm">
            <h1 className="font-serif text-2xl font-bold text-brand-navy">Order Not Found</h1>
            <p className="text-sm text-brand-slate">We couldn&apos;t find an order matching that ID in your history.</p>
            <Link href="/products" className="inline-block bg-brand-navy text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-brand-navy/95 transition">
              Go to Store
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const steps = [
    { label: "Confirmed", description: "Payment settled", icon: <FiCheckCircle className="w-5 h-5" />, active: true },
    { label: "Processing", description: "Packing your box", icon: <FiPackage className="w-5 h-5" />, active: true },
    { label: "Shipped", description: "Dispatched tracking", icon: <FiTruck className="w-5 h-5" />, active: order.orderStatus === "Shipped" || order.orderStatus === "Delivered" },
    { label: "Delivered", description: "Received package", icon: <FiSmile className="w-5 h-5" />, active: order.orderStatus === "Delivered" }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top confirmation card banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3">
            <FiCheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">Order Placed Successfully!</h2>
            <p className="text-xs sm:text-sm text-brand-slate">
              Thank you for shopping with Niela. Your order <span className="font-bold text-brand-navy">#{order._id}</span> has been confirmed.
            </p>
            <div className="pt-2">
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                title="Download your official branded invoice as a PDF"
              >
                <FiDownload className="w-4 h-4 text-emerald-600" />
                {downloading ? "Generating PDF Invoice..." : "Download Invoice (PDF)"}
              </button>
            </div>
          </div>

          {/* Tracking progress bar */}
          <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-brand-navy text-lg pb-4 border-b border-brand-border/40 mb-6">
              Track Delivery Status
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {/* Connecting lines for progress tracking (Desktop) */}
              <div className="hidden md:block absolute top-[26px] left-[12%] right-[12%] h-[2px] bg-brand-border -z-0">
                <div 
                  className="h-full bg-brand-pink transition-all duration-500" 
                  style={{
                    width: order.orderStatus === "Delivered" ? "100%" : order.orderStatus === "Shipped" ? "66%" : "33%"
                  }}
                ></div>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-2.5 z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition duration-300 ${
                    step.active
                      ? "bg-brand-pink border-brand-pink text-white shadow-sm"
                      : "bg-white border-brand-border text-brand-slate"
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${step.active ? "text-brand-navy" : "text-brand-slate"}`}>{step.label}</p>
                    <p className="text-[10px] text-brand-slate mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Order Items */}
            <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                Ordered Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-brand-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="w-14 h-14 bg-brand-bg rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-navy truncate text-sm">{item.name}</p>
                      <p className="text-xs text-brand-slate mt-0.5">Pack: {item.variant} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-brand-navy text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Billing Summary & Shipping address */}
            <div className="space-y-6">
              {/* Shipping Details Card */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 text-sm text-brand-slate">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40 mb-1">
                  Shipping Address
                </h3>
                <p className="font-semibold text-brand-navy">{order.shippingDetails.fullName}</p>
                <p>{order.shippingDetails.address}</p>
                <p>{order.shippingDetails.city} - {order.shippingDetails.zip}</p>
                <p>Phone: {order.shippingDetails.phone}</p>
              </div>

              {/* Order total */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 text-sm text-brand-slate">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Billing Details
                </h3>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className="font-bold text-brand-navy">{order.paymentStatus} ({order.paymentMethod.toUpperCase()})</span>
                </div>
                <div className="flex justify-between">
                  <span>Grand Total</span>
                  <span className="font-bold text-base text-brand-navy">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/orders" 
              className="inline-flex items-center text-xs text-brand-slate hover:text-brand-pink font-semibold underline decoration-dotted transition"
            >
              View Order History
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
