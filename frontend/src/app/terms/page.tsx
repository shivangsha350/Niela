// import React from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// export default function TermsPage() {
//   return (
//     <>
//       <Header />
//       <main className="flex-grow py-16 bg-brand-bg">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
//           <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy text-center">
//             Terms & Conditions
//           </h1>
//           <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-brand-slate text-sm sm:text-base leading-relaxed">
//             <p className="text-xs text-brand-slate/60">Last updated: July 31, 2026</p>
//             <p>
//               Welcome to Niela E-Commerce! These terms and conditions outline the rules and regulations for the use of Niela&apos;s Website, located at niela.com.
//             </p>
//             <p>
//               By accessing this website, we assume you accept these terms and conditions. Do not continue to use Niela if you do not agree to take all of the terms and conditions stated on this page.
//             </p>
//             <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">Shopping & Payments</h2>
//             <p>
//               All purchases made through Niela are subjected to payment authorization. We utilize the Razorpay gateway to securely handle card and UPI payments. COD orders are pending verification and must be paid in cash at delivery.
//             </p>
//             <h2 className="font-serif text-xl font-bold text-brand-navy mt-4 border-b border-brand-border/40 pb-2">Returns & Hygiene</h2>
//             <p>
//               Due to the personal hygiene nature of sanitary pads, liners, and menstrual cups, we are unable to accept returns on opened packages. If you receive a damaged box or an incorrect order, please contact customer support immediately for a replacement.
//             </p>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Use | Niela",
};

export default function Terms() {
  return (
    <>
      <Header />

      <main className="bg-emerald-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-serif text-slate-800 text-center mb-12">
            Terms of Use
          </h1>

          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              This site is owned and operated by{" "}
              <strong>Poiya Healthcare India Private Limited</strong> for
              your information, education, and communication and purchase.
              Poiya Healthcare India Pvt. Ltd. is a company formed under the
              Indian Companies Act, 2013. Please feel free to browse the
              Site. This Brand offers for sale Sanitary Napkins, Period
              Panties, and Menstrual Cups, and other feminine hygiene
              products under the brand <strong>Niela</strong>. By accessing
              the Site or purchasing the Products, you agree to the terms
              and conditions set out below.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Intellectual Property Rights
            </h2>
            <p>
              All materials on this Site, including but not limited to
              text, images, and illustrations, are protected by copyrights
              owned and controlled by us. They may not be copied,
              reproduced, republished, uploaded, posted, transmitted, or
              distributed in any way. You must not attempt to &quot;pass
              off&quot; any of the material as your own work. Modifying the
              material, or using it for any purpose other than intended, is
              a violation of our copyrights and other proprietary rights.
              Use of any material from this Site on any other website or
              networked computer environment is prohibited.
            </p>
            <p>
              The trademarks, logos, and service marks displayed on the
              Site, including the Niela brand name and logo, are our
              exclusive property. You may not use any of these marks
              without our prior written permission. You can write to us at{" "}
              
                href="mailto:support@nielacare.com"
                className="text-brand-pink hover:underline"
              <a>
                support@nielacare.com
              </a>
              
            </p>
            <p>
              Prices for our products are subject to change without prior
              notice.
            </p>
            <p>
              We reserve the right to modify the contents of this Site at
              any time, but we are under no obligation to update any
              information on it.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Terms of Sale
            </h2>
            <p>
              The products available on the Site are for your personal
              and/or professional use only.
            </p>
            <p>
              We make every effort to ensure that all product details,
              including descriptions and images on this Site, are
              accurate; however, errors may occur. If we discover an error
              in the availability, pricing, or description of a product
              after an order has been placed, we may correct it and inform
              you of the change, and ask you to reconfirm or cancel your
              order.
            </p>
            <p>
              We reserve the right, at any time, to modify or discontinue
              the Service (or any part or content of it) without notice.
              We shall not be liable to you or any third party for any
              modification, price change, suspension, or discontinuance of
              the Service.
            </p>
            <p>
              We make every effort to display product colors and images as
              accurately as possible, but some editing is done for
              presentation purposes, and we cannot guarantee that your
              device&apos;s display will render colors accurately.
            </p>
            <p>
              We reserve the right to limit the quantity of any product or
              service we offer. If we change or cancel an order, we may
              attempt to notify you using the email address, billing
              address, or phone number provided at the time of order. We
              reserve the right to limit or refuse orders that, in our sole
              judgment, appear to be placed by dealers, resellers, or
              distributors.
            </p>
            <p>
              Niela products are designed and researched to provide a
              rash-free experience. If a purchased product causes any side
              effects, a refund may be offered — please refer to our
              separate Rash-Free Guarantee Terms &amp; Conditions for
              details.
            </p>
            <p>
              Please read the specific terms and conditions relating to
              individual products carefully. Always consult your
              physician, gynaecologist, or another qualified healthcare
              provider with any questions about your personal health or a
              medical condition, including diagnosis and treatment for
              your specific needs. Never disregard or delay seeking
              professional medical advice because of something you read on
              this Site.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Termination
            </h2>
            <p>
              This agreement will terminate immediately, without notice, if
              in our sole discretion you fail to comply with any term of
              this Agreement. Upon termination, you must destroy all
              materials obtained from this Site and any copies of them,
              whether made under this Agreement or otherwise. The
              disclaimers of warranties and the limitations of liability,
              damages, and remedies set out in this Agreement will survive
              termination.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Payments
            </h2>
            <p>
              We accept various modes of payment, all processed through
              authorised and secure vendors. Prepaid payments are
              processed through our third-party payment gateway partner,{" "}
              <strong>Razorpay</strong>, and Cash on Delivery (COD)
              payments are accepted through our recognised logistics
              partners. Any charges applicable to a particular payment
              method will be shown to you at checkout.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Delivery / Shipping
            </h2>
            <p>Orders are shipped from our warehouse by reputed courier partners.</p>
            <p>
              Niela delivers within India, as well as internationally.
              Domestic orders are typically processed within 1 business
              day, with delivery expected within 3–7 business days. For
              remote or difficult-to-access locations, delivery may take
              10–12 working days.
            </p>
            <p>
              Someone must be available to sign for the delivery. If you
              are unable to be present, please arrange for an alternative
              recipient such as a family member, colleague, or neighbour.
              Niela is not responsible for goods signed for by an
              alternative person, nor for any damage occurring after
              delivery.
            </p>
            <p>
              For any complaints regarding your order, please write to us
              at{" "}
              
                href="mailto:support@nielacare.com"
                className="text-brand-pink hover:underline"
            <a >
                support@nielacare.com
              </a>{" "}
              within 7 business days of delivery so we can help resolve the
              issue.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">
              Exchange / Returns
            </h2>
            <p>
              At Niela, we strive to give you the best possible product and
              comfort experience. However, since opened or used hygiene
              products cannot be reused, we are unable to accept exchanges
              or returns once a product has been sold or delivered. If you
              receive your order damaged, with a broken seal, or containing
              the wrong item, please write to us at{" "}
              
                href="mailto:support@nielacare.com"
                className="text-brand-pink hover:underline"
             <a>
                support@nielacare.com
              </a>{" "}
              and we will resolve the issue promptly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}