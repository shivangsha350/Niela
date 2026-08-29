"use client";

import React, { useState, useRef, useEffect } from "react";

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
    <section className="w-full py-16 sm:py-24 bg-[#FAF8F5] border-b border-brand-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6b8e57]">
            The Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Normal Pads vs. Niela Pads
          </h2>
          <p className="text-sm sm:text-base text-brand-slate">
            Drag the slider to compare standard pads with Niela&apos;s GOTS-certified 100% organic cotton pads.
          </p>
        </div>

        {/* Slider Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-[400px] xs:h-[350px] sm:h-[300px] md:h-[280px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg select-none cursor-ew-resize border border-brand-border/80"
        >
          {/* Right Side: Niela Pads (Bottom Layer, dynamically sized and positioned) */}
          <div 
            className="absolute top-0 right-0 h-full bg-[#fdf8f0] flex items-center justify-between text-[#2c3e20] overflow-hidden"
            style={{ left: `${sliderPosition}%`, width: `${100 - sliderPosition}%` }}
          >
            <div className="flex h-full w-full items-center min-w-[200px]">
              
              {/* Happy girl illustration */}
              <div className="w-[42%] sm:w-[45%] h-full flex items-center justify-end pr-2 sm:pr-6 md:pr-10">
                <img 
                  src="/images/happy_girl_illustration.png" 
                  alt="Happy serene girl illustration" 
                  className="h-full max-h-[85%] object-contain select-none"
                />
              </div>

              {/* Niela Pads details */}
              <div className="w-[58%] sm:w-[55%] flex flex-col justify-center pl-2 sm:pl-6 md:pl-10 space-y-2 sm:space-y-3 md:space-y-4">
                <div className="hidden xs:block">
                  <span className="inline-block px-2.5 py-0.5 sm:py-1 bg-[#6b8e57] text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider rounded-[6px]">
                    Niela Pads
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl leading-tight text-[#3d5230] tracking-wide">
                  SOFT, BREATHABLE<br className="hidden sm:inline" /> & IRRITATION-FREE.
                </h3>
                <ul className="space-y-0.5 sm:space-y-1.5 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-[#4a5f3e] min-w-0">
                  <li className="flex items-center gap-1 sm:gap-2 truncate">
                    <span className="text-[#6b8e57] font-bold">✓</span> Super soft cotton top layer
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2 truncate">
                    <span className="text-[#6b8e57] font-bold">✓</span> Breathable & rash-free
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2 truncate">
                    <span className="text-[#6b8e57] font-bold">✓</span> Keeps you fresh all day
                  </li>
                  <li className="flex items-center gap-1 sm:gap-2 truncate">
                    <span className="text-[#6b8e57] font-bold">✓</span> Dermatologically tested
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Left Side: Normal Pads (Top Layer, sliding width) */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#f1ebf9] overflow-hidden z-10"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between text-[#3b2a6f] min-w-[200px]">
              <div className="flex h-full w-full items-center">
                
                {/* Normal Pads details */}
                <div className="w-[58%] sm:w-[55%] flex flex-col justify-center pr-2 sm:pr-6 md:pr-10 pl-4 sm:pl-10 md:pl-16 space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="hidden xs:block">
                    <span className="inline-block px-2.5 py-0.5 sm:py-1 bg-[#7a6eb8] text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider rounded-[6px]">
                      Normal Pads
                    </span>
                  </div>
                  <h3 className="font-sans font-extrabold text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl leading-tight text-[#4a3c8c] tracking-wide">
                    ITCHY, RASHY<br className="hidden sm:inline" /> & UNCOMFORTABLE.
                  </h3>
                  <ul className="space-y-0.5 sm:space-y-1.5 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-[#5c4c9e] min-w-0">
                    <li className="flex items-center gap-1 sm:gap-2 truncate">
                      <span className="text-[#e15252] font-bold">×</span> Causes irritation
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2 truncate">
                      <span className="text-[#e15252] font-bold">×</span> Heat & moisture trap
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2 truncate">
                      <span className="text-[#e15252] font-bold">×</span> Synthetic top layer
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2 truncate">
                      <span className="text-[#e15252] font-bold">×</span> Not breathable
                    </li>
                  </ul>
                </div>

                {/* Sad girl illustration */}
                <div className="w-[42%] sm:w-[45%] h-full flex items-center justify-start pl-2 sm:pl-6 md:pl-10">
                  <img 
                    src="/images/sad_girl_illustration.png" 
                    alt="Sad irritated girl illustration" 
                    className="h-full max-h-[85%] object-contain select-none"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Drag Handle Bar */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white text-slate-500 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:scale-105 active:scale-95 transition">
              <div className="flex gap-1 text-[10px] sm:text-xs font-bold font-mono">
                <span>&lt;</span>
                <span>&gt;</span>
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
