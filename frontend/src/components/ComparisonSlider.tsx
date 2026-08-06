"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    
    // Boundary check
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      handleMove(e.touches[0].clientX);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section className="w-full py-16 sm:py-24 bg-brand-bg/50 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            The Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Soft Cotton vs. Scratchy Plastic
          </h2>
          <p className="text-sm sm:text-base text-brand-slate">
            Drag the slider to compare standard synthetic plastic pads with Niela&apos;s GOTS-certified 100% organic cotton pads.
          </p>
        </div>

        {/* Slider Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-[360px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg select-none cursor-ew-resize border border-brand-border"
        >
          {/* Left Side: Niela Cotton Pad (Top Layer) */}
          <div 
            className="absolute top-0 left-0 h-full bg-brand-pink-light overflow-hidden z-10"
            style={{ width: `${sliderPosition}%` }}
          >
            <div 
              className="absolute top-0 left-0 h-full w-full flex flex-col justify-center p-8 sm:p-12 text-brand-navy"
              style={{ width: containerRef.current?.getBoundingClientRect().width || "100%" }}
            >
              <div className="max-w-md space-y-4">
                <span className="inline-block px-3 py-1 bg-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-wider rounded-full">
                  Niela Pad
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold">100% Organic Cotton</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-brand-slate font-medium">
                  <li className="flex items-center gap-2">✓ Breathable, hypoallergenic cotton</li>
                  <li className="flex items-center gap-2">✓ Natural FSC wood-pulp absorber</li>
                  <li className="flex items-center gap-2">✓ Free of chlorine, fragrances, and dyes</li>
                  <li className="flex items-center gap-2">✓ 100% biodegradable backing film</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side: Standard Pad (Bottom Layer) */}
          <div className="absolute top-0 right-0 h-full w-full bg-slate-200 flex flex-col justify-center p-8 sm:p-12 text-slate-800 text-right">
            <div className="absolute right-0 max-w-md space-y-4 p-8 sm:p-12">
              <span className="inline-block px-3 py-1 bg-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full">
                Standard Pad
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold">Synthetic Plastic cover</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium inline-block text-right">
                <li className="flex items-center justify-end gap-2">Scratchy plastic top sheet ✗</li>
                <li className="flex items-center justify-end gap-2">Petrochemical absorbent gels ✗</li>
                <li className="flex items-center justify-end gap-2">Bleached with chlorine toxins ✗</li>
                <li className="flex items-center justify-end gap-2">Non-biodegradable synthetic base ✗</li>
              </ul>
            </div>
          </div>

          {/* Drag Handle Bar */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 transition">
              <div className="flex gap-0.5">
                <FiArrowLeft className="w-3.5 h-3.5" />
                <FiArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Small screen guidance */}
        <div className="text-center mt-4 text-xs text-brand-slate italic md:hidden">
          Swipe or drag the arrows to compare.
        </div>

      </div>
    </section>
  );
}
