"use client";

import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") return;
    
    // Simulate API request
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-brand-pink-light border-b border-brand-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Header */}
        <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
          Join the Movement
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
          Subscribe & Save 10%
        </h2>
        <p className="text-sm sm:text-base text-brand-slate max-w-xl mx-auto">
          Get wellness tips, special product releases, and 10% off your first organic care purchase delivered directly to your inbox.
        </p>

        {/* Form */}
        <div className="max-w-md mx-auto pt-2">
          {subscribed ? (
            <div className="p-4 bg-brand-navy text-white rounded-2xl text-sm font-semibold tracking-wide shadow-md animate-fade-in">
              Welcome to the Niela Family! Check your inbox for your 10% discount code.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy placeholder-brand-slate/60 focus:outline-none focus:border-brand-pink transition"
              />
              <button
                type="submit"
                className="bg-brand-navy text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-brand-navy/95 transition duration-200"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
