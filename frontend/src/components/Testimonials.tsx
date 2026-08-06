import React from "react";
import { FiStar } from "react-icons/fi";

const reviews = [
  {
    name: "Aanya Mehta",
    location: "Mumbai",
    product: "Niela Organic Cotton Pads",
    rating: 5,
    quote: "I used to suffer from severe rashes and irritation every single month. Switched to Niela, and it has completely changed my experience. It feels like wearing nothing but soft cloud cotton."
  },
  {
    name: "Rhea Sen",
    location: "Bangalore",
    product: "The Niela Starter Kit",
    rating: 5,
    quote: "The combination of the organic pads and liners in the kit is a lifesaver. The canvas pouch is super cute, and the discreet packaging made me very comfortable ordering it to my hostel address."
  },
  {
    name: "Dr. Kavita Rao",
    location: "Delhi",
    product: "Medical-Grade Menstrual Cup",
    rating: 5,
    quote: "As a gynecologist, I am highly selective of intimate hygiene brands. Niela's use of pure medical-grade silicone and chemical-free cotton makes it an outstanding recommendation for my patients."
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="w-full py-16 sm:py-24 bg-brand-bg/50 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Loved by thousands of menstruators.
          </h2>
          <p className="text-sm sm:text-base text-brand-slate">
            Hear from our community of over 50,000+ happy customers who transitioned to clean, comfortable, plastic-free period care.
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div 
              key={idx}
              className="p-8 bg-white border border-brand-border/60 rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              {/* Stars */}
              <div className="space-y-4">
                <div className="flex text-yellow-500 space-x-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-brand-dark-navy text-sm leading-relaxed font-medium italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-brand-navy text-sm">{review.name}</h4>
                  <p className="text-[10px] text-brand-slate">{review.location} • Verified Buyer</p>
                </div>
                <span className="text-[10px] bg-brand-bg text-brand-pink px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {review.product.split(" ").slice(-1)[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
