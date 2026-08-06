import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";

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
