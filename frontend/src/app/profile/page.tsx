"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { FiUser, FiMapPin, FiPackage, FiLogOut } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logoutUser } = useShop();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Sync profile details from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAddress = localStorage.getItem("niela_profile_address");
      const storedCity = localStorage.getItem("niela_profile_city");
      const storedZip = localStorage.getItem("niela_profile_zip");
      const storedPhone = localStorage.getItem("niela_profile_phone");

      if (storedAddress) setAddress(storedAddress);
      if (storedCity) setCity(storedCity);
      if (storedZip) setZip(storedZip);
      if (storedPhone) setPhone(storedPhone);
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("niela_profile_address", address);
      localStorage.setItem("niela_profile_city", city);
      localStorage.setItem("niela_profile_zip", zip);
      localStorage.setItem("niela_profile_phone", phone);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-grow py-16 bg-brand-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 border border-brand-border/60 rounded-3xl space-y-4 max-w-sm mx-auto shadow-sm">
            <FiUser className="w-12 h-12 text-brand-slate mx-auto stroke-[1.2]" />
            <h1 className="font-serif text-2xl font-bold text-brand-navy">Login Required</h1>
            <p className="text-sm text-brand-slate">You need to sign in to access your profile account dashboard.</p>
            <Link href="/login" className="inline-block bg-brand-navy text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-navy/95 transition">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow py-12 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Your Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 bg-white border border-brand-border/60 rounded-3xl p-5 space-y-2 shadow-sm">
              <div className="p-4 border-b border-brand-border/40 pb-4 mb-4 text-center sm:text-left">
                <p className="font-bold text-brand-navy text-base truncate">{user.name}</p>
                <p className="text-xs text-brand-slate truncate">{user.email}</p>
              </div>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 bg-brand-bg rounded-xl text-brand-navy text-sm font-semibold">
                <FiUser className="w-4 h-4 text-brand-pink" /> Profile Details
              </Link>
              <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-bg/50 rounded-xl text-brand-navy text-sm font-medium transition">
                <FiPackage className="w-4 h-4 text-brand-slate" /> My Orders
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition mt-2"
              >
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            {/* Profile Forms */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Account Details Box */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-brand-slate">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-navy">Name</p>
                    <p className="mt-1 font-semibold text-brand-navy">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</p>
                    <p className="mt-1 font-semibold text-brand-navy">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Address Book Box */}
              <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-brand-navy text-lg pb-2 border-b border-brand-border/40">
                  Saved Address Book
                </h3>
                
                {isSaved && (
                  <p className="text-emerald-600 text-xs font-semibold">Address details saved successfully!</p>
                )}

                <form onSubmit={handleSaveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, building, street address"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">ZIP/Pincode</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-brand-navy text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-navy/95 transition shadow-sm"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
