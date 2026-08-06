"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    badge: "100% Organic & Biodegradable",
    title: "Period care designed to feel like nothing.",
    description: "Sanitary essentials made with certified organic cotton. Zero plastics, zero toxins, zero compromise on leak protection.",
    ctaText: "Shop the Collection",
    ctaLink: "/products",
    bgClass: "bg-brand-pink-light",
    imgSrc: "/images/regular_pads.png"
  },
  {
    id: 2,
    badge: "Eco-Friendly Kits",
    title: "Gentle on your body. Kinder to the planet.",
    description: "Make the switch today. Save up to 15% with our reusable Menstrual Cups and organic cotton Starter Kits.",
    ctaText: "Explore Starter Kits",
    ctaLink: "/products?category=kits",
    bgClass: "bg-emerald-50/40",
    imgSrc: "/images/starter_kit.png"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden w-full min-h-[580px] sm:min-h-[640px] flex items-center bg-brand-bg">
      <AnimatePresence mode="wait">
        {slides.map((slide, idx) => (
          idx === currentSlide && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 w-full h-full flex items-center ${slide.bgClass}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-20">
                {/* Text Content */}
                <div className="space-y-6 text-left max-w-lg z-10">
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3.5 py-1 bg-brand-navy/5 text-brand-navy rounded-full text-xs font-semibold uppercase tracking-wider"
                  >
                    {slide.badge}
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-brand-navy"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base sm:text-lg text-brand-slate leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>
                  
                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center gap-4 pt-2"
                  >
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center bg-brand-navy text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-brand-navy/95 transition duration-200 shadow-md group"
                    >
                      {slide.ctaText}
                      <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition duration-200" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center bg-transparent border border-brand-border hover:bg-white/40 text-brand-dark-navy px-8 py-3.5 rounded-full text-sm font-semibold transition duration-200"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>

                {/* Image Section */}
                <div className="hidden md:flex justify-center items-center relative h-[380px] lg:h-[450px]">
                  {/* Styled background blob */}
                  <div className="absolute inset-0 bg-brand-pink/5 rounded-full filter blur-3xl scale-95 -z-10"></div>
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    src={slide.imgSrc}
                    alt={slide.title}
                    className="max-h-[380px] lg:max-h-[440px] w-auto object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Pagination bullets */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-brand-navy px-3" 
                : "bg-brand-navy/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
