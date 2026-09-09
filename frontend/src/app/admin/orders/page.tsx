"use client";

import React, { useState, useEffect } from "react";
import { FiChevronDown, FiTruck, FiMapPin, FiDownload, FiCheckCircle } from "react-icons/fi";
import apiService from "@/services/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.admin.getAllOrders();
      setOrders(data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiService.admin.updateOrderStatus(orderId, newStatus);
      const updated = orders.map((o) =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      );
      setOrders(updated);
      setToastMsg(`Order #${orderId.slice(-6).toUpperCase()} status changed to "${newStatus}" & customer was notified via email!`);
      setTimeout(() => setToastMsg(""), 5000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to update order status");
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      setDownloadingId(orderId);
      await apiService.admin.downloadInvoice(orderId);
    } catch (err: any) {
      console.error("Failed to download invoice:", err);
      alert("Failed to generate/download invoice PDF. Please check server logs.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Fulfillment Orders</h1>
        <p className="text-xs sm:text-sm text-brand-slate">Monitor customer transactions, check payments, and update shipping logs.</p>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-sm">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-brand-border/60">
            <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 rounded-3xl border border-red-200 p-8 text-center text-xs sm:text-sm font-semibold">
            {error}
          </div>
        ) : orders.length === 0 ? (
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
                  
                  {/* Actions & Status Selection */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleDownloadInvoice(order._id)}
                      disabled={downloadingId === order._id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
                      title="Download Branded PDF Invoice"
                    >
                      <FiDownload className="w-3.5 h-3.5 text-rose-600" />
                      {downloadingId === order._id ? "Generating PDF..." : "Download Invoice"}
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-brand-slate flex items-center gap-1">
                        <FiTruck className="w-3.5 h-3.5" /> Status:
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
