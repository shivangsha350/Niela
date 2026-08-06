"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const { loginUser } = useShop();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate login API call after 1 second delay
    setTimeout(() => {
      setLoading(false);
      
      let role: "user" | "admin" = "user";
      let name = "Guest User";

      // If logging in with the admin email, configure as admin
      if (email.toLowerCase() === "admin@niela.com") {
        role = "admin";
        name = "Administrator";
      }

      loginUser(
        {
          _id: "mock-user-123",
          name,
          email,
          role,
        },
        "mock-jwt-auth-token-12345"
      );

      // Redirect depending on user privilege role
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
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
              <h1 className="font-serif text-3xl font-bold text-brand-navy">Welcome Back</h1>
              <p className="text-xs sm:text-sm text-brand-slate">Login to access your profile and track orders.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Password</label>
                  <a href="#" className="text-xs text-brand-pink hover:underline">Forgot?</a>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
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
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-xs text-brand-slate text-center border-t border-brand-border/40 pt-4">
              <p>Don&apos;t have an account? <Link href="/register" className="text-brand-pink font-bold hover:underline">Sign up</Link></p>
              <p className="mt-2 text-[10px] italic">Tip: Use email <strong className="text-brand-gold">admin@niela.com</strong> to login as administrator.</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
