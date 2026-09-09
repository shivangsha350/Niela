import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to find local Chrome or Edge browser executable
export const getBrowserExecutablePath = () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      `${process.env.LOCALAPPDATA || ""}\\Google\\Chrome\\Application\\chrome.exe`,
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ];
    for (const p of candidates) {
      if (p && fs.existsSync(p)) return p;
    }
  } else {
    const candidates = [
      "/usr/bin/google-chrome-stable",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/snap/bin/chromium",
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
};

// Helper to get Base64 Logo from frontend public directory
const getBase64Logo = () => {
  try {
    const logoPath = path.resolve(__dirname, "../../frontend/public/images/logo.png");
    if (fs.existsSync(logoPath)) {
      const bitmap = fs.readFileSync(logoPath);
      return `data:image/png;base64,${bitmap.toString("base64")}`;
    }
  } catch (err) {
    console.warn("Could not load local logo.png for invoice:", err.message);
  }
  return null;
};

// Helper to resolve local product images to base64 if available
const getBase64ProductImage = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("data:") || imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  try {
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const fullPath = path.resolve(__dirname, "../../frontend/public", cleanPath);
    if (fs.existsSync(fullPath)) {
      const bitmap = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).slice(1) || "png";
      return `data:image/${ext};base64,${bitmap.toString("base64")}`;
    }
  } catch (err) {
    // Silent fallback
  }
  return null;
};

/**
 * Generates high-fidelity HTML matching the reference invoice photo
 */
