import React from "react";
import { FiSliders, FiCalendar, FiPackage, FiSmile } from "react-icons/fi";

const steps = [
  {
    icon: <FiSliders className="w-6 h-6 text-brand-navy" />,
    title: "1. Choose Products",
    description: "Browse our organic cotton pads, panty liners, and medical-grade cups, or customize a subscription box that fits your cycle."
  },
  {
    icon: <FiCalendar className="w-6 h-6 text-brand-navy" />,
    title: "2. Set Frequency",
    description: "Opt for a one-time purchase or subscribe to receive shipments automatically. Pause, modify, or cancel at any time."
  },
  {
    icon: <FiPackage className="w-6 h-6 text-brand-navy" />,
    title: "3. Discreet Delivery",
    description: "Enjoy free shipping above ₹499. All packages are shipped in minimal, sustainable brown cardboard boxes to protect your privacy."
  },
  {
    icon: <FiSmile className="w-6 h-6 text-brand-navy" />,
    title: "4. Flow With Ease",
    description: "Stay fresh, clean, and worry-free. Niela's ultra-absorbent technology gives you leak-proof confidence day or night."
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            The Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            How Niela Works
          </h2>
          <p className="text-sm sm:text-base text-brand-slate">
            Getting premium, non-toxic period care delivered straight to your door has never been simpler.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Connecting line (Desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-[1px] bg-brand-border z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4 relative z-10">
              {/* Icon Bubble */}
              <div className="w-16 h-16 bg-brand-bg border border-brand-border rounded-full flex items-center justify-center shadow-sm hover:border-brand-pink transition duration-300">
                {step.icon}
              </div>
              
              {/* Title & Desc */}
              <h3 className="font-bold text-brand-navy text-lg mt-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
