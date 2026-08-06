import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { name: "Sanitary Pads", slug: "pads", description: "Organic cotton day and night pads." },
  { name: "Panty Liners", slug: "liners", description: "Ultra-thin everyday breathable panty liners." },
  { name: "Menstrual Cups", slug: "cups", description: "Reusable medical-grade silicone cups." },
  { name: "Starter Kits", slug: "kits", description: "Eco-friendly starter packs." }
];

const products = [
  {
    name: "Niela Daily Panty Liners",
    description: "Experience everyday freshness with our ultra-thin, highly breathable, 100% organic cotton panty liners. Designed to feel like nothing, but protect like everything.",
    price: 299,
    originalPrice: 349,
    images: ["/images/panty_liners.png"],
    category: "liners",
    stock: 50,
    rating: 4.8,
    reviewsCount: 142,
    features: [
      "100% Certified Organic Cotton Top Sheet",
      "Ultra-thin (1mm) design for invisible comfort",
      "Highly breathable sheet prevents moisture build-up",
      "Hypoallergenic & free from toxins, chlorine, or synthetic dyes"
    ],
    variants: ["24 Pack", "48 Pack"]
  },
  {
    name: "Niela Organic Cotton Pads",
    description: "Engineered for maximum comfort and ultimate leak protection. Our organic cotton pads feature an ultra-absorbent core that locks away heavy flows while staying soft on your skin.",
    price: 349,
    originalPrice: 399,
    images: ["/images/regular_pads.png"],
    category: "pads",
    stock: 75,
    rating: 4.9,
    reviewsCount: 218,
    features: [
      "100% Certified Organic Cotton Top Sheet",
      "Super absorbent wood-pulp core locks in moisture",
      "Double wings and contoured fit prevent side leakages",
      "Dermatologically tested and approved for sensitive skin"
    ],
    variants: ["Regular (14 Pack)", "Super (12 Pack)", "Super Plus (10 Pack)"]
  },
  {
    name: "The Niela Starter Kit",
    description: "The complete eco-friendly wellness set. Perfect for teenagers or anyone transitioning to clean period care, including organic pads, liners, and a premium cup.",
    price: 699,
    originalPrice: 799,
    images: ["/images/starter_kit.png"],
    category: "kits",
    stock: 30,
    rating: 5.0,
    reviewsCount: 89,
    features: [
      "1 Pack of Regular Pads (14 count)",
      "1 Pack of Panty Liners (24 count)",
      "1 Medical-Grade Menstrual Cup (Size Small)",
      "1 Reusable organic cotton drawstring canvas bag"
    ],
    variants: ["Small Cup Kit", "Medium Cup Kit", "Large Cup Kit"]
  },
  {
    name: "Niela Medical-Grade Menstrual Cup",
    description: "A comfortable, sustainable alternative that offers up to 12 hours of leak-proof protection. Reusable, eco-friendly, and engineered from soft, medical-grade silicone.",
    price: 599,
    originalPrice: 699,
    images: ["/images/menstrual_cup.png"],
    category: "cups",
    stock: 40,
    rating: 4.7,
    reviewsCount: 65,
    features: [
      "100% Medical Grade USP Class VI Liquid Silicone",
      "Up to 12 hours of continuous, worry-free wear",
      "Flexible and velvety-smooth for a seamless, comfortable fit",
      "Eco-friendly choice reusable for up to 5-10 years"
    ],
    variants: ["Small (Pre-childbirth)", "Large (Post-childbirth)"]
  }
];

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/niela_db";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing products and categories.");

    // Seed Categories
    await Category.insertMany(categories);
    console.log("Seeded default categories.");

    // Seed Products
    await Product.insertMany(products);
    console.log("Seeded default products.");

    console.log("Seeding complete successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
