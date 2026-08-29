import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";
import sendEmail from "../utils/mailer.js";

const router = express.Router();

// Initialize Razorpay SDK
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.warn("Could not initialize Razorpay SDK. Operating in simulation mode.", e);
}

// Helper to send order confirmation email
const sendOrderConfirmationEmail = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("user", "email name");
    if (!order) return;

    const email = order.user?.email;
    if (!email || !email.includes("@")) {
      console.warn(`[Mailer] Invalid or missing email address for order ${orderId}. Skipping email confirmation.`);
      return;
    }

    const itemsListHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">
          <p style="margin: 0; font-weight: 600; color: #0f172a;">${item.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Variant: ${item.variant}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">₹${item.price}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-family: Georgia, serif; font-size: 34px; color: #c5a880; margin: 0; font-style: italic; font-weight: bold; letter-spacing: 1px;">niela</h2>
          <div style="width: 32px; height: 2px; background-color: #db2777; margin: 12px auto 8px auto;"></div>
          <h1 style="color: #0f172a; margin: 10px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Order Confirmed!</h1>
          <p style="color: #64748b; font-size: 13.5px; margin-top: 6px; font-weight: 500;">Thank you for shopping with Niela. Your order has been placed successfully.</p>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 14px 0; margin-bottom: 24px; font-size: 13px;">
          <p style="margin: 0; color: #64748b;">Order ID: <strong style="color: #0f172a;">#${order._id.toString().toUpperCase()}</strong></p>
          <p style="margin: 6px 0 0 0; color: #64748b;">Date: <strong style="color: #0f172a;">${new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</strong></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 700; letter-spacing: 0.5px;">Item</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 700; letter-spacing: 0.5px;">Qty</th>
              <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 700; letter-spacing: 0.5px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
            <tr>
              <td colspan="2" style="padding: 16px 12px 12px 12px; font-weight: 700; color: #0f172a; text-align: right; font-size: 14px;">Total Paid:</td>
              <td style="padding: 16px 12px 12px 12px; font-weight: 800; color: #db2777; text-align: right; font-size: 18px;">₹${order.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
          <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Shipping Details</h3>
          <p style="margin: 0; font-size: 13px; color: #334155; font-weight: 600;">${order.shippingDetails.fullName}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">${order.shippingDetails.address}</p>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">${order.shippingDetails.city} - ${order.shippingDetails.zip}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569; font-weight: 500;">Phone: ${order.shippingDetails.phone}</p>
        </div>

        <p style="color: #94a3b8; font-size: 11.5px; text-align: center; margin: 0; font-weight: 500;">If you have any questions, please contact us at support@niela.com.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Niela Care - Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
      text: `Your order #${order._id} has been placed successfully. Total amount: ₹${order.totalAmount}.`,
      html,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
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
    const options = {
      amount: Math.round(amount * 100), // amount in paisa (e.g. 500 INR = 50000 paisa)
      currency: "INR",
      receipt: `receipt_${Math.floor(100000 + Math.random() * 900000)}`,
    };

    if (razorpay) {
      const rpOrder = await razorpay.orders.create(options);
      res.json({
        id: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        simulated: false
      });
    } else {
      // Simulation mode if key is not configured
      res.json({
        id: `rp_sim_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: options.amount,
        currency: "INR",
        simulated: true
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (razorpay_order_id && razorpay_order_id.startsWith("rp_sim_")) {
      // Pass simulated payments immediately
      order.paymentStatus = "Paid";
      order.paymentId = razorpay_payment_id || "sim_pay_12345";
      await order.save();
      // Send confirmation email
      await sendOrderConfirmationEmail(order._id);
      return res.json({ success: true, message: "Payment verified in simulation mode" });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_key_secret")
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
    res.status(500).json({ message: error.message });
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
// @desc    Update order shipment status
router.put("/admin/orders/:id", protect, admin, async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = orderStatus || order.orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
