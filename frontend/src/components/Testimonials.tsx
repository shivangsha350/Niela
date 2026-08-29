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
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { FiStar, FiPlay, FiX } from "react-icons/fi";

// interface VideoReview {
//   thumbnail: string;
//   video: string;
//   rating: number;
//   duration: string;
//   caption: string;
//   name: string;
//   location: string;
// }

// // 👉 Add your own videos here.
// // Put files in /public/reviews/ so paths like "/reviews/aanya.mp4" resolve correctly.
// // `video` can be a direct .mp4 path, or a YouTube/Vimeo EMBED url (e.g. "https://www.youtube.com/embed/VIDEO_ID")
// const videoReviews: VideoReview[] = [
//   {
//     thumbnail: "/reviews/aanya-thumb.jpg",
//     video: "/reviews/aanya.mp4",
//     rating: 5,
//     duration: "1:24",
//     caption: "Overnight pads changed my routine",
//     name: "Aanya Mehta",
//     location: "Mumbai"
//   },
//   {
//     thumbnail: "/reviews/rhea-thumb.jpg",
//     video: "/reviews/rhea.mp4",
//     rating: 5,
//     duration: "0:58",
//     caption: "The starter kit is a lifesaver",
//     name: "Rhea Sen",
//     location: "Bangalore"
//   },
//   {
//     thumbnail: "/reviews/kavita-thumb.jpg",
//     video: "/reviews/kavita.mp4",
//     rating: 5,
//     duration: "1:12",
//     caption: "So soft, I forget I'm wearing it",
//     name: "Dr. Kavita Rao",
//     location: "Delhi"
//   },
//   {
//     thumbnail: "/reviews/priya-thumb.jpg",
//     video: "/reviews/priya.mp4",
//     rating: 5,
//     duration: "2:05",
//     caption: "Best starter kit for my hostel life",
//     name: "Priya Nair",
//     location: "Pune"
//   },
//   {
//     thumbnail: "/reviews/simran-thumb.jpg",
//     video: "/reviews/simran.mp4",
//     rating: 5,
//     duration: "1:37",
//     caption: "Eco-friendly AND comfortable",
//     name: "Simran Kaur",
//     location: "Chandigarh"
//   },
//   {
//     thumbnail: "/reviews/megha-thumb.jpg",
//     video: "/reviews/megha.mp4",
//     rating: 5,
//     duration: "1:50",
//     caption: "Doctor recommended, and I love it",
//     name: "Megha Iyer",
//     location: "Chennai"
//   }
// ];

// export default function Testimonials() {
//   const [activeVideo, setActiveVideo] = useState<VideoReview | null>(null);

//   const isEmbed = (src: string) =>
//     src.includes("youtube.com/embed") || src.includes("player.vimeo.com");

//   return (
//     <section id="reviews" className="w-full py-16 sm:py-24 bg-brand-bg/50 border-b border-brand-border/60">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Section Header — unchanged formatting/bg */}
//         <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
//           <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
//             Reviews
//           </span>
//           <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
//             Loved by thousands of menstruators.
//           </h2>
//           <p className="text-sm sm:text-base text-brand-slate">
//             Hear from our community of over 50,000+ happy customers who transitioned to clean, comfortable, plastic-free period care.
//           </p>
//         </div>

//         {/* Video Review Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//           {videoReviews.map((review, idx) => (
//             <button
//               key={idx}
//               onClick={() => setActiveVideo(review)}
//               className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 focus:outline-none"
//             >
//               {/* Thumbnail */}
//               <Image
//                 src={review.thumbnail}
//                 alt={review.name}
//                 fill
//                 sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
//                 className="object-cover transition duration-300 group-hover:scale-105"
//               />

//               {/* Dark gradient overlay for text legibility */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

//               {/* Top row: stars + duration */}
//               <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
//                 <div className="flex text-yellow-400 space-x-0.5">
//                   {[...Array(review.rating)].map((_, i) => (
//                     <FiStar key={i} className="w-3 h-3 fill-current" />
//                   ))}
//                 </div>
//                 <span className="text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded">
//                   {review.duration}
//                 </span>
//               </div>

//               {/* Play button */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center bg-black/20 group-hover:bg-brand-pink group-hover:border-brand-pink transition duration-300">
//                   <FiPlay className="w-5 h-5 text-white ml-0.5 fill-current" />
//                 </span>
//               </div>

//               {/* Caption */}
//               <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium leading-snug text-left line-clamp-2">
//                 {review.caption}
//               </p>
//             </button>
//           ))}
//         </div>

//         {/* Video Modal */}
//         {activeVideo && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
//             onClick={() => setActiveVideo(null)}
//           >
//             <div
//               className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-2xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() => setActiveVideo(null)}
//                 className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
//               >
//                 <FiX className="w-4 h-4" />
//               </button>

//               {isEmbed(activeVideo.video) ? (
//                 <iframe
//                   src={activeVideo.video}
//                   title={activeVideo.name}
//                   className="w-full h-full"
//                   allow="autoplay; encrypted-media"
//                   allowFullScreen
//                 />
//               ) : (
//                 <video
//                   src={activeVideo.video}
//                   controls
//                   autoPlay
//                   className="w-full h-full object-cover"
//                 />
//               )}

//               <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
//                 <p className="font-semibold">{activeVideo.name}</p>
//                 <p className="text-white/70">{activeVideo.location} • Verified Buyer</p>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }
