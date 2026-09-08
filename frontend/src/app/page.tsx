import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import ComfortTech from "@/components/ComfortTech";
import ComparisonSlider from "@/components/ComparisonSlider";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Creative from "@/components/Creative";
import FaqBot from "@/components/FaqBot";

export default function HomePage() {
  return (
    <>
      <Header />
              <FaqBot />

      <main className="flex-grow">
        {/* Animated Slide Hero section */}
        <Hero />

        {/* Core Value Props Row */}
        <TrustBar />
        
        {/* Bestselling Products Grid with wishlist/cart toggle */}
        <ProductGrid />
        
        {/* "Engineered for Comfort" layer breakdown */}
        <ComfortTech />
        
        {/* Comparative slider cotton vs plastic */}
        <ComparisonSlider />
        
        {/* 4-Step ordering timeline */}
        <HowItWorks />
      
        {/* Creative section  */}
        <Creative />

        {/* Review blocks carousel */}
        <Testimonials />
        
        {/* Discount subscription CTA */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