export const generateInvoiceHtml = (order) => {
  const dateObj = new Date(order.createdAt || Date.now());

  // Format dates
  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedDateTime = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Invoice Number: NIE + YYYYMMDD + -XXXX
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const orderSuffix = order._id ? order._id.toString().slice(-4).toUpperCase() : Math.floor(1000 + Math.random() * 9000);
  const invoiceNo = `NIE${yyyy}${mm}${dd}-${orderSuffix}`;

  const customerName = order.shippingDetails?.fullName || order.user?.name || "Shivang Sharma";
  const customerEmail = order.user?.email || order.shippingDetails?.email || "shivang@example.com";
  const customerPhone = order.shippingDetails?.phone || "+91 98765 43210";
  const addressLine = order.shippingDetails?.address || "123, Green Park";
  const cityZip = `${order.shippingDetails?.city || "New Delhi"}, ${order.shippingDetails?.zip || "110016"}`;

  let paymentMethodDisplay = "Razorpay (UPI)";
  if (order.paymentMethod === "cod") {
    paymentMethodDisplay = "Cash on Delivery (COD)";
  } else if (order.paymentId) {
    paymentMethodDisplay = "Razorpay (UPI / NetBanking)";
  }

  const isPaid = order.paymentStatus === "Paid" || (order.paymentMethod === "razorpay" && order.paymentId);
  const orderStatusDisplay = isPaid ? "Paid" : (order.paymentStatus || "Pending");
  const statusBadgeBg = isPaid ? "#dcfce7" : "#fef3c7";
  const statusBadgeColor = isPaid ? "#16a34a" : "#d97706";

  // Calculations
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalPaid = order.totalAmount || subtotal;
  // If subtotal is greater than totalPaid, difference is discount
  let discount = 0;
  let shipping = 0;
  if (subtotal > totalPaid) {
    discount = subtotal - totalPaid;
    shipping = 0;
  } else if (subtotal < totalPaid) {
    shipping = totalPaid - subtotal;
  }

  const itemsHtml = order.items.map((item, index) => {
    const itemImg = getBase64ProductImage(item.image);
    const itemTotal = item.price * item.quantity;
    
    // Tagline / specs helper based on product type
    let tagline = "Rash Free | 280mm | Ultra Absorbent";
    if (item.name.toLowerCase().includes("wipe")) {
      tagline = "pH Balanced | Gentle Care";
    } else if (item.name.toLowerCase().includes("cup")) {
      tagline = "Medical Grade Silicone | 100% Reusable";
    } else if (item.name.toLowerCase().includes("liner")) {
      tagline = "Ultra-Thin Breathable | Invisible Comfort";
    } else if (item.name.toLowerCase().includes("kit")) {
      tagline = "Complete Organic Care | Eco-Friendly";
    }

    return `
      <tr>
        <td class="col-num">${index + 1}</td>
        <td class="col-product">
          <div class="product-info-wrap">
            ${itemImg ? `<img class="product-thumb" src="${itemImg}" alt="${item.name}" />` : `
              <div class="product-thumb-fallback">🌸</div>
            `}
            <div class="product-meta">
              <div class="product-title">${item.name}</div>
              <div class="product-tagline">${tagline}</div>
              ${item.variant ? `<span class="product-variant-pill">${item.variant}</span>` : ""}
            </div>
          </div>
        </td>
        <td class="col-price">₹${item.price}</td>
        <td class="col-qty">${item.quantity}</td>
        <td class="col-total">₹${itemTotal}</td>
      </tr>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${invoiceNo} - Niela</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      padding: 16mm 18mm 14mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Decorative corner petal watermarks */
    .bg-petal-tr {
      position: absolute;
      top: 0;
      right: 0;
      width: 190px;
      height: 190px;
      pointer-events: none;
      z-index: 0;
    }

    .bg-petal-br {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 200px;
      height: 200px;
      pointer-events: none;
      z-index: 0;
    }

    .bg-petal-bl {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 170px;
      height: 170px;
      pointer-events: none;
      z-index: 0;
    }

    .bg-petal-tl {
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
      pointer-events: none;
      z-index: 0;
    }

    .content-wrap {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Header */
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .niela-brand-title {
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1;
      margin-top: 2px;
      position: relative;
    }

    .niela-brand-title span.reg {
      font-size: 13px;
      font-weight: 700;
      position: absolute;
      top: -2px;
      right: -13px;
      color: #0f172a;
    }

    .niela-tagline {
      font-size: 8.5px;
      letter-spacing: 2.2px;
      font-weight: 700;
      color: #f43f5e;
      text-transform: uppercase;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .tagline-bar {
      width: 18px;
      height: 1.5px;
      background-color: #f43f5e;
      display: inline-block;
    }

    .header-right {
      text-align: right;
      padding-top: 10px;
    }

    .periods-pride-script {
      font-family: 'Caveat', cursive;
      font-size: 34px;
      color: #e11d48;
      font-weight: 700;
      line-height: 1.1;
    }

    .periods-pride-sub {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 4px;
    }

    /* Invoice Meta Block */
    .invoice-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .invoice-title-block {
      max-width: 360px;
    }

    .invoice-main-heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 52px;
      font-weight: 700;
      color: #0a1128;
      line-height: 0.95;
      letter-spacing: -1px;
      margin-bottom: 8px;
    }

    .invoice-sub-thank {
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #f43f5e;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .invoice-sub-message {
      font-size: 11.5px;
      color: #475569;
      line-height: 1.45;
    }

    .meta-box-panel {
      border-left: 2.5px solid #fb7185;
      padding-left: 18px;
      min-width: 250px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      margin-bottom: 5px;
    }

    .meta-item:last-child {
      margin-bottom: 0;
    }

    .meta-item-label {
      color: #475569;
      font-weight: 500;
    }

    .meta-item-value {
      font-weight: 700;
      color: #0f172a;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 9999px;
      font-size: 10.5px;
      font-weight: 700;
    }

    /* Address Cards */
    .address-cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }

    .addr-card {
      border-radius: 16px;
      padding: 14px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .bill-card {
      background-color: #FFF5F7;
      border: 1px solid #FFE4E8;
    }

    .ship-card {
      background-color: #F0F7FF;
      border: 1px solid #E0EDFB;
    }

    .addr-icon-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .bill-icon-bg {
      background-color: #FCE7F3;
      color: #e11d48;
    }

    .ship-icon-bg {
      background-color: #E0F2FE;
      color: #0284c7;
    }

    .addr-content {
      flex: 1;
    }

    .addr-type-tag {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .bill-tag-color { color: #e11d48; }
    .ship-tag-color { color: #0284c7; }

    .addr-person-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .addr-text-lines {
      font-size: 10.5px;
      color: #475569;
      line-height: 1.45;
    }

    /* Product Table */
    .table-container {
      margin-bottom: 18px;
    }

    .prod-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .prod-table thead tr {
      background-color: #FDF2F4;
    }

    .prod-table thead th {
      padding: 8px 12px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #e11d48;
      text-transform: uppercase;
    }

    .prod-table thead th:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      text-align: center;
      width: 32px;
    }

    .prod-table thead th:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      text-align: right;
    }

    .prod-table tbody td {
      padding: 10px 10px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      font-size: 11.5px;
    }

    .col-num {
      text-align: center;
      font-weight: 700;
      color: #0f172a;
      font-size: 13px;
    }

    .col-product {
      text-align: left;
    }

    .product-info-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-thumb {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      flex-shrink: 0;
    }

    .product-thumb-fallback {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background-color: #fce7f3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .product-meta {
      display: flex;
      flex-direction: column;
    }

    .product-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .product-tagline {
      font-size: 10px;
      color: #64748b;
      margin-bottom: 3px;
    }

    .product-variant-pill {
      display: inline-block;
      align-self: flex-start;
      background-color: #FCE7F3;
      color: #e11d48;
      font-size: 9px;
      font-weight: 700;
      padding: 1.5px 7px;
      border-radius: 6px;
    }

    .col-price {
      text-align: right;
      font-weight: 700;
      color: #0f172a;
      font-size: 13px;
      width: 75px;
    }

    .col-qty {
      text-align: center;
      font-weight: 700;
      color: #0f172a;
      font-size: 12.5px;
      width: 55px;
    }

    .col-total {
      text-align: right;
      font-weight: 800;
      color: #0f172a;
      font-size: 13.5px;
      width: 80px;
    }

    /* Thank You & Totals */
    .thankyou-totals-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .thankyou-block {
      max-width: 320px;
    }

    .thankyou-script-title {
      font-family: 'Caveat', cursive;
      font-size: 38px;
      color: #e11d48;
      font-weight: 700;
      line-height: 0.95;
      margin-bottom: 4px;
    }

    .thankyou-bold-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }

    .thankyou-mission-p {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }

    .totals-block {
      min-width: 250px;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .totals-table tr td {
      padding: 4px 0;
    }

    .totals-title-col {
      color: #475569;
      font-weight: 500;
    }

    .totals-amt-col {
      text-align: right;
      font-weight: 700;
      color: #0f172a;
    }

    .totals-amt-col.green-free {
      color: #16a34a;
      font-weight: 800;
    }

    .totals-amt-col.discount-red {
      color: #e11d48;
    }

    .total-paid-row {
      background-color: #FDF2F4;
      border-radius: 8px;
    }

    .total-paid-row td {
      padding: 9px 12px !important;
    }

    .total-paid-text {
      font-size: 15px;
      font-weight: 800;
      color: #e11d48;
    }

    .total-paid-val {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
    }

    .tax-note {
      text-align: right;
      font-size: 9px;
      color: #94a3b8;
      margin-top: 4px;
    }

    /* Trust Badges Bar */
    .trust-badges-bar {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 10px 16px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }

    .trust-badge-col {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .trust-badge-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1.5px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background-color: #ffffff;
    }

    .trust-badge-circle svg {
      width: 17px;
      height: 17px;
      color: #1e293b;
    }

    .trust-badge-name {
      font-size: 10.5px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.25;
    }

    /* Footer */
    .footer-section {
      border-top: 1px solid #f1f5f9;
      padding-top: 14px;
    }

    .footer-main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .footer-brand-side {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .footer-brand-text {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
      display: flex;
      align-items: flex-start;
    }

    .footer-tagline-text {
      font-size: 7.5px;
      letter-spacing: 1.8px;
      font-weight: 700;
      color: #f43f5e;
      text-transform: uppercase;
      margin-top: 3px;
    }

    .footer-contact-side {
      border-left: 1.5px solid #fce7f3;
      padding-left: 16px;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.5;
    }

    .contact-head {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
      margin-bottom: 3px;
    }

    .footer-social-side {
      text-align: right;
      font-size: 10.5px;
      color: #475569;
    }

    .social-head {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
      margin-bottom: 4px;
    }

    .social-icons-wrap {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      margin-bottom: 4px;
    }

    .social-btn {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #0f172a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .social-btn svg {
      width: 11px;
      height: 11px;
      fill: #ffffff;
    }

    .footer-bottom-phrase {
      text-align: center;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #f43f5e;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .phrase-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #f43f5e;
      display: inline-block;
    }
  </style>
</head>
<body>
  <!-- Decorative corner SVGs -->
  <svg class="bg-petal-tr" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 0C130 0 200 70 200 130V0H70Z" fill="#FCE7F3" fill-opacity="0.4"/>
    <path d="M110 0C160 10 200 50 200 100V0H110Z" fill="#FFE4E8" fill-opacity="0.5"/>
    <path d="M140 20C170 30 190 60 190 90C160 70 140 40 140 20Z" fill="#F43F5E" fill-opacity="0.12"/>
  </svg>

  <svg class="bg-petal-br" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 70C200 130 130 200 70 200H200V70Z" fill="#FCE7F3" fill-opacity="0.5"/>
    <path d="M200 110C190 160 150 200 100 200H200V110Z" fill="#FFE4E8" fill-opacity="0.6"/>
    <path d="M180 140C170 170 140 190 110 190C130 160 160 140 180 140Z" fill="#F43F5E" fill-opacity="0.12"/>
  </svg>

  <svg class="bg-petal-bl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 130C70 200 0 200 0 200V130Z" fill="#FFF5F7" fill-opacity="0.5"/>
    <path d="M0 110C50 140 30 200 0 200V110Z" fill="#FCE7F3" fill-opacity="0.4"/>
  </svg>

  <div class="content-wrap">
    <div>
      <!-- Top Header -->
      <div class="header-row">
        <div class="logo-container">
          <!-- Circular Niela Emblem matching photo -->
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#c5a880" stroke-width="2.5" />
            <!-- Stylized N & Petals -->
            <path d="M35 72V30L65 72V30" stroke="#0a192f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M50 20C55 28 65 30 65 30C65 30 58 36 55 42C52 36 45 30 45 30C45 30 48 24 50 20Z" fill="#f43f5e" opacity="0.9"/>
            <path d="M42 36C40 40 38 48 44 54C42 46 45 40 48 38C45 37 43 37 42 36Z" fill="#0284c7" opacity="0.75"/>
            <!-- Sparkle star -->
            <path d="M72 20L73.5 25L78.5 26.5L73.5 28L72 33L70.5 28L65.5 26.5L70.5 25L72 20Z" fill="#f43f5e"/>
          </svg>
          <div class="niela-brand-title">
            niela<span class="reg">®</span>
          </div>
          <div class="niela-tagline">
            <span class="tagline-bar"></span>
            <span>CARE YOU CAN FEEL</span>
            <span class="tagline-bar"></span>
          </div>
        </div>

        <div class="header-right">
          <div class="periods-pride-script">Periods with Pride ♡</div>
          <div class="periods-pride-sub">HEALTHIER GIRLS &bull; BRIGHTER TOMORROWS</div>
        </div>
      </div>

      <!-- Invoice Title & Meta Row -->
      <div class="invoice-meta-row">
        <div class="invoice-title-block">
          <h1 class="invoice-main-heading">Invoice</h1>
          <div class="invoice-sub-thank">THANK YOU FOR YOUR ORDER!</div>
          <p class="invoice-sub-message">
            Your support helps us create a healthier, happier and more confident tomorrow for every girl. ♡
          </p>
        </div>

        <div class="meta-box-panel">
          <div class="meta-item">
            <span class="meta-item-label">Invoice No.</span>
            <span class="meta-item-value">${invoiceNo}</span>
          </div>
          <div class="meta-item">
            <span class="meta-item-label">Order Date</span>
            <span class="meta-item-value">${formattedDateTime}</span>
          </div>
          <div class="meta-item">
            <span class="meta-item-label">Payment Method</span>
            <span class="meta-item-value">${paymentMethodDisplay}</span>
          </div>
          <div class="meta-item">
            <span class="meta-item-label">Order Status</span>
            <span class="status-badge" style="background-color: ${statusBadgeBg}; color: ${statusBadgeColor};">
              ${orderStatusDisplay}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-item-label">Invoice Date</span>
            <span class="meta-item-value">${formattedDate}</span>
          </div>
        </div>
      </div>

      <!-- Address Cards -->
      <div class="address-cards-row">
        <!-- BILL TO -->
        <div class="addr-card bill-card">
          <div class="addr-icon-circle bill-icon-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="addr-content">
            <div class="addr-type-tag bill-tag-color">BILL TO</div>
            <div class="addr-person-name">${customerName}</div>
            <div class="addr-text-lines">
              ${addressLine}<br>
              ${cityZip}, India<br>
              Phone: ${customerPhone}<br>
              Email: ${customerEmail}
            </div>
          </div>
        </div>

        <!-- SHIP TO -->
        <div class="addr-card ship-card">
          <div class="addr-icon-circle ship-icon-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="addr-content">
            <div class="addr-type-tag ship-tag-color">SHIP TO</div>
            <div class="addr-person-name">${customerName}</div>
            <div class="addr-text-lines">
              ${addressLine}<br>
              ${cityZip}, India<br>
              Phone: ${customerPhone}
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="table-container">
        <table class="prod-table">
          <thead>
            <tr>
              <th>#</th>
              <th>PRODUCT</th>
              <th style="text-align: right;">PRICE</th>
              <th style="text-align: center;">QTY</th>
              <th style="text-align: right;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Thank you note & Totals -->
      <div class="thankyou-totals-row">
        <div class="thankyou-block">
          <div class="thankyou-script-title">Thank you ♡</div>
          <div class="thankyou-bold-title">for choosing niela!</div>
          <p class="thankyou-mission-p">
            Together, we're building a world where period care is simple, safe and empowering for every girl.
          </p>
        </div>

        <div class="totals-block">
          <table class="totals-table">
            <tr>
              <td class="totals-title-col">Subtotal</td>
              <td class="totals-amt-col">₹${subtotal}</td>
            </tr>
            <tr>
              <td class="totals-title-col">Shipping</td>
              <td class="totals-amt-col ${shipping === 0 ? 'green-free' : ''}">
                ${shipping === 0 ? "FREE" : `₹${shipping}`}
              </td>
            </tr>
            ${discount > 0 ? `
              <tr>
                <td class="totals-title-col">Discount</td>
                <td class="totals-amt-col discount-red">- ₹${discount}</td>
              </tr>
            ` : ""}
            <tr class="total-paid-row">
              <td class="total-paid-text">Total Paid</td>
              <td class="total-paid-val">₹${totalPaid}</td>
            </tr>
          </table>
          <div class="tax-note">Inclusive of all applicable taxes</div>
        </div>
      </div>
    </div>

    <div>
      <!-- Trust Badges Bar matching photo -->
      <div class="trust-badges-bar">
        <div class="trust-badge-col">
          <div class="trust-badge-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div class="trust-badge-name">Skin<br>Friendly</div>
        </div>

        <div class="trust-badge-col">
          <div class="trust-badge-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
            </svg>
          </div>
          <div class="trust-badge-name">Dermatologically<br>Tested</div>
        </div>

        <div class="trust-badge-col">
          <div class="trust-badge-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div class="trust-badge-name">Safe &<br>Hygienic</div>
        </div>

        <div class="trust-badge-col">
          <div class="trust-badge-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div class="trust-badge-name">For a Happier,<br>Healthier You</div>
        </div>
      </div>

      <!-- Footer Section matching photo -->
      <div class="footer-section">
        <div class="footer-main-row">
          <div class="footer-brand-side">
            <!-- Mini emblem -->
            <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#c5a880" stroke-width="2.5" />
              <path d="M35 72V30L65 72V30" stroke="#0a192f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M50 20C55 28 65 30 65 30C65 30 58 36 55 42C52 36 45 30 45 30C45 30 48 24 50 20Z" fill="#f43f5e"/>
            </svg>
            <div>
              <div class="footer-brand-text">niela<span style="font-size: 11px;">®</span></div>
              <div class="footer-tagline-text">— CARE YOU CAN FEEL —</div>
            </div>
          </div>

          <div class="footer-contact-side">
            <div class="contact-head">Need Help?</div>
            <div>✉ support@nielacare.com</div>
            <div>📞 +91 98765 43210</div>
          </div>

          <div class="footer-social-side">
            <div class="social-head">Follow Us</div>
            <div class="social-icons-wrap">
              <!-- Instagram -->
              <div class="social-btn">
                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <!-- Facebook -->
              <div class="social-btn">
                <svg viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
              </div>
              <!-- YouTube -->
              <div class="social-btn">
                <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <!-- Pinterest -->
              <div class="social-btn">
                <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </div>
            </div>
            <div>www.nielacare.com</div>
          </div>
        </div>

        <div class="footer-bottom-phrase">
          <span>SELF CARE TODAY</span>
          <span class="phrase-dot"></span>
          <span>A BRIGHTER TOMORROW ♡</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generates an A4 PDF Buffer using Puppeteer and headless browser
 */
export const generateInvoicePdf = async (order) => {
  const browserPath = getBrowserExecutablePath();
  if (!browserPath) {
    throw new Error(
      "No supported browser executable (Google Chrome or Microsoft Edge) found on the host system."
    );
  }

  const html = generateInvoiceHtml(order);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to standard A4 ratio
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Set HTML content and wait until network is completely idle (fonts and images loaded)
    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
      preferCSSPageSize: true,
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

export default {
  generateInvoiceHtml,
  generateInvoicePdf,
};
