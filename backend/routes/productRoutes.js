import express from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import validateCatalogFields from "../middleware/validateCatalogFields.js";
import Product from "../models/productModel.js";

const router = express.Router();
const validateFields = validateCatalogFields(["name", "description", "category", "material", "imageUrl", "gallery", "price", "discountPrice", "inStock", "stockCount", "isFeatured"]);

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});

// POST - Create new product (Admin)
router.post("/", requireAdmin, validateFields, async (req, res) => {
  try {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Failed to create product", error: err });
  }
});

// PUT - Update product (Admin)
router.put("/:id", requireAdmin, validateFields, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update product", error: err });
  }
});

// DELETE - Remove product (Admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
});

export default router;
