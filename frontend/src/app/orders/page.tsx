"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiPackage, FiChevronRight } from "react-icons/fi";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

interface OrderSummary {
  _id: string;
  items: OrderItem[];
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrders = localStorage.getItem("niela_orders");
      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-8">
            Order History
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-border/60 rounded-3xl p-8 space-y-6 shadow-sm">
              <FiPackage className="w-16 h-16 mx-auto stroke-[1.2] text-brand-slate" />
              <div className="space-y-2">
                <p className="font-serif text-xl font-bold text-brand-navy">No orders found</p>
                <p className="text-sm text-brand-slate">You haven&apos;t placed any orders yet.</p>
              </div>
              <Link 
                href="/products"
                className="inline-flex bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm"
              >
                Go to Store
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                });

                return (
                  <div 
                    key={order._id}
                    className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-pink transition duration-200"
                  >
                    {/* Order summary info */}
                    <div className="space-y-2.5 flex-grow">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-brand-navy text-base sm:text-lg">Order #{order._id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-brand-pink-light text-brand-pink border border-brand-pink/10"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-brand-slate font-medium">Placed on {formattedDate}</p>
                      
                      {/* Products snippet */}
                      <div className="flex gap-2.5 pt-1.5 overflow-x-auto pr-1">
                        {order.items.map((item, index) => (
                          <div 
                            key={index}
                            className="w-12 h-12 bg-brand-bg border border-brand-border/40 rounded-xl overflow-hidden flex-shrink-0 relative group"
                            title={`${item.name} (${item.variant})`}
                          >
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                            {item.quantity > 1 && (
                              <span className="absolute bottom-0 right-0 bg-brand-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total billing + link */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-brand-border/40 pt-4 md:pt-0">
                      <div className="md:text-right">
                        <p className="text-xs text-brand-slate">Total Amount</p>
                        <p className="font-bold text-lg text-brand-navy mt-0.5">₹{order.totalAmount}</p>
                      </div>
                      <Link 
                        href={`/orders/${order._id}`}
                        className="bg-brand-bg text-brand-navy p-3 rounded-xl border border-brand-border/60 hover:bg-brand-navy hover:text-white transition duration-200 flex items-center justify-center"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
