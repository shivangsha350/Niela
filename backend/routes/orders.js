import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";
import sendEmail from "../utils/mailer.js";
import { generateInvoicePdf } from "../utils/invoiceGenerator.js";

const router = express.Router();

// Helper to get active Razorpay SDK instance
const getRazorpayInstance = () => {
  dotenv.config();
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
};

// Helper to send order confirmation email with attached branded PDF invoice
const sendOrderConfirmationEmail = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("user", "email name");
    if (!order) return;

    const email = order.user?.email || order.shippingDetails?.email;
    if (!email || !email.includes("@")) {
      console.warn(`[Mailer] Invalid or missing email address for order ${orderId}. Skipping email confirmation.`);
      return;
    }

    const orderSuffix = order._id.toString().slice(-4).toUpperCase();
    const invoiceFileName = `Invoice_NIE${orderSuffix}.pdf`;

    // 1. Generate the branded PDF Invoice
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateInvoicePdf(order);
    } catch (pdfErr) {
      console.error("[Mailer] PDF Invoice generation error:", pdfErr.message);
    }

    // 2. Build email HTML
    const itemsListHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">
          <p style="margin: 0; font-weight: 600; color: #0f172a; font-size: 13.5px;">${item.name}</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #e11d48; font-weight: 600;">Pack: ${item.variant}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a; font-size: 14px;">₹${item.price * item.quantity}</td>
      </tr>
    `).join("");

    const frontendUrl = process.env.FRONTEND_URL || "https://nielacare.com";
    const trackingLink = `${frontendUrl}/orders/${order._id}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #fce7f3; border-radius: 24px; background-color: #ffffff; color: #0f172a;">
        
        <!-- Header Banner -->
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
          <div style="display: inline-block; margin-bottom: 8px;">
            <h2 style="font-family: Georgia, serif; font-size: 32px; color: #0f172a; margin: 0; font-weight: bold; letter-spacing: -0.5px;">niela<span style="font-size: 14px; color: #e11d48;">®</span></h2>
            <div style="font-size: 8px; letter-spacing: 2px; color: #e11d48; font-weight: 800; text-transform: uppercase; margin-top: 2px;">— CARE YOU CAN FEEL —</div>
          </div>
          <div style="margin-top: 14px;">
            <span style="background-color: #fce7f3; color: #e11d48; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 9999px;">Order Placed Successfully</span>
          </div>
          <h1 style="color: #0f172a; margin: 12px 0 0 0; font-size: 24px; font-weight: 800;">Thank You for Your Order! ♡</h1>
          <p style="color: #64748b; font-size: 13.5px; margin: 8px auto 0 auto; max-width: 460px; line-height: 1.5;">
            Together, we're building a world where period care is simple, safe and empowering for every girl.
          </p>
        </div>

        <!-- Attachment Notice -->
        <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 14px; padding: 14px 18px; margin: 20px 0; display: flex; align-items: center;">
          <div style="font-size: 13px; color: #9f1239; line-height: 1.4;">
            📄 <strong>Official Invoice Attached:</strong> Your branded PDF invoice (<code>${invoiceFileName}</code>) is attached to this email for your records and warranty.
          </div>
        </div>

        <!-- Order Metadata -->
        <div style="background-color: #f8fafc; border-radius: 14px; padding: 16px; margin-bottom: 20px; font-size: 12.5px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #64748b; padding: 4px 0;">Order ID:</td>
              <td style="font-weight: 700; color: #0f172a; text-align: right;">#${order._id.toString().toUpperCase()}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 4px 0;">Order Date:</td>
              <td style="font-weight: 600; color: #0f172a; text-align: right;">${new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 4px 0;">Payment Method:</td>
              <td style="font-weight: 600; color: #0f172a; text-align: right;">${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 4px 0;">Payment Status:</td>
              <td style="font-weight: 700; color: ${order.paymentStatus === 'Paid' ? '#16a34a' : '#d97706'}; text-align: right;">${order.paymentStatus || 'Pending'}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <thead>
            <tr style="background-color: #fdf2f4;">
              <th style="padding: 10px 12px; text-align: left; font-size: 10.5px; text-transform: uppercase; color: #e11d48; font-weight: 800; border-top-left-radius: 8px; border-bottom-left-radius: 8px;">Item</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10.5px; text-transform: uppercase; color: #e11d48; font-weight: 800;">Qty</th>
              <th style="padding: 10px 12px; text-align: right; font-size: 10.5px; text-transform: uppercase; color: #e11d48; font-weight: 800; border-top-right-radius: 8px; border-bottom-right-radius: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
            <tr style="background-color: #fff1f2;">
              <td colspan="2" style="padding: 14px 12px; font-weight: 800; color: #e11d48; text-align: right; font-size: 14px;">Total Paid:</td>
              <td style="padding: 14px 12px; font-weight: 800; color: #0f172a; text-align: right; font-size: 18px;">₹${order.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <!-- Shipping Details -->
        <div style="background-color: #f0f7ff; border-radius: 14px; padding: 18px; margin-bottom: 24px; border: 1px solid #e0edfb;">
          <h3 style="margin: 0 0 8px 0; color: #0284c7; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">📍 Shipping Address</h3>
          <p style="margin: 0; font-size: 13px; color: #0f172a; font-weight: 700;">${order.shippingDetails.fullName}</p>
          <p style="margin: 3px 0 0 0; font-size: 12.5px; color: #475569;">${order.shippingDetails.address}</p>
          <p style="margin: 2px 0 0 0; font-size: 12.5px; color: #475569;">${order.shippingDetails.city} - ${order.shippingDetails.zip}, India</p>
          <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #475569; font-weight: 600;">Phone: ${order.shippingDetails.phone}</p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${trackingLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
            Track Your Order Real-Time &rarr;
          </a>
        </div>

        <!-- Footer Note -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 18px; text-align: center; font-size: 11.5px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">Need any assistance? Write to us at <a href="mailto:support@nielacare.com" style="color: #e11d48; text-decoration: none; font-weight: 600;">support@nielacare.com</a> or call <strong>+91 98765 43210</strong>.</p>
          <p style="margin: 0; font-weight: 700; color: #e11d48; letter-spacing: 1px; text-transform: uppercase; font-size: 9px;">SELF CARE TODAY • A BRIGHTER TOMORROW ♡</p>
        </div>
      </div>
    `;

    const mailOptions = {
      to: email,
      subject: `Order Confirmed! Invoice Attached #${orderSuffix} - Niela Care`,
      text: `Your Niela order #${order._id} has been confirmed. Total amount: ₹${order.totalAmount}. Official invoice PDF is attached.`,
      html,
      attachments: pdfBuffer ? [
        {
          filename: invoiceFileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ] : [],
    };

    await sendEmail(mailOptions);
    console.log(`[Mailer] Confirmation email with PDF invoice sent to: ${email}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

// Helper to send order status update email to customer
export const sendOrderStatusUpdateEmail = async (order, newStatus) => {
  try {
    const email = order.user?.email || order.shippingDetails?.email;
    if (!email || !email.includes("@")) {
      console.warn(`[Mailer] Invalid or missing email address for order ${order._id}. Skipping status update email.`);
      return;
    }

    const orderSuffix = order._id.toString().slice(-4).toUpperCase();
    const customerName = order.shippingDetails?.fullName || order.user?.name || "Valued Customer";

    // Status-specific headline and message
    let statusTitle = `Your order is now: ${newStatus}`;
    let statusDescription = `Your order status has been updated to ${newStatus}.`;
    let statusEmoji = "📦";
    let statusColor = "#e11d48";

    if (newStatus === "Processing") {
      statusEmoji = "🌸";
      statusTitle = "Your Order is Being Packed!";
      statusDescription = "We are carefully packaging your organic period care essentials with love and hygiene.";
      statusColor = "#e11d48";
    } else if (newStatus === "Shipped") {
      statusEmoji = "🚚";
      statusTitle = "Your Order is on the Way!";
      statusDescription = "Great news! Your package has been dispatched with our delivery partner and is en route.";
      statusColor = "#0284c7";
    } else if (newStatus === "Delivered") {
      statusEmoji = "🎉";
      statusTitle = "Your Order Has Been Delivered!";
      statusDescription = "Your package has safely arrived. We hope you enjoy gentle, comfortable care with Niela.";
      statusColor = "#16a34a";
    }

    // Step states for visual progress bar
    const isProcessingActive = true;
    const isShippedActive = newStatus === "Shipped" || newStatus === "Delivered";
    const isDeliveredActive = newStatus === "Delivered";

    const frontendUrl = process.env.FRONTEND_URL || "https://nielacare.com";
    const trackingLink = `${frontendUrl}/orders/${order._id}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #fce7f3; border-radius: 24px; background-color: #ffffff; color: #0f172a;">
        
        <!-- Brand Header -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
          <h2 style="font-family: Georgia, serif; font-size: 32px; color: #0f172a; margin: 0; font-weight: bold; letter-spacing: -0.5px;">niela<span style="font-size: 14px; color: #e11d48;">®</span></h2>
          <div style="font-size: 8px; letter-spacing: 2px; color: #e11d48; font-weight: 800; text-transform: uppercase; margin-top: 2px;">— CARE YOU CAN FEEL —</div>
        </div>

        <!-- Status Hero Banner -->
        <div style="text-align: center; padding: 28px 16px 20px 16px;">
          <div style="font-size: 42px; margin-bottom: 10px;">${statusEmoji}</div>
          <span style="background-color: #fdf2f4; color: ${statusColor}; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 16px; border-radius: 9999px;">
            Status Update: ${newStatus}
          </span>
          <h1 style="color: #0f172a; margin: 14px 0 6px 0; font-size: 23px; font-weight: 800;">${statusTitle}</h1>
          <p style="color: #64748b; font-size: 13.5px; margin: 0 auto; max-width: 460px; line-height: 1.5;">
            Hi ${customerName}, ${statusDescription}
          </p>
        </div>

        <!-- 4-Step Progress Tracker -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; text-align: center; border-collapse: collapse;">
            <tr>
              <td style="width: 25%; font-size: 11px; font-weight: 700; color: #16a34a;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #dcfce7; color: #16a34a; line-height: 28px; margin: 0 auto 6px auto; font-size: 13px;">✓</div>
                Placed
              </td>
              <td style="width: 25%; font-size: 11px; font-weight: 700; color: ${isProcessingActive ? '#e11d48' : '#94a3b8'};">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${isProcessingActive ? '#fce7f3' : '#f1f5f9'}; color: ${isProcessingActive ? '#e11d48' : '#94a3b8'}; line-height: 28px; margin: 0 auto 6px auto; font-size: 13px;">
                  ${isShippedActive ? '✓' : '●'}
                </div>
                Processing
              </td>
              <td style="width: 25%; font-size: 11px; font-weight: 700; color: ${isShippedActive ? '#0284c7' : '#94a3b8'};">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${isShippedActive ? '#e0f2fe' : '#f1f5f9'}; color: ${isShippedActive ? '#0284c7' : '#94a3b8'}; line-height: 28px; margin: 0 auto 6px auto; font-size: 13px;">
                  ${isDeliveredActive ? '✓' : isShippedActive ? '●' : '○'}
                </div>
                Shipped
              </td>
              <td style="width: 25%; font-size: 11px; font-weight: 700; color: ${isDeliveredActive ? '#16a34a' : '#94a3b8'};">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${isDeliveredActive ? '#dcfce7' : '#f1f5f9'}; color: ${isDeliveredActive ? '#16a34a' : '#94a3b8'}; line-height: 28px; margin: 0 auto 6px auto; font-size: 13px;">
                  ${isDeliveredActive ? '✓' : '○'}
                </div>
                Delivered
              </td>
            </tr>
          </table>
        </div>

        <!-- Order Snapshot Details -->
        <div style="border: 1px solid #f1f5f9; border-radius: 16px; padding: 18px; margin-bottom: 24px; font-size: 12.5px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #64748b;">Order Reference:</span>
            <strong style="color: #0f172a;">#${order._id.toString().toUpperCase()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #64748b;">Delivery Address:</span>
            <span style="color: #0f172a; text-align: right; max-width: 260px;">${order.shippingDetails.address}, ${order.shippingDetails.city}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Total Amount:</span>
            <strong style="color: #0f172a; font-size: 14px;">₹${order.totalAmount}</strong>
          </div>
        </div>

        <!-- Track Button -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${trackingLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 13.5px; font-weight: 700; letter-spacing: 0.5px;">
            View Tracking Details &rarr;
          </a>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">Questions about your delivery? Contact <a href="mailto:support@nielacare.com" style="color: #e11d48; text-decoration: none;">support@nielacare.com</a>.</p>
          <p style="margin: 0; font-weight: 700; color: #e11d48; letter-spacing: 1px; text-transform: uppercase; font-size: 9px;">SELF CARE TODAY • A BRIGHTER TOMORROW ♡</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Order Update: Your Niela Order #${orderSuffix} is now ${newStatus}`,
      text: `Hi ${customerName}, your Niela order #${order._id} status has been updated to: ${newStatus}.`,
      html,
    });

    console.log(`[Mailer] Order status update (${newStatus}) email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending order status update email:", error);
  }
};

// ==========================================
// CUSTOMER ORDER ENDPOINTS
// ==========================================

// @route   POST /api/orders
// @desc    Create a new order (COD or online setup)
router.post("/orders", protect, async (req, res) => {
  const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items inside order request" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingDetails,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();
    if (paymentMethod === "cod") {
      await sendOrderConfirmationEmail(createdOrder._id);
    }
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get logged in user orders
router.get("/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details & tracking status
router.get("/orders/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: ensure order belongs to requesting user or user is an admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order details" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// RAZORPAY GATEWAY PAYMENTS
// ==========================================

// @route   POST /api/payments/create
// @desc    Generate Razorpay order ticket ID
router.post("/payments/create", protect, async (req, res) => {
  const { amount } = req.body;
  try {
    const razorpay = getRazorpayInstance();
    const key_id = process.env.RAZORPAY_KEY_ID;

    if (!razorpay || !key_id) {
      return res.status(400).json({
        message: "Razorpay keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise (e.g. ₹500 = 50000 paise)
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(100 + Math.random() * 900)}`,
    };

    const rpOrder = await razorpay.orders.create(options);
    res.json({
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: key_id,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    res.status(500).json({ message: error.message || "Failed to create Razorpay order" });
  }
});

// @route   POST /api/payments/verify
// @desc    Cryptographically verify Razorpay signature
router.post("/payments/verify", protect, async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Associated order not found" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Razorpay Key Secret is not configured on server" });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      order.paymentStatus = "Paid";
      order.paymentId = razorpay_payment_id;
      await order.save();
      // Send confirmation email
      await sendOrderConfirmationEmail(order._id);
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature verification failed" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ message: error.message || "Payment verification failed" });
  }
});

// ==========================================
// ADMINISTRATIVE ENDPOINTS
// ==========================================

// @route   GET /api/admin/orders
// @desc    Get all orders
router.get("/admin/orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order shipment status & notify customer via email
router.put("/admin/orders/:id", protect, admin, async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      const oldStatus = order.orderStatus;
      order.orderStatus = orderStatus || order.orderStatus;
      const updatedOrder = await order.save();

      // Send status change notification email if status was changed
      if (orderStatus && orderStatus !== oldStatus) {
        await sendOrderStatusUpdateEmail(updatedOrder, orderStatus);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id/invoice
// @desc    Download / Stream branded invoice PDF
router.get("/orders/:id/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: Only order owner or admin can download invoice
    if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to download this invoice" });
    }

    const pdfBuffer = await generateInvoicePdf(order);
    const orderSuffix = order._id.toString().slice(-4).toUpperCase();
    const fileName = `Invoice_NIE${orderSuffix}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Invoice download error:", error);
    res.status(500).json({ message: "Failed to generate invoice PDF", error: error.message });
  }
});

export default router;
