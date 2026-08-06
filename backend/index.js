import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import enquiryRoutes from "./routes/enquiries.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Integration
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", enquiryRoutes);

// Root Ping Health Check
app.get("/", (req, res) => {
  res.json({ message: "Niela E-Commerce API is running smoothly..." });
});

// Database Connection & Server Startup
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/niela_db";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB database successfully.");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failure:", err);
  });
