import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy text-center">
            Terms & Conditions
          </h1>
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-brand-slate text-sm sm:text-base leading-relaxed">
            <p className="text-xs text-brand-slate/60">Last updated: July 31, 2026</p>
            <p>
              Welcome to Niela E-Commerce! These terms and conditions outline the rules and regulations for the use of Niela&apos;s Website, located at niela.com.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use Niela if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">Shopping & Payments</h2>
            <p>
              All purchases made through Niela are subjected to payment authorization. We utilize the Razorpay gateway to securely handle card and UPI payments. COD orders are pending verification and must be paid in cash at delivery.
            </p>
            <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">Returns & Hygiene</h2>
            <p>
              Due to the personal hygiene nature of sanitary pads, liners, and menstrual cups, we are unable to accept returns on opened packages. If you receive a damaged box or an incorrect order, please contact customer support immediately for a replacement.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
