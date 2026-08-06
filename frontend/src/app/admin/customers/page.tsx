"use client";

import React, { useState, useEffect } from "react";
import { FiMail, FiCheck, FiRefreshCw } from "react-icons/fi";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "Pending" | "Resolved";
  createdAt: string;
}

const defaultEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    name: "Rohan Varma",
    email: "rohan@gmail.com",
    message: "Hi, I am interested in subscribing to the Starter Kit for my wife, but I want to customize the regular pad counts. Is that possible?",
    status: "Pending",
    createdAt: "2026-07-30T10:30:00.000Z"
  },
  {
    id: "enq-2",
    name: "Dr. Anjali Bose",
    email: "anjali.bose@yahoo.com",
    message: "Hello Niela team. Do you offer bulk discounts for hospitals or female hygiene awareness campaigns? Looking forward to partnering.",
    status: "Resolved",
    createdAt: "2026-07-29T14:20:00.000Z"
  }
];

export default function AdminCustomersEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niela_admin_enquiries");
      if (stored) {
        setEnquiries(JSON.parse(stored));
      } else {
        setEnquiries(defaultEnquiries);
        localStorage.setItem("niela_admin_enquiries", JSON.stringify(defaultEnquiries));
      }
    }
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated: Enquiry[] = enquiries.map((enq) =>
      enq.id === id 
        ? { ...enq, status: enq.status === "Pending" ? "Resolved" : "Pending" }
        : enq
    );
    setEnquiries(updated);
    localStorage.setItem("niela_admin_enquiries", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Customer Enquiries</h1>
        <p className="text-xs sm:text-sm text-brand-slate">Review and respond to questions submitted by customers on the Contact page.</p>
      </div>

      <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-brand-navy border-b border-brand-border/40 pb-2">
              <th className="py-2.5 font-bold">Sender Details</th>
              <th className="py-2.5 font-bold">Query Message</th>
              <th className="py-2.5 font-bold">Submitted Date</th>
              <th className="py-2.5 font-bold">Fulfillment</th>
              <th className="py-2.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20 text-brand-slate">
            {enquiries.map((enq) => {
              const date = new Date(enq.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric"
              });

              return (
                <tr key={enq.id} className="hover:bg-brand-bg/40 transition">
                  <td className="py-4">
                    <p className="font-semibold text-brand-navy">{enq.name}</p>
                    <p className="text-xs text-brand-slate font-mono mt-0.5">{enq.email}</p>
                  </td>
                  <td className="py-4 max-w-sm">
                    <p className="line-clamp-2 leading-relaxed text-brand-slate">{enq.message}</p>
                  </td>
                  <td className="py-4 font-medium">{date}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      enq.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(enq.id)}
                      className={`p-2 rounded-lg border transition duration-200 inline-flex items-center justify-center ${
                        enq.status === "Pending"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                          : "bg-brand-bg border-brand-border/60 text-brand-navy hover:bg-white"
                      }`}
                      title={enq.status === "Pending" ? "Mark Resolved" : "Mark Pending"}
                    >
                      {enq.status === "Pending" ? <FiCheck className="w-4 h-4" /> : <FiRefreshCw className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
