import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get local logo path
// Helper to get local logo path
const getLogoPath = () => {
  try {
    const candidates = [
      path.resolve(__dirname, "../assets/logo.png"),
      path.resolve(__dirname, "../../frontend/public/images/logo.png"),
      path.resolve(process.cwd(), "assets/logo.png"),
      path.resolve(process.cwd(), "backend/assets/logo.png"),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } catch {}
  return null;
};

// Helper to get local product image path
const getProductImagePath = (imagePath) => {
  if (!imagePath) return null;
  try {
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const candidates = [
      path.resolve(__dirname, "../../frontend/public", cleanPath),
      path.resolve(process.cwd(), "public", cleanPath),
      path.resolve(process.cwd(), "../frontend/public", cleanPath),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } catch {}
  return null;
};

/**
 * Pure JavaScript PDF Invoice Generator using PDFKit.
 * Runs anywhere without Chrome, Chromium, or OS dependencies.
 * Perfect for Render.com, AWS, Vercel, and constrained cloud containers.
 */
export const generatePdfKitInvoice = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4", // 595.28 x 841.89 points
        margin: 0,
        info: {
          Title: `Invoice - Niela Care`,
          Author: "Niela Care",
        },
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const marginX = 40;

      // -------------------------------------------------------------
      // 1. DECORATIVE BACKGROUND CORNERS
      // -------------------------------------------------------------
      // Top Right soft pink curves
      doc.save();
      doc.circle(pageWidth, 0, 110).fillOpacity(0.35).fill("#FCE7F3");
      doc.circle(pageWidth, 0, 80).fillOpacity(0.45).fill("#FFE4E8");
      doc.circle(pageWidth - 30, 30, 20).fillOpacity(0.2).fill("#F43F5E");

      // Bottom Right curves
      doc.circle(pageWidth, pageHeight, 120).fillOpacity(0.35).fill("#FCE7F3");
      doc.circle(pageWidth, pageHeight, 80).fillOpacity(0.45).fill("#FFE4E8");

      // Bottom Left curves
      doc.circle(0, pageHeight, 100).fillOpacity(0.25).fill("#FFF5F7");
      doc.circle(0, pageHeight, 60).fillOpacity(0.35).fill("#FCE7F3");
      doc.restore();

      // -------------------------------------------------------------
      // 2. TOP HEADER
      // -------------------------------------------------------------
      let currentY = 32;

      // Left: Niela Logo / Emblem
      const logoPath = getLogoPath();
      if (logoPath) {
        try {
          doc.image(logoPath, marginX, currentY, { height: 44 });
        } catch {
          // Fallback text
          doc.font("Times-Bold").fontSize(28).fillColor("#0f172a").text("niela", marginX, currentY);
        }
      } else {
        doc.font("Times-Bold").fontSize(28).fillColor("#0f172a").text("niela", marginX, currentY);
      }

      // Niela Sub-tagline
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#f43f5e")
        .text("—  CARE YOU CAN FEEL  —", marginX, currentY + 46);

      // Right: Periods with Pride
      doc.font("Times-Italic").fontSize(26).fillColor("#e11d48")
        .text("Periods with Pride ♡", pageWidth - marginX - 220, currentY + 4, { align: "right", width: 220 });
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b")
        .text("HEALTHIER GIRLS • BRIGHTER TOMORROWS", pageWidth - marginX - 220, currentY + 36, { align: "right", width: 220 });

      // -------------------------------------------------------------
      // 3. INVOICE TITLE & ORDER METADATA
      // -------------------------------------------------------------
      currentY = 102;

      // Left Title Column
      doc.font("Times-Bold").fontSize(42).fillColor("#0a1128")
        .text("Invoice", marginX, currentY);
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#f43f5e")
        .text("THANK YOU FOR YOUR ORDER!", marginX, currentY + 44);
      doc.font("Helvetica").fontSize(9).fillColor("#64748b")
        .text("Your support helps us create a healthier, happier and more confident tomorrow for every girl.", marginX, currentY + 58, { width: 260, lineGap: 2 });

      // Right Meta Box with vertical pink bar
      const metaBoxX = pageWidth - marginX - 210;
      doc.rect(metaBoxX, currentY + 4, 2.5, 68).fill("#fb7185");

      const dateObj = new Date(order.createdAt || Date.now());
      const formattedDate = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      const formattedDateTime = dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      const orderSuffix = order._id ? order._id.toString().slice(-4).toUpperCase() : "1042";
      const invoiceNo = `NIE${yyyy}${mm}${dd}-${orderSuffix}`;

      const paymentMethodDisplay = order.paymentMethod === "cod" ? "COD" : "Razorpay (UPI)";
      const isPaid = order.paymentStatus === "Paid" || (order.paymentMethod === "razorpay" && order.paymentId);
      const statusText = isPaid ? "Paid" : (order.paymentStatus || "Pending");

      const metaRow = (label, val, yOffset, isBadge = false) => {
        doc.font("Helvetica").fontSize(9).fillColor("#64748b").text(label, metaBoxX + 12, currentY + 4 + yOffset);
        if (isBadge) {
          const badgeBg = isPaid ? "#DCFCE7" : "#FEF3C7";
          const badgeColor = isPaid ? "#16A34A" : "#D97706";
          doc.roundedRect(pageWidth - marginX - 52, currentY + 2 + yOffset, 48, 14, 7).fill(badgeBg);
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(badgeColor).text(val, pageWidth - marginX - 52, currentY + 5 + yOffset, { width: 48, align: "center" });
        } else {
          doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(val, pageWidth - marginX - 140, currentY + 4 + yOffset, { width: 140, align: "right" });
        }
      };

      metaRow("Invoice No.", invoiceNo, 0);
      metaRow("Order Date", formattedDateTime, 14);
      metaRow("Payment Method", paymentMethodDisplay, 28);
      metaRow("Order Status", statusText, 42, true);
      metaRow("Invoice Date", formattedDate, 56);

      // -------------------------------------------------------------
      // 4. ADDRESS CARDS (BILL TO & SHIP TO)
      // -------------------------------------------------------------
      currentY = 192;
      const cardWidth = (pageWidth - (marginX * 2) - 16) / 2;
      const cardHeight = 84;

      const customerName = order.shippingDetails?.fullName || order.user?.name || "Customer";
      const customerPhone = order.shippingDetails?.phone || "+91 98765 43210";
      const customerEmail = order.user?.email || order.shippingDetails?.email || "customer@example.com";
      const addressLine = order.shippingDetails?.address || "Address details";
      const cityZip = `${order.shippingDetails?.city || "New Delhi"} - ${order.shippingDetails?.zip || "110001"}`;

      // Card 1: BILL TO (Soft Pink)
      doc.save();
      doc.roundedRect(marginX, currentY, cardWidth, cardHeight, 12).fillAndStroke("#FFF5F7", "#FFE4E8");
      // Icon circle
      doc.circle(marginX + 20, currentY + 22, 12).fill("#FCE7F3");
      // Vector avatar
      doc.circle(marginX + 20, currentY + 18, 3.5).fill("#e11d48");
      doc.path(`M ${marginX + 14.5} ${currentY + 27} A 5.5 5.5 0 0 1 ${marginX + 25.5} ${currentY + 27} Z`).fill("#e11d48");

      // Details
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#e11d48").text("BILL TO", marginX + 38, currentY + 12);
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#0f172a").text(customerName, marginX + 38, currentY + 23);
      doc.font("Helvetica").fontSize(8.5).fillColor("#475569")
        .text(`${addressLine}\n${cityZip}, India\nPhone: ${customerPhone}  •  Email: ${customerEmail}`, marginX + 38, currentY + 37, { width: cardWidth - 48, lineGap: 1.5 });
      doc.restore();

      // Card 2: SHIP TO (Soft Blue)
      const shipCardX = marginX + cardWidth + 16;
      doc.save();
      doc.roundedRect(shipCardX, currentY, cardWidth, cardHeight, 12).fillAndStroke("#F0F7FF", "#E0EDFB");
      // Icon circle
      doc.circle(shipCardX + 20, currentY + 22, 12).fill("#E0F2FE");
      // Vector pin
      doc.circle(shipCardX + 20, currentY + 19, 3.2).fill("#0284c7");
      doc.path(`M ${shipCardX + 17.5} ${currentY + 20} L ${shipCardX + 20} ${currentY + 27} L ${shipCardX + 22.5} ${currentY + 20} Z`).fill("#0284c7");

      // Details
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#0284c7").text("SHIP TO", shipCardX + 38, currentY + 12);
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#0f172a").text(customerName, shipCardX + 38, currentY + 23);
      doc.font("Helvetica").fontSize(8.5).fillColor("#475569")
        .text(`${addressLine}\n${cityZip}, India\nPhone: ${customerPhone}`, shipCardX + 38, currentY + 37, { width: cardWidth - 48, lineGap: 1.5 });
      doc.restore();

      // -------------------------------------------------------------
      // 5. PRODUCTS TABLE
      // -------------------------------------------------------------
      currentY = 290;
      const tableWidth = pageWidth - (marginX * 2);

      // Table Header row
      doc.save();
      doc.roundedRect(marginX, currentY, tableWidth, 22, 6).fill("#FDF2F4");
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#e11d48");
      doc.text("#", marginX + 12, currentY + 7);
      doc.text("PRODUCT", marginX + 44, currentY + 7);
      doc.text("PRICE", pageWidth - marginX - 170, currentY + 7, { width: 50, align: "right" });
      doc.text("QTY", pageWidth - marginX - 100, currentY + 7, { width: 35, align: "center" });
      doc.text("TOTAL", pageWidth - marginX - 55, currentY + 7, { width: 45, align: "right" });
      doc.restore();

      currentY += 28;

      const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
        { name: "Niela Organic Care Product", price: order.totalAmount || 299, quantity: 1, variant: "Pack" }
      ];

      items.forEach((item, index) => {
        const itemPrice = typeof item.price === "number" ? item.price : 0;
        const itemQty = typeof item.quantity === "number" ? item.quantity : 1;
        const itemTotal = itemPrice * itemQty;
        const itemName = item.name || "Niela Product";

        let tagline = "Rash Free | 280mm | Ultra Absorbent";
        if (itemName.toLowerCase().includes("wipe")) tagline = "pH Balanced | Gentle Care";
        else if (itemName.toLowerCase().includes("cup")) tagline = "Medical Grade Silicone | 100% Reusable";
        else if (itemName.toLowerCase().includes("liner")) tagline = "Ultra-Thin Breathable | Invisible Comfort";

        // Index
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(String(index + 1), marginX + 12, currentY + 12);

        // Product image thumbnail
        const imgPath = getProductImagePath(item.image);
        let textStartX = marginX + 44;
        if (imgPath) {
          try {
            doc.save();
            doc.roundedRect(marginX + 44, currentY + 3, 36, 36, 6).clip();
            doc.image(imgPath, marginX + 44, currentY + 3, { width: 36, height: 36 });
            doc.restore();
            textStartX = marginX + 90;
          } catch {}
        }

        // Product Name & Tagline
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(itemName, textStartX, currentY + 4);
        doc.font("Helvetica").fontSize(8).fillColor("#64748b").text(tagline, textStartX, currentY + 17);
        if (item.variant) {
          const pillW = doc.widthOfString(item.variant, { size: 7.5 }) + 10;
          doc.roundedRect(textStartX, currentY + 28, pillW, 12, 4).fill("#FCE7F3");
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#e11d48").text(item.variant, textStartX, currentY + 30, { width: pillW, align: "center" });
        }

        // Numbers
        doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#0f172a")
          .text(`Rs. ${itemPrice}`, pageWidth - marginX - 170, currentY + 12, { width: 50, align: "right" });
        doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#0f172a")
          .text(String(itemQty), pageWidth - marginX - 100, currentY + 12, { width: 35, align: "center" });
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a")
          .text(`Rs. ${itemTotal}`, pageWidth - marginX - 55, currentY + 12, { width: 45, align: "right" });

        currentY += 46;

        // Row border
        doc.rect(marginX, currentY, tableWidth, 0.5).fill("#f1f5f9");
        currentY += 6;
      });

      // -------------------------------------------------------------
      // 6. THANK YOU & TOTALS SUMMARY
      // -------------------------------------------------------------
      currentY = Math.max(currentY + 14, 520);

      // Left: Thank You message
      doc.font("Times-Italic").fontSize(30).fillColor("#e11d48")
        .text("Thank you ♡", marginX, currentY);
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f172a")
        .text("for choosing niela!", marginX, currentY + 34);
      doc.font("Helvetica").fontSize(9).fillColor("#475569")
        .text("Together, we're building a world where period care is simple, safe and empowering for every girl.", marginX, currentY + 52, { width: 240, lineGap: 2 });

      // Right: Totals
      const totalsBoxX = pageWidth - marginX - 210;
      const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
      const totalAmount = typeof order.totalAmount === "number" ? order.totalAmount : subtotal;
      let shipping = 0;
      let discount = 0;
      if (subtotal > totalAmount) {
        discount = subtotal - totalAmount;
      } else if (subtotal < totalAmount) {
        shipping = totalAmount - subtotal;
      }

      let totalsY = currentY + 4;
      doc.font("Helvetica").fontSize(9.5).fillColor("#475569").text("Subtotal", totalsBoxX, totalsY);
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(`Rs. ${subtotal}`, totalsBoxX, totalsY, { width: 210, align: "right" });

      totalsY += 16;
      doc.font("Helvetica").fontSize(9.5).fillColor("#475569").text("Shipping", totalsBoxX, totalsY);
      if (shipping === 0) {
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#16a34a").text("FREE", totalsBoxX, totalsY, { width: 210, align: "right" });
      } else {
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(`Rs. ${shipping}`, totalsBoxX, totalsY, { width: 210, align: "right" });
      }

      if (discount > 0) {
        totalsY += 16;
        doc.font("Helvetica").fontSize(9.5).fillColor("#475569").text("Discount", totalsBoxX, totalsY);
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#e11d48").text(`- Rs. ${discount}`, totalsBoxX, totalsY, { width: 210, align: "right" });
      }

      totalsY += 18;
      // Total Paid Highlight Box
      doc.roundedRect(totalsBoxX - 8, totalsY - 4, 226, 32, 6).fill("#FDF2F4");
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#e11d48").text("Total Paid", totalsBoxX, totalsY + 6);
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#0f172a").text(`Rs. ${totalAmount}`, totalsBoxX, totalsY + 4, { width: 210, align: "right" });

      totalsY += 34;
      doc.font("Helvetica").fontSize(7.5).fillColor("#94a3b8").text("Inclusive of all applicable taxes", totalsBoxX, totalsY, { width: 210, align: "right" });

      // -------------------------------------------------------------
      // 7. TRUST BADGES BAR
      // -------------------------------------------------------------
      currentY = 675;
      doc.save();
      doc.roundedRect(marginX, currentY, tableWidth, 42, 10).fillAndStroke("#F8FAFC", "#E2E8F0");

      const badgeColW = tableWidth / 4;
      const badges = [
        { label: "Skin Friendly", type: "leaf" },
        { label: "Dermatologically Tested", type: "cross" },
        { label: "Safe & Hygienic", type: "shield" },
        { label: "For a Happier, Healthier You", type: "heart" },
      ];

      badges.forEach((b, idx) => {
        const bx = marginX + (idx * badgeColW);
        doc.circle(bx + 20, currentY + 21, 12).fillAndStroke("#ffffff", "#1e293b");
        
        // Vector icons for badges
        if (b.type === "leaf") {
          doc.path(`M ${bx + 16} ${currentY + 24} Q ${bx + 18} ${currentY + 16} ${bx + 24} ${currentY + 16} Q ${bx + 24} ${currentY + 23} ${bx + 16} ${currentY + 24} Z`).fill("#16a34a");
        } else if (b.type === "cross") {
          doc.rect(bx + 18.5, currentY + 16, 3, 10).fill("#0284c7");
          doc.rect(bx + 15, currentY + 19.5, 10, 3).fill("#0284c7");
        } else if (b.type === "shield") {
          doc.path(`M ${bx + 16} ${currentY + 17} L ${bx + 24} ${currentY + 17} L ${bx + 24} ${currentY + 22} Q ${bx + 20} ${currentY + 26} ${bx + 16} ${currentY + 22} Z`).fill("#e11d48");
        } else {
          doc.path(`M ${bx + 20} ${currentY + 24} L ${bx + 16} ${currentY + 19} A 2.5 2.5 0 0 1 ${bx + 20} ${currentY + 17.5} A 2.5 2.5 0 0 1 ${bx + 24} ${currentY + 19} Z`).fill("#f43f5e");
        }

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#1e293b").text(b.label, bx + 36, currentY + 15, { width: badgeColW - 42 });
      });
      doc.restore();

      // -------------------------------------------------------------
      // 8. FOOTER
      // -------------------------------------------------------------
      currentY = 735;
      doc.rect(marginX, currentY, tableWidth, 0.5).fill("#f1f5f9");
      currentY += 12;

      // Col 1: Brand
      doc.font("Times-Bold").fontSize(18).fillColor("#0f172a").text("niela®", marginX, currentY);
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#f43f5e").text("— CARE YOU CAN FEEL —", marginX, currentY + 20);

      // Col 2: Support
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("Need Help?", marginX + 160, currentY);
      doc.font("Helvetica").fontSize(8).fillColor("#475569")
        .text("support@nielacare.com\n+91 98765 43210", marginX + 160, currentY + 12, { lineGap: 2 });

      // Col 3: Social & Website
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a")
        .text("Follow Us", pageWidth - marginX - 120, currentY, { width: 120, align: "right" });
      doc.font("Helvetica").fontSize(8).fillColor("#475569")
        .text("www.nielacare.com", pageWidth - marginX - 120, currentY + 14, { width: 120, align: "right" });

      // Bottom tagline
      currentY += 46;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#f43f5e")
        .text("SELF CARE TODAY  •  A BRIGHTER TOMORROW ♡", marginX, currentY, { width: tableWidth, align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default generatePdfKitInvoice;
