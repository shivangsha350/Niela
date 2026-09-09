"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";

type Message = { from: "bot" | "user"; text: string };

type Faq = {
  keywords: string[];
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    keywords: ["certified", "certificate", "certification", "quality", "standard"],
    question: "Are your products certified?",
    answer: "Yes — our manufacturing partner holds ISO 9001:2015, BIS (IS 5405:2019), and GMP certifications, plus batch-wise Certificates of Analysis for every product.",
  },
  {
    keywords: ["iso", "9001"],
    question: "Do you have ISO certification?",
    answer: "Yes — ISO 9001:2015 certified for sanitary napkin, under pad, and diaper manufacturing, valid until June 2027.",
  },
  {
    keywords: ["bis", "5405", "government standard"],
    question: "Are your pads BIS certified?",
    answer: "Yes — our pads carry a valid BIS Standard Mark licence under IS 5405:2019, covering all sizes from regular to XXL.",
  },
  {
    keywords: ["gmp", "good manufacturing practice"],
    question: "Are your products made under GMP standards?",
    answer: "Yes — GMP (Good Manufacturing Practice) certified by UNIQ International Certifications Limited, UK.",
  },
  {
    keywords: ["lab test", "tested", "coa", "certificate of analysis", "quality check"],
    question: "Are the pads lab tested?",
    answer: "Every batch is lab-tested for absorbency, leak protection, thickness, tensile strength, and safety — with a Certificate of Analysis issued per batch.",
  },
  {
    keywords: ["made in india", "local", "indian made", "manufactured"],
    question: "Are your products made in India?",
    answer: "Yes — 100% Made in India. All raw materials are sourced from Indian suppliers with zero overseas components.",
  },
  {
    keywords: ["shipping", "delivery", "days", "arrive", "international", "deliver"],
    question: "How long does delivery take?",
    answer: "Domestic orders are processed within 1 business day and delivered in 3–7 business days. Remote areas may take 10–12 working days. We also ship internationally.",
  },
  {
    keywords: ["return", "exchange", "refund", "damaged", "wrong item"],
    question: "Can I return or exchange a product?",
    answer: "Since these are hygiene products, we can't accept returns or exchanges once delivered. If your order arrives damaged, with a broken seal, or wrong, email support@nielacare.com and we'll resolve it.",
  },
  {
    keywords: ["rash", "side effect", "reaction", "guarantee"],
    question: "What if a product causes a rash or side effect?",
    answer: "Our products are designed to be rash-free. If you experience side effects, a refund may be offered under our Rash-Free Guarantee — contact support@nielacare.com.",
  },
  {
    keywords: ["payment", "cod", "cash", "razorpay", "pay"],
    question: "What payment methods do you accept?",
    answer: "We accept prepaid payments via Razorpay and Cash on Delivery (COD) through our logistics partners.",
  },
  {
    keywords: ["privacy", "data", "information", "personal"],
    question: "How is my personal data handled?",
    answer: "We collect only what's needed to process orders and improve your experience — your info is never sold, and payment details aren't stored after a transaction.",
  },
  {
    keywords: ["contact", "email", "phone", "support", "reach", "help", "human", "agent", "talk"],
    question: "How do I contact Niela?",
    answer: "Email us at support@nielacare.com or call +91 80790 37352.",
  },
  {
    keywords: ["company", "who", "owner", "poiya", "about", "niela", "brand"],
    question: "Who owns/runs Niela?",
    answer: "Niela is owned and operated by Poiya Healthcare India Private Limited, a company registered under the Indian Companies Act, 2013.",
  },
  {
    keywords: ["free shipping", "minimum order"],
    question: "Is there free shipping?",
    answer: "Yes — free shipping on all orders above ₹499.",
  },
  {
    keywords: ["biodegradable", "plastic", "eco friendly", "sustainable", "eco"],
    question: "Are your products eco-friendly?",
    answer: "Yes — Niela products are 100% biodegradable and plastic-free.",
  },
  {
    keywords: ["complaint", "issue", "problem", "order issue"],
    question: "What if there's an issue with my order?",
    answer: "Write to support@nielacare.com within 7 business days of delivery and our team will help resolve it.",
  },
  {
    keywords: ["product", "products", "sell", "offer", "range", "catalog"],
    question: "What products do you sell?",
    answer: "We offer sanitary pads, organic pads, menstrual cups, skincare, diapers, and hospital bedsheets — all designed with safety and comfort in mind.",
  },
  {
    keywords: ["cup", "menstrual cup", "cups"],
    question: "Do you sell menstrual cups?",
    answer: "Yes — we offer medical-grade silicone menstrual cups in multiple sizes.",
  },
  {
    keywords: ["skincare", "skin", "cream", "lotion"],
    question: "Do you have skincare products?",
    answer: "Yes — our skincare line is dermatologist-tested and made for sensitive skin.",
  },
  {
    keywords: ["diaper", "diapers", "baby"],
    question: "Do you sell diapers?",
    answer: "Yes — we offer soft, breathable diapers designed for babies' comfort and safety.",
  },
  {
    keywords: ["bedsheet", "bedsheets", "hospital"],
    question: "Do you offer hospital bedsheets?",
    answer: "Yes — we manufacture hygienic, absorbent hospital bedsheets for medical use.",
  },
  {
    keywords: ["size", "sizes", "length", "fit"],
    question: "What pad sizes do you offer?",
    answer: "We offer Regular (240mm), Heavy Flow (280mm), and Overnight (320mm) — all with wings.",
  },
  {
    keywords: ["material", "ingredients", "cotton", "chemical", "toxic"],
    question: "What are the pads made of?",
    answer: "Our pads use a soft cotton top layer, an absorbent core, and a leak-proof base — free from chlorine bleach and fragrance.",
  },
  {
    keywords: ["price", "cost", "much", "rupees"],
    question: "How much do the pads cost?",
    answer: "Pricing varies by pack size — check the product page for current prices and bundle discounts.",
  },
  {
    keywords: ["subscribe", "subscription", "recurring"],
    question: "Do you offer a subscription?",
    answer: "Yes — subscribe on any product page for monthly delivery and a discount on every order.",
  },
  {
    keywords: ["dispose", "disposal", "throw"],
    question: "How do I dispose of the pads?",
    answer: "Wrap the used pad in the disposal sheet provided and dispose of it in a bin — never flush it.",
  },
];

