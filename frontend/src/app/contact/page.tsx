"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Create a new enquiry object
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name,
      email,
      message,
      status: "Pending" as const,
      createdAt: new Date().toISOString()
    };

    // Load existing enquiries, append, and save
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niela_admin_enquiries");
      const currentList = stored ? JSON.parse(stored) : [
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
      const updatedList = [newEnquiry, ...currentList];
      localStorage.setItem("niela_admin_enquiries", JSON.stringify(updatedList));
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">Contact Us</h1>
            <p className="text-sm sm:text-base text-brand-slate">
              Have questions about sizing, packages, or shipping? We are here to support you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Contact Info cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-center h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40 text-brand-navy">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm sm:text-base">Support Email</h3>
                    <p className="text-xs sm:text-sm text-brand-slate mt-1">support@niela.com</p>
                    <p className="text-[10px] text-brand-slate">We respond within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40 text-brand-navy">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm sm:text-base">Helpline Support</h3>
                    <p className="text-xs sm:text-sm text-brand-slate mt-1">+91 98765 43210</p>
                    <p className="text-[10px] text-brand-slate">Mon - Sat: 9 AM to 6 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40 text-brand-navy">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm sm:text-base">Corporate Office</h3>
                    <p className="text-xs sm:text-sm text-brand-slate mt-1">Niela Wellness Pvt. Ltd.</p>
                    <p className="text-xs text-brand-slate">Bandrakurla Complex, Bandra East, Mumbai - 400051</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm h-full flex flex-col justify-center">
                
                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-center space-y-2">
                    <p className="font-serif text-lg font-bold">Enquiry Sent!</p>
                    <p className="text-xs">Your enquiry has been received. Our support team will get in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Message Details</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message details here..."
                        className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-navy/95 transition shadow-sm gap-2"
                    >
                      <FiSend className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
