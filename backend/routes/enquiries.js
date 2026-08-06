import express from "express";
import Enquiry from "../models/Enquiry.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/enquiries
// @desc    Submit a new contact enquiry
// @access  Public
router.post("/enquiries", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all enquiry fields" });
    }

    const enquiry = new Enquiry({ name, email, message });
    const savedEnquiry = await enquiry.save();
    res.status(201).json(savedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/enquiries
// @desc    Get all enquiries
// @access  Private/Admin
router.get("/admin/enquiries", protect, admin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/enquiries/:id
// @desc    Update enquiry status (Pending/Resolved)
// @access  Private/Admin
router.put("/api/admin/enquiries/:id", protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (enquiry) {
      enquiry.status = status || enquiry.status;
      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404).json({ message: "Enquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