const FALLBACK =
  "I'm not sure about that one — try asking about shipping, returns, sizes, materials, or payment. Or email support@nielacare.com.";

function findAnswer(input: string): string {
  const text = input.toLowerCase();
  let best: Faq | null = null;
  let bestScore = 0;
  for (const faq of FAQS) {
    const score = faq.keywords.reduce(
      (sum, kw) => sum + (text.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return best ? best.answer : FALLBACK;
}

export default function FaqBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! Ask me about shipping, sizes, returns, or anything else about Niela." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const answer = findAnswer(text);
    setMessages((m) => [
      ...m,
      { from: "user", text },
      { from: "bot", text: answer },
    ]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#111a2e] px-4 py-3">
            <div className="flex items-center gap-2">
              <Image src="/images/niela-assistant.png" alt="" width={28} height={28} />
              <span className="text-sm font-medium tracking-wide text-white">
                Niela Assistant
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-snug ${
                    m.from === "user"
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-black/5 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#1a1a1a]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg hover:scale-105 transition-transform overflow-hidden"
        aria-label="Open FAQ chat"
      >
        {open ? (
          <span className="text-xl text-[#1a1a1a]">✕</span>
        ) : (
          <Image src="/images/niela-assistant.png" alt="Niela Assistant" width={56} height={56} />
        )}
      </button>
    </div>
  );
}