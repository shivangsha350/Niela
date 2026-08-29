"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";

const techLayers = [
  {
    number: "01",
    name: "Organic Cotton Top-Sheet",
    description: "100% GOTS certified organic cotton that feels velvety soft on your skin. Extremely breathable, hypoallergenic, and completely free of chemicals or synthetic fragrances."
  },
  {
    number: "02",
    name: "Ultra-Absorbent Core",
    description: "Packed with biodegradable natural wood pulp from FSC-certified forests. Instantly locks in moisture and keeps you dry all day long without bulky swelling."
  },
  {
    number: "03",
    name: "Leak-Guard Side Walls",
    description: "Double wings design and protective side barriers keep the flow centered, ensuring complete protection from any accidental side leaks during heavy movements."
  },
  {
    number: "04",
    name: "Breathable Backing Film",
    description: "A corn-starch based biodegradable barrier film that prevents moisture from escaping while allowing heat to pass through, keeping you fresh and sweat-free."
  }
];

export default function ComfortTech() {
  const [activeLayer, setActiveLayer] = useState<number | null>(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const layerStyles = {
    "01": {
      borderColor: "border-brand-pink",
      glowColor: "shadow-brand-pink/20",
      bgColor: "bg-white/95 border-brand-pink/40",
      icon: "☁️",
      shape: "rounded-[40px]"
    },
    "02": {
      borderColor: "border-blue-400",
      glowColor: "shadow-blue-400/20",
      bgColor: "bg-blue-50/90 border-blue-200/50",
      icon: "💧",
      shape: "rounded-[35px]"
    },
    "03": {
      borderColor: "border-purple-400",
      glowColor: "shadow-purple-400/20",
      bgColor: "bg-purple-50/90 border-purple-200/50",
      icon: "🛡️",
      shape: "rounded-[35px]"
    },
    "04": {
      borderColor: "border-green-400",
      glowColor: "shadow-green-400/20",
      bgColor: "bg-green-50/90 border-green-200/50",
      icon: "🍃",
      shape: "rounded-[40px]"
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-brand-border/60 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Summary & Interactive 3D Stack */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between h-full">
            
            {/* Title & Description */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
                Our Technology
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-navy">
                Engineered for comfort.
              </h2>
              <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                We redesigned the sanitary pad from scratch. By replacing plastic films and petrochemical gels with organic cotton and plant-based absorbents, we created a pad that is ultra-thin, highly absorbent, and soft as a cloud.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-brand-bg rounded-lg border border-brand-border/40 text-[10px] sm:text-xs font-semibold text-brand-navy shadow-sm">
                  GOTS Organic
                </span>
                <span className="px-3 py-1 bg-brand-bg rounded-lg border border-brand-border/40 text-[10px] sm:text-xs font-semibold text-brand-navy shadow-sm">
                  Dermatologically Tested
                </span>
                <span className="px-3 py-1 bg-brand-bg rounded-lg border border-brand-border/40 text-[10px] sm:text-xs font-semibold text-brand-navy shadow-sm">
                  FSC Wood Pulp
                </span>
              </div>
            </motion.div>

            {/* Interactive 3D Pad Layer Stack */}
            <motion.div 
              className="relative w-full h-[260px] flex flex-col items-center justify-center overflow-visible select-none mt-4 lg:mt-8"
              variants={itemVariants}
            >
              <div className="relative w-full h-full max-w-[320px]">
                {techLayers.map((layer, index) => {
                  const styleKey = layer.number as "01" | "02" | "03" | "04";
                  const style = layerStyles[styleKey];
                  const isActive = activeLayer === index;
                  const isAnyActive = activeLayer !== null;

                  // Define stack offset coordinates
                  const topOffsets = ["top-[30px]", "top-[80px]", "top-[130px]", "top-[180px]"];
                  const topOffset = topOffsets[index];

                  return (
                    <motion.div
                      key={index}
                      className={`absolute left-1/2 w-60 h-14 sm:w-68 sm:h-16 border border-brand-navy/10 cursor-pointer flex items-center justify-between px-5 shadow-sm rounded-[24px] ${topOffset} ${style.bgColor} ${
                        isActive 
                          ? `border-2 ${style.borderColor} shadow-md ${style.glowColor} z-50` 
                          : isAnyActive 
                            ? "opacity-30 z-20 scale-95 hover:opacity-60" 
                            : "opacity-75 hover:opacity-100 z-30"
                      }`}
                      style={{
                        transform: `translateX(-50%) skewX(-14deg) rotate(-8deg) ${
                          isActive ? "translateY(-24px) scale(1.05)" : ""
                        }`,
                        transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, border-color 0.3s ease, shadow 0.3s ease"
                      }}
                      onMouseEnter={() => setActiveLayer(index)}
                    >
                      <span className="text-lg sm:text-xl">{style.icon}</span>
                      <span className="font-semibold text-brand-navy text-[10px] sm:text-xs tracking-wider uppercase">
                        {layer.name}
                      </span>
                      <span className="font-serif text-sm sm:text-base font-bold text-brand-navy/20">
                        {layer.number}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Animated Layers Cards List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {techLayers.map((layer, index) => {
              const isActive = activeLayer === index;
              const styleKey = layer.number as "01" | "02" | "03" | "04";
              const style = layerStyles[styleKey];

              return (
                <motion.div 
                  key={index} 
                  className={`p-6 border rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 select-none ${
                    isActive 
                      ? `bg-white border-${styleKey === "01" ? "brand-pink" : styleKey === "02" ? "blue-400" : styleKey === "03" ? "purple-400" : "green-400"} shadow-lg scale-[1.02]` 
                      : "bg-brand-bg/40 border-brand-border/40 hover:bg-white hover:border-brand-pink/35 hover:shadow-md"
                  }`}
                  variants={itemVariants}
                  onMouseEnter={() => setActiveLayer(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-serif text-3xl font-bold transition-colors ${
                      isActive 
                        ? styleKey === "01" ? "text-brand-pink" : styleKey === "02" ? "text-blue-500" : styleKey === "03" ? "text-purple-500" : "text-green-500"
                        : "text-brand-pink/20"
                    }`}>
                      {layer.number}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isActive 
                        ? styleKey === "01" ? "bg-brand-pink scale-125" : styleKey === "02" ? "bg-blue-400 scale-125" : styleKey === "03" ? "bg-purple-400 scale-125" : "bg-green-400 scale-125"
                        : "bg-brand-border"
                    }`}></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-navy text-base leading-tight mb-2">
                      {layer.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
