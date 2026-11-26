import express from "express";
import mongoose from "mongoose";
import requireAdmin from "../middleware/requireAdmin.js";
import validateCatalogFields from "../middleware/validateCatalogFields.js";
import Product from "../models/productModel.js";

const router = express.Router();
const validateFields = validateCatalogFields([
  "name", "description", "category", "material", "gsm", "width", "imageUrl",
  "gallery", "price", "discountPrice", "inStock", "stockCount", "isFeatured",
]);

router.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  next();
});

router.get("/", async (req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

router.post("/", requireAdmin, validateFields, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/:id", requireAdmin, validateFields, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  product.set(req.body);
  // A regular price edit also changes the validity of an existing discount.
  if (product.isModified("price") && product.discountPrice != null) {
    product.markModified("discountPrice");
  }
  res.json(await product.save());
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json({ message: "Product deleted successfully." });
});

router.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Invalid product data.",
      fields: Object.keys(error.errors),
    });
  }
  if (error instanceof mongoose.Error.VersionError) {
    return res.status(409).json({ message: "The product changed. Reload it and try again." });
  }
  console.error("Catalog request failed:", error);
  res.status(500).json({ message: "Could not process the catalog request." });
});

export default router;
