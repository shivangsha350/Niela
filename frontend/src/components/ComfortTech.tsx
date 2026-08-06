import React from "react";

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
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Summary */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
              Our Technology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-brand-navy">
              Engineered for comfort.
            </h2>
            <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
              We redesigned the sanitary pad from scratch. By replacing plastic films and petrochemical gels with organic cotton and plant-based absorbents, we created a pad that is ultra-thin, highly absorbent, and soft as a cloud.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-brand-bg rounded-lg border border-brand-border/40 text-xs font-semibold text-brand-navy">GOTS Organic</span>
              <span className="px-4 py-2 bg-brand-bg rounded-lg border border-brand-border/40 text-xs font-semibold text-brand-navy">Dermatologically Tested</span>
              <span className="px-4 py-2 bg-brand-bg rounded-lg border border-brand-border/40 text-xs font-semibold text-brand-navy">FSC Wood Pulp</span>
            </div>
          </div>

          {/* Layers Breakdown */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {techLayers.map((layer, index) => (
              <div 
                key={index} 
                className="p-6 bg-brand-bg/50 border border-brand-border/40 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-pink/40 hover:bg-white hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="font-serif text-3xl font-bold text-brand-pink/30">{layer.number}</span>
                  <span className="w-1.5 h-1.5 bg-brand-pink rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy text-base leading-tight mb-2">
                    {layer.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
