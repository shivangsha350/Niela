"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const { loginUser } = useShop();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate signup API call
    setTimeout(() => {
      setLoading(false);
      loginUser(
        {
          _id: "mock-user-123",
          name,
          email,
          role: "user",
        },
        "mock-jwt-auth-token-12345"
      );
      router.push("/products");
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="font-serif text-3xl font-bold text-brand-navy">Create Account</h1>
              <p className="text-xs sm:text-sm text-brand-slate">Sign up to save items, track orders, and get 10% off.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Diya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. diya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-xs text-brand-slate text-center border-t border-brand-border/40 pt-4">
              <p>Already have an account? <Link href="/login" className="text-brand-pink font-bold hover:underline">Login</Link></p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
