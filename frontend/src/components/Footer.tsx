import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-dark-navy text-white pt-16 pb-12 border-t border-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0 bg-white/5 p-0.5 border border-white/10">
                <img 
                  src="/images/logo.png" 
                  alt="niela logo" 
                  className="absolute w-[200%] h-[200%] max-w-none -top-[15%] left-1/2 -translate-x-1/2 object-cover brightness-0 invert" 
                />
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight text-white">niela</span>
              <span className="w-1.5 h-1.5 bg-brand-pink rounded-full self-end mb-1.5"></span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium, organic, biodegradable period care and wellness essentials designed to feel like nothing, protecting both your body and the planet.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-pink hover:text-white transition duration-200" aria-label="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-pink hover:text-white transition duration-200" aria-label="Facebook">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-pink hover:text-white transition duration-200" aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-8">
            
            {/* Shop Categories */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-wide text-white uppercase">Shop</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/products?category=pads" className="hover:text-brand-pink transition">Sanitary Pads</Link></li>
                <li><Link href="/products?category=liners" className="hover:text-brand-pink transition">Panty Liners</Link></li>
                <li><Link href="/products?category=cups" className="hover:text-brand-pink transition">Menstrual Cups</Link></li>
                <li><Link href="/products?category=kits" className="hover:text-brand-pink transition">Starter Kits</Link></li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-wide text-white uppercase">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-brand-pink transition">Our Story</Link></li>
                <li><Link href="/#reviews" className="hover:text-brand-pink transition">Reviews</Link></li>
                <li><Link href="/contact" className="hover:text-brand-pink transition">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-bold text-sm tracking-wide text-white uppercase">Legal & Policies</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-brand-pink transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-pink transition">Terms & Conditions</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-brand-pink transition">Shipping Policy</Link></li>
                <li><Link href="/cancellation-and-refund" className="hover:text-brand-pink transition">Cancellation & Refunds</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="text-center md:text-left">
            <p>© {currentYear} Poiya Healthcare India Pvt. Ltd. (Niela). All rights reserved.</p>
            <p className="mt-1.5 text-[11.5px] text-slate-400">
              Designed and maintained by <span className="text-slate-300 font-medium">Biteburst technologies</span> (
              <a href="mailto:bitebursttechnologies@gmail.com" className="hover:text-brand-pink transition underline">
                bitebursttechnologies@gmail.com
              </a>
              )
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-brand-pink transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-pink transition">Terms of Use</Link>
            <Link href="/shipping-policy" className="hover:text-brand-pink transition">Shipping Policy</Link>
            <Link href="/cancellation-and-refund" className="hover:text-brand-pink transition">Refunds & Cancellation</Link>
            <Link href="/contact" className="hover:text-brand-pink transition">Contact Us</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
