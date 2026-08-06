"use client";

import React, { useState, useEffect } from "react";
import { FiChevronDown, FiTruck, FiMapPin } from "react-icons/fi";

interface OrderItem {
  name: string;
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

export default function AdminOrdersManagerPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niela_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    }
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) =>
      o._id === orderId ? { ...o, orderStatus: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("niela_orders", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Fulfillment Orders</h1>
        <p className="text-xs sm:text-sm text-brand-slate">Monitor customer transactions, check payments, and update shipping logs.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-border/60 p-12 text-center text-brand-slate text-xs sm:text-sm">
            No orders have been received yet.
          </div>
        ) : (
          orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div 
                key={order._id}
                className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-brand-border/40">
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm sm:text-base">Order #{order._id}</h3>
                    <p className="text-xs text-brand-slate mt-0.5">Placed on {formattedDate}</p>
                  </div>
                  
                  {/* Status selection trigger */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-brand-slate flex items-center gap-1">
                      <FiTruck className="w-3.5 h-3.5" /> Order Status:
                    </span>
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="appearance-none bg-brand-bg border border-brand-border rounded-xl px-4 py-2 pr-8 text-xs font-bold text-brand-navy cursor-pointer focus:outline-none focus:border-brand-pink"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy pointer-events-none w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Items & Address Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs sm:text-sm text-brand-slate">
                  {/* Left Column: Items details */}
                  <div className="md:col-span-7 space-y-3.5">
                    <h4 className="font-bold text-brand-navy text-xs uppercase tracking-wider">Ordered Products</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-brand-bg/40 p-3 rounded-xl border border-brand-border/20">
                          <div>
                            <p className="font-semibold text-brand-navy">{item.name}</p>
                            <p className="text-xs text-brand-slate mt-0.5">Pack Size: {item.variant} • Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-brand-navy">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Address Map */}
                  <div className="md:col-span-5 space-y-3.5">
                    <h4 className="font-bold text-brand-navy text-xs uppercase tracking-wider flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5" /> Delivery Address
                    </h4>
                    <div className="bg-brand-bg/40 p-4 rounded-xl border border-brand-border/20 space-y-1">
                      <p className="font-bold text-brand-navy">{order.shippingDetails.fullName}</p>
                      <p>{order.shippingDetails.address}</p>
                      <p>{order.shippingDetails.city} - {order.shippingDetails.zip}</p>
                      <p className="pt-2 font-medium">Contact: {order.shippingDetails.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Order Footer Summary */}
                <div className="flex justify-between items-center pt-4 border-t border-brand-border/40 text-xs sm:text-sm font-semibold">
                  <span className="text-brand-slate">Payment Mode: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
                  <span className="text-brand-navy text-base font-bold">Total Amount: ₹{order.totalAmount}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
