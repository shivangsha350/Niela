import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FiRefreshCw, 
  FiXCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiShield, 
  FiCreditCard, 
  FiPhoneCall 
} from "react-icons/fi";

export const metadata = {
  title: "Cancellation & Refund Policy | Niela",
  description: "Read Niela's detailed cancellation, return, and refund policies for organic feminine hygiene products.",
};

export default function CancellationAndRefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Header />
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-brand-pink/10 text-brand-pink font-semibold text-xs rounded-full uppercase tracking-wider">
              Customer First Guarantee
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
              Cancellation & Refund Policy
            </h1>
            <p className="text-sm sm:text-base text-brand-slate max-w-xl mx-auto">
              Transparent, hassle-free cancellation and refund procedures designed to ensure complete peace of mind.
            </p>
            <p className="text-xs text-brand-slate/60">Last updated: September 2026</p>
          </div>

          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-brand-slate text-sm sm:text-base leading-relaxed">
            
            {/* Overview */}
            <section className="space-y-4">
              <p>
                At <strong>Niela</strong> (operated by <strong>Poiya Healthcare India Private Limited</strong>), your satisfaction and well-being are at the core of everything we build. We strive to provide an uncompromised experience with our certified organic period care products. This Cancellation, Return & Refund Policy outlines the terms and guidelines applicable when you order from our website.
              </p>
            </section>

            {/* Quick Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiXCircle className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">Easy Cancellation</h4>
                <p className="text-xs text-brand-slate">Cancel anytime before the order is dispatched from our fulfillment center.</p>
              </div>
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiClock className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">5–7 Days Refund</h4>
                <p className="text-xs text-brand-slate">Approved refunds are credited back to your original payment method in 5–7 business days.</p>
              </div>
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiShield className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">100% Replacement</h4>
                <p className="text-xs text-brand-slate">Immediate replacement or full refund if an item arrives damaged or incorrect.</p>
              </div>
            </div>

            {/* 1. Order Cancellation Policy */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiXCircle className="w-5 h-5 text-brand-pink shrink-0" />
                1. Order Cancellation Policy
              </h2>
              <div className="space-y-3">
                <h3 className="font-bold text-brand-navy text-base">A. Cancellation Before Dispatch:</h3>
                <p>
                  You can cancel your order free of cost at any time before it has been dispatched by our warehouse.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>To cancel, email us immediately at <a href="mailto:support@nielacare.com" className="text-brand-pink font-semibold hover:underline">support@nielacare.com</a> or call our helpline at <a href="tel:+918079037352" className="text-brand-pink font-semibold hover:underline">+91 80790 37352</a> with your Order ID.</li>
                  <li>Upon cancellation before dispatch, 100% of your order amount will be initiated for refund immediately.</li>
                </ul>

                <h3 className="font-bold text-brand-navy text-base pt-2">B. Cancellation After Dispatch:</h3>
                <p>
                  Once an order has been handed over to our courier partner and a tracking AWB has been generated, it cannot be cancelled in transit. If you no longer require the items, you may refuse delivery when the courier executive attempts delivery. Once the package returns to our warehouse in unopened condition, a refund will be processed (minus applicable reverse logistics charges).
                </p>
              </div>
            </section>

            {/* 2. Hygiene & Return Policy */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiShield className="w-5 h-5 text-brand-pink shrink-0" />
                2. Hygiene Exemption & Returns
              </h2>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-1">Personal Intimate Hygiene Notice:</strong>
                  Due to the sensitive nature of feminine care, menstrual cups, sanitary napkins, and panty liners, and to comply with health safety regulations, <strong>we cannot accept returns or exchanges for opened, unsealed, or used products</strong>.
                </div>
              </div>
              <p>
                We do, however, offer a complete return/replacement guarantee under the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Damaged or Tampered Package:</strong> If the product packaging was torn, unsealed, or damaged during transit.</li>
                <li><strong>Incorrect Item Received:</strong> If you received an item or variant different from what you ordered.</li>
                <li><strong>Manufacturing Defect or Quality Discrepancy:</strong> If there is a visible defect in product quality or construction.</li>
              </ul>
              <p>
                Please report any such discrepancies within <strong>48 hours of delivery</strong> by writing to <a href="mailto:support@nielacare.com" className="text-brand-pink font-semibold hover:underline">support@nielacare.com</a> along with photos or an unboxing video showing the issue and the shipping label.
              </p>
            </section>

            {/* 3. Refund Process & Timelines */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiCreditCard className="w-5 h-5 text-brand-pink shrink-0" />
                3. Refund Process & Timelines
              </h2>
              <p>
                Once your cancellation request is confirmed or your returned product is inspected at our warehouse:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Refund Initiation:</strong> Our billing team will verify and initiate your refund within <strong>24 to 48 hours</strong> of approval.
                </li>
                <li>
                  <strong>Mode of Refund:</strong> All refunds are processed back directly to the original source payment method (UPI, Debit Card, Credit Card, Netbanking) via our authorized payment gateway partner, <strong>Razorpay</strong>.
                </li>
                <li>
                  <strong>Bank Settlement Timeline:</strong> In accordance with standard banking and payment gateway protocols, the refunded amount will reflect in your bank account or credit card statement within <strong>5 to 7 business days</strong> from the date of refund initiation.
                </li>
                <li>
                  <strong>Notification:</strong> You will receive an automated email notification and Razorpay ARN / Reference ID once the refund has been triggered.
                </li>
              </ul>
            </section>

            {/* 4. Rash-Free & Satisfaction Guarantee */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiCheckCircle className="w-5 h-5 text-brand-pink shrink-0" />
                4. Rash-Free Experience Guarantee
              </h2>
              <p>
                Niela products are researched and dermatologically tested to offer a 100% rash-free, irritation-free experience. If you experience adverse irritation while using our certified organic cotton products, please reach out to our wellness team with details of your experience. We evaluate these cases on a priority basis and may offer a full refund or product alternative under our customer satisfaction pledge.
              </p>
            </section>

            {/* 5. Contact Information */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiPhoneCall className="w-5 h-5 text-brand-pink shrink-0" />
                5. How to Reach Our Grievance & Refund Desk
              </h2>
              <p>
                If you have any questions about refunds, cancellations, or need an update on an ongoing request, our support team is happy to help:
              </p>
              <div className="bg-brand-bg/50 border border-brand-border/40 rounded-2xl p-6 space-y-3">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-32">Company:</span>
                  <span>Poiya Healthcare India Private Limited</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-32">Customer Support:</span>
                  <a href="mailto:support@nielacare.com" className="text-brand-pink font-semibold hover:underline">
                    support@nielacare.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-32">Helpline Phone:</span>
                  <a href="tel:+918079037352" className="text-brand-pink font-semibold hover:underline">
                    +91 80790 37352 (Mon – Sat, 9:00 AM – 7:00 PM IST)
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-brand-navy w-32 shrink-0">Registered Office:</span>
                  <span>Office No. 301, Third & Zero Floor, Trimurti Prime Tower, Niwaru Rd, Jhotwara, Jaipur, Rajasthan - 302012</span>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
