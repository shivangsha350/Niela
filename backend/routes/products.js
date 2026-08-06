import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC CATALOG ENDPOINTS
// ==========================================

// @route   GET /api/products
// @desc    Get all products (supports category filter)
router.get("/products", async (req, res) => {
  const { category } = req.query;
  try {
    let query = {};
    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/categories
// @desc    Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ADMIN CRUDS (Guarded)
// ==========================================

// @route   POST /api/products
// @desc    Create a product
router.post("/products", protect, admin, async (req, res) => {
  const { name, description, price, originalPrice, images, category, stock, features, variants } = req.body;
  try {
    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      features,
      variants,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
router.put("/products/:id", protect, admin, async (req, res) => {
  const { name, description, price, originalPrice, images, category, stock, features, variants } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.features = features || product.features;
      product.variants = variants || product.variants;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create a category
router.post("/categories", protect, admin, async (req, res) => {
  const { name, slug, description } = req.body;
  try {
    const category = new Category({ name, slug, description });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
router.delete("/categories/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: "Category removed successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
