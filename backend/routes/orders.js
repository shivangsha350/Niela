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

    const email = order.user?.email || order.shippingDetails?.fullName;
    if (!email) return;

    const itemsListHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: 600; color: #0f172a;">${item.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Variant: ${item.variant}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #334155;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">₹${item.price}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #db2777; margin: 0; font-size: 28px; font-family: Georgia, serif;">Order Confirmed!</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Thank you for shopping with Niela. Your order has been placed successfully.</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 16px 0; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Order ID: <strong style="color: #0f172a;">${order._id}</strong></p>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #64748b;">Date: <strong style="color: #0f172a;">${new Date(order.createdAt).toLocaleDateString()}</strong></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 750;">Item</th>
              <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 750;">Qty</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 750;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
            <tr>
              <td colspan="2" style="padding: 16px 12px 12px 12px; font-weight: bold; color: #0f172a; text-align: right; font-size: 16px;">Total Paid:</td>
              <td style="padding: 16px 12px 12px 12px; font-weight: 800; color: #db2777; text-align: right; font-size: 18px;">₹${order.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; tracking-wider: 1px;">Shipping Details</h3>
          <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 600;">${order.shippingDetails.fullName}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">${order.shippingDetails.address}</p>
          <p style="margin: 2px 0 0 0; font-size: 14px; color: #475569;">${order.shippingDetails.city} - ${order.shippingDetails.zip}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">Phone: ${order.shippingDetails.phone}</p>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">If you have any questions, please contact us at support@niela.com.</p>
      </div>
    `;

    await sendEmail({
      to: order.user?.email || email,
      subject: `Niela - Order Confirmation #${order._id.toString().slice(-6)}`,
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
