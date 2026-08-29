"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import apiService from "@/services/api";

export default function AdminLoginPage() {
  const { loginUser } = useShop();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiService.auth.login(email, password);
      
      if (data.role !== "admin") {
        setError("Forbidden: You do not have administrator privileges.");
        setLoading(false);
        return;
      }

      loginUser(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );
      router.push("/admin");
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password."
      );
    }
  };

  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl">
        <div className="text-center flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center space-x-3 mb-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0 bg-brand-bg p-0.5 border border-brand-border/60">
              <img 
                src="/images/logo.png" 
                alt="niela logo" 
                className="absolute w-[200%] h-[200%] max-w-none -top-[15%] left-1/2 -translate-x-1/2 object-cover" 
              />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight text-brand-navy">niela</span>
            <span className="w-1.5 h-1.5 bg-brand-pink rounded-full self-end mb-1.5"></span>
          </Link>
          <h2 className="mt-4 text-2xl font-serif font-bold text-brand-navy">Admin Portal Access</h2>
          <p className="mt-2 text-xs text-brand-slate">Authorized administrative personnel only.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@niela.com"
              className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Secret Key Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-navy/95 transition text-sm"
          >
            {loading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => router.push("/")}
            className="text-xs text-brand-slate hover:text-brand-pink font-semibold underline decoration-dotted transition"
          >
            ← Back to Customer Website
          </button>
        </div>
      </div>
    </main>
  );
}
