import React from "react";
import { FiCheckCircle, FiShield, FiHeart } from "react-icons/fi";
import { RiLeafLine } from "react-icons/ri";

const trustItems = [
  {
    icon: <RiLeafLine className="w-6 h-6 text-brand-navy" />,
    title: "100% Certified Organic",
    description: "Premium cotton top-sheet grown without chemical pesticides."
  },
  {
    icon: <FiShield className="w-6 h-6 text-brand-navy" />,
    title: "Leak-Proof Guarantee",
    description: "Multi-layered absorbent core structure locks fluid securely."
  },
  {
    icon: <FiHeart className="w-6 h-6 text-brand-navy" />,
    title: "Hypoallergenic Care",
    description: "Dermatologist-tested to prevent irritation or rashes."
  },
  {
    icon: <FiCheckCircle className="w-6 h-6 text-brand-navy" />,
    title: "Zero Plastics & Chlorine",
    description: "Biodegradable composition that degrades naturally in months."
  }
];

export default function TrustBar() {
  return (
    <section className="w-full bg-white border-y border-brand-border/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-brand-bg p-3 rounded-xl border border-brand-border/40">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy text-sm sm:text-base tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-slate mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
