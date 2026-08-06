import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
              Our Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
              Redefining Period Care
            </h1>
            <p className="text-base sm:text-lg text-brand-slate max-w-xl mx-auto leading-relaxed">
              We started Niela with a simple vision: to design intimate wellness products that are gentle on your body and completely kind to the earth.
            </p>
          </div>

          {/* Core Content Body */}
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8 text-brand-slate text-sm sm:text-base leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-brand-navy">The Problem with Plastic</h2>
              <p>
                Did you know that standard commercial sanitary pads are composed of up to 90% crude oil-derived plastics? A single pack of conventional pads contains as much plastic as four grocery bags. This plastic traps heat and moisture against your skin, causing rashes, itchiness, and discomfort, while taking over 500 years to decompose in landfill piles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-brand-navy">The Niela Philosophy</h2>
              <p>
                We believe you shouldn&apos;t have to choose between ultimate leak protection and sustainable wellness. That&apos;s why we source 100% GOTS certified organic cotton for our top-sheets, natural wood pulp for absorbency, and corn-starch films for leak prevention.
              </p>
              <p>
                Niela products are hypoallergenic, completely chemical-free, biodegradable, and designed to match the natural movements of your body, offering rash-free period confidence.
              </p>
            </section>

            {/* Visual Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border/40 text-center">
              <div className="space-y-1">
                <p className="font-serif text-3xl font-bold text-brand-pink">100%</p>
                <p className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Organic Cotton</p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl font-bold text-brand-navy">0%</p>
                <p className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Toxins & Gels</p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl font-bold text-brand-gold">50K+</p>
                <p className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Happy Customers</p>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
