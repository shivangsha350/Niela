import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FiTruck, 
  FiClock, 
  FiDollarSign, 
  FiPackage, 
  FiMapPin, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiPhoneCall 
} from "react-icons/fi";

export const metadata = {
  title: "Shipping & Delivery Policy | Niela",
  description: "Learn about Niela's shipping timelines, delivery partners, and shipping charges across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Header />
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-brand-pink/10 text-brand-pink font-semibold text-xs rounded-full uppercase tracking-wider">
              Fast & Discreet Delivery
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
              Shipping & Delivery Policy
            </h1>
            <p className="text-sm sm:text-base text-brand-slate max-w-xl mx-auto">
              We are committed to delivering your organic period care essentials safely, swiftly, and discreetly right to your doorstep.
            </p>
            <p className="text-xs text-brand-slate/60">Last updated: September 2026</p>
          </div>

          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-brand-slate text-sm sm:text-base leading-relaxed">
            
            {/* 1. Overview */}
            <section className="space-y-4">
              <p>
                At <strong>Niela</strong> (operated by <strong>Poiya Healthcare India Private Limited</strong>), we understand the critical importance of receiving your personal hygiene products on time. We partner with India&apos;s leading logistics providers to ensure reliable, high-priority delivery across all serviceable pin codes nationwide.
              </p>
            </section>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiClock className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">Dispatch Time</h4>
                <p className="text-xs text-brand-slate">Orders are dispatched within 24 to 48 hours on business days.</p>
              </div>
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiTruck className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">Delivery Window</h4>
                <p className="text-xs text-brand-slate">3 to 7 business days for domestic orders across India.</p>
              </div>
              <div className="p-5 bg-brand-bg/50 border border-brand-border/40 rounded-2xl space-y-2 text-center sm:text-left">
                <FiDollarSign className="w-6 h-6 text-brand-pink mx-auto sm:mx-0" />
                <h4 className="font-bold text-brand-navy text-sm">Free Shipping</h4>
                <p className="text-xs text-brand-slate">Enjoy Free Delivery on all prepaid orders of ₹499 and above.</p>
              </div>
            </div>

            {/* 2. Order Processing & Dispatch */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiClock className="w-5 h-5 text-brand-pink shrink-0" />
                1. Processing & Dispatch Timeline
              </h2>
              <p>
                All orders placed on our website are processed and prepared for shipping from our central fulfillment center in Jaipur, Rajasthan.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Orders received before 2:00 PM IST (Monday through Saturday) are typically packed and handed over to courier partners within 24 hours.</li>
                <li>Orders placed on Sundays or National Public Holidays will be processed on the following working business day.</li>
                <li>During peak festival seasons or promotional sales, dispatch may take up to 48 hours.</li>
              </ul>
            </section>

            {/* 3. Shipping Charges */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiDollarSign className="w-5 h-5 text-brand-pink shrink-0" />
                2. Shipping Rates & Thresholds
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border border-brand-border/40 rounded-2xl overflow-hidden">
                  <thead className="bg-brand-bg/80 text-brand-navy font-bold">
                    <tr>
                      <th className="p-3.5 border-b border-brand-border/40">Order Value</th>
                      <th className="p-3.5 border-b border-brand-border/40">Shipping Charge</th>
                      <th className="p-3.5 border-b border-brand-border/40">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40">
                    <tr>
                      <td className="p-3.5 font-medium text-brand-navy">₹499 and above</td>
                      <td className="p-3.5 text-emerald-600 font-bold">FREE Shipping</td>
                      <td className="p-3.5">3 – 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-brand-navy">Below ₹499</td>
                      <td className="p-3.5 text-brand-navy font-semibold">₹49 Flat Rate</td>
                      <td className="p-3.5">3 – 7 Business Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Estimated Delivery Times */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiTruck className="w-5 h-5 text-brand-pink shrink-0" />
                3. Estimated Delivery Times
              </h2>
              <p>
                Delivery timelines depend on your geographic location and local courier hub operations:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad):</strong> 2 to 4 business days.</li>
                <li><strong>Tier 2 & Tier 3 Cities / State Capitals:</strong> 3 to 6 business days.</li>
                <li><strong>Remote Locations & North-Eastern States / J&K:</strong> 6 to 10 business days.</li>
              </ul>
            </section>

            {/* 5. Discreet Packaging */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiPackage className="w-5 h-5 text-brand-pink shrink-0" />
                4. Discreet & Eco-Friendly Packaging
              </h2>
              <p>
                Your privacy and comfort are our highest priority. All Niela orders are packaged in 100% recyclable, tamper-evident, unmarked boxes or mailers. There are no product descriptions or brand markings on the outer shipping label so you can have your essentials delivered anywhere &mdash; home, hostel, or workplace &mdash; with complete peace of mind.
              </p>
            </section>

            {/* 6. Order Tracking */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiCheckCircle className="w-5 h-5 text-brand-pink shrink-0" />
                5. Real-Time Order Tracking
              </h2>
              <p>
                As soon as your order is dispatched, you will receive an email confirmation containing your courier partner name, AWB tracking number, and a direct tracking link. You can also track your shipment anytime through the <strong>Orders</strong> section in your Niela account.
              </p>
            </section>

            {/* 7. Damaged Shipments & Missing Items */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-brand-pink shrink-0" />
                6. Damaged Shipments or Missing Items
              </h2>
              <p>
                In the unlikely event that your package arrives with an opened seal, visible external damage, or missing items:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Please <strong>refuse to accept</strong> the package if the outer seal is visibly broken or tampered with.</li>
                <li>If discovered after delivery, report it to our customer care team at <a href="mailto:support@nielacare.com" className="text-brand-pink font-semibold hover:underline">support@nielacare.com</a> within <strong>48 hours</strong> of delivery along with photos of the outer box and invoice.</li>
                <li>We will arrange a prompt priority replacement or 100% refund at zero additional cost to you.</li>
              </ul>
            </section>

            {/* 8. Contact Information */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy border-b border-brand-border/40 pb-3 flex items-center gap-3">
                <FiPhoneCall className="w-5 h-5 text-brand-pink shrink-0" />
                7. Shipping Support & Queries
              </h2>
              <p>
                For any questions regarding shipping, delays, or changing your delivery address before dispatch, please contact our support team:
              </p>
              <div className="bg-brand-bg/50 border border-brand-border/40 rounded-2xl p-6 space-y-3">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-28">Company:</span>
                  <span>Poiya Healthcare India Private Limited</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-28">Email:</span>
                  <a href="mailto:support@nielacare.com" className="text-brand-pink font-semibold hover:underline">
                    support@nielacare.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy w-28">Phone:</span>
                  <a href="tel:+918079037352" className="text-brand-pink font-semibold hover:underline">
                    +91 80790 37352 (Mon – Sat, 9:00 AM – 7:00 PM IST)
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-brand-navy w-28 shrink-0">Address:</span>
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
