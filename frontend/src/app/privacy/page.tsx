import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy text-center">
            Privacy Policy
          </h1>
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-brand-slate text-sm sm:text-base leading-relaxed">
            <p className="text-xs text-brand-slate/60">Last updated: July 31, 2026</p>
            <p>
              At Niela E-Commerce, accessible from niela.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Niela and how we use it.
            </p>
            <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">Information We Collect</h2>
            <p>
              We collect personal information when you sign up for an account, fill in purchase order details at checkout, write enquiries via the contact form, or subscribe to our promotional discount newsletter. This information includes your name, email, billing/shipping address, postcode, phone number, and credit card/Razorpay transactional tokens.
            </p>
            <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">How We Use Your Information</h2>
            <p>
              We use the collected information to fulfill orders, process Razorpay checkouts, dispatch shipments, notify you of order statuses, email newsletter updates, and prevent fraudulent transactions on the platform.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
