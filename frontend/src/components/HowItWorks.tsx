"use client";

import React from "react";
import { FiSliders, FiCalendar, FiPackage, FiSmile } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";

const steps = [
  {
    icon: <FiSliders className="w-6 h-6 text-brand-navy group-hover:text-brand-pink transition-colors duration-300" />,
    title: "1. Choose Products",
    description: "Browse our organic cotton pads, panty liners, and medical-grade cups, or customize a subscription box that fits your cycle."
  },
  {
    icon: <FiCalendar className="w-6 h-6 text-brand-navy group-hover:text-brand-pink transition-colors duration-300" />,
    title: "2. Set Frequency",
    description: "Opt for a one-time purchase or subscribe to receive shipments automatically. Pause, modify, or cancel at any time."
  },
  {
    icon: <FiPackage className="w-6 h-6 text-brand-navy group-hover:text-brand-pink transition-colors duration-300" />,
    title: "3. Discreet Delivery",
    description: "Enjoy free shipping above ₹499. All packages are shipped in minimal, sustainable brown cardboard boxes to protect your privacy."
  },
  {
    icon: <FiSmile className="w-6 h-6 text-brand-navy group-hover:text-brand-pink transition-colors duration-300" />,
    title: "4. Flow With Ease",
    description: "Stay fresh, clean, and worry-free. Niela's ultra-absorbent technology gives you leak-proof confidence day or night."
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1
    }
  }
} satisfies Variants;

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { 
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeInOut" as const }
  }
} satisfies Variants;

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 }
  }
} satisfies Variants;

export default function HowItWorks() {

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-brand-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            The Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            How Niela Works
          </h2>
          <p className="text-sm sm:text-base text-brand-slate">
            Getting premium, non-toxic period care delivered straight to your door has never been simpler.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          
          {/* Connecting line (Desktop only) */}
          <motion.div 
            className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-brand-border/60 origin-left z-0"
            variants={lineVariants}
          />

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center space-y-4 relative z-10 group cursor-default"
              variants={stepVariants}
            >
              {/* Icon Bubble Container */}
              <div className="relative">
                {/* Outer Glow Pulsing Ring */}
                <div className="absolute inset-[-4px] bg-brand-pink/5 rounded-full blur-[2px] scale-90 group-hover:scale-115 group-hover:bg-brand-pink/15 transition-all duration-500" />
                
                {/* Bubble itself */}
                <div className="relative w-16 h-16 bg-brand-bg border border-brand-border rounded-full flex items-center justify-center shadow-sm group-hover:border-brand-pink group-hover:bg-white group-hover:scale-110 transition duration-300">
                  <div className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
              </div>
              
              {/* Title & Desc */}
              <h3 className="font-bold text-brand-navy text-lg mt-2 group-hover:text-brand-pink transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed px-4 group-hover:text-brand-navy transition-colors duration-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
