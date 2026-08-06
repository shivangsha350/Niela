"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiDollarSign, FiShoppingBag, FiUsers, FiMail, FiArrowRight } from "react-icons/fi";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummary {
  _id: string;
  items: OrderItem[];
  shippingDetails: {
    fullName: string;
  };
  totalAmount: number;
  orderStatus: string;
}

export default function AdminDashboardPage() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrders = localStorage.getItem("niela_orders");
      if (storedOrders) {
        try {
          const list: OrderSummary[] = JSON.parse(storedOrders);
          setOrdersCount(list.length);
          const totalRev = list.reduce((total, order) => total + order.totalAmount, 0);
          setRevenue(totalRev);
          setRecentOrders(list.slice(0, 5));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const stats = [
    { label: "Total Revenue", value: `₹${revenue}`, icon: <FiDollarSign className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Total Orders", value: ordersCount, icon: <FiShoppingBag className="w-5 h-5 text-brand-pink" />, bg: "bg-brand-pink-light" },
    { label: "Active Customers", value: "1", icon: <FiUsers className="w-5 h-5 text-brand-navy" />, bg: "bg-blue-50" },
    { label: "Customer Enquiries", value: "0", icon: <FiMail className="w-5 h-5 text-brand-gold" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Overview Dashboard</h1>
        <p className="text-xs sm:text-sm text-brand-slate">Real-time analytical data updates and transaction tracking logs.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-brand-slate font-semibold">{stat.label}</span>
              <p className="text-2xl font-bold text-brand-navy">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders List Card */}
      <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-brand-border/40 mb-6">
          <h3 className="font-serif font-bold text-brand-navy text-lg">
            Recent Placed Orders
          </h3>
          <Link 
            href="/admin/orders" 
            className="text-xs text-brand-pink font-semibold hover:underline flex items-center gap-1.5"
          >
            Manage All Orders <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-center py-10 text-xs sm:text-sm text-brand-slate">No recent orders have been processed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-brand-navy border-b border-brand-border/40 pb-2">
                  <th className="py-2.5 font-bold">Order ID</th>
                  <th className="py-2.5 font-bold">Customer Name</th>
                  <th className="py-2.5 font-bold">Items Count</th>
                  <th className="py-2.5 font-bold">Total Amount</th>
                  <th className="py-2.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/20 text-brand-slate">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-brand-bg/40 transition">
                    <td className="py-3 font-semibold text-brand-navy">#{ord._id}</td>
                    <td className="py-3">{ord.shippingDetails.fullName}</td>
                    <td className="py-3">{ord.items.length} product(s)</td>
                    <td className="py-3 font-bold text-brand-navy">₹{ord.totalAmount}</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-pink-light text-brand-pink border border-brand-pink/10">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
