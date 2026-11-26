import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { rateLimit } from "express-rate-limit";
import Product from "../models/productModel.js";

const router = express.Router();
const limitSubmissions = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

function validateSender(req, res, next) {
  const { name, email } = req.body ?? {};
  if (
    typeof name !== "string" || !name.trim() || name.length > 100 ||
    typeof email !== "string" || email.length > 254 ||
    !/^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/.test(email.trim())
  ) {
    return res.status(400).json({ error: "Enter a valid name and email address." });
  }
  next();
}

async function sendInquiry(req, res, subject, message) {
  const { EMAIL_USER: user, EMAIL_PASS: pass } = process.env;
  if (!user || !pass) {
    return res.status(503).json({ error: "Contact service is temporarily unavailable." });
  }
  const { name, email } = req.body;
  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: user,
      to: user,
      replyTo: email.trim(),
      subject,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message}`,
    });
    res.json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact email delivery failed:", error.code);
    res.status(502).json({ error: "Could not send your message. Please try again." });
  }
}

router.post("/", limitSubmissions, validateSender, async (req, res) => {
  const { message } = req.body;
  if (typeof message !== "string" || !message.trim() || message.length > 2000) {
    return res.status(400).json({ error: "Enter a message of up to 2,000 characters." });
  }
  await sendInquiry(req, res, "Fabricaa website inquiry", message.trim());
});

router.post("/quote", limitSubmissions, validateSender, async (req, res) => {
  const { items, notes = "" } = req.body;
  if (
    typeof notes !== "string" || notes.length > 1000 ||
    !Array.isArray(items) || items.length === 0 || items.length > 50 ||
    items.some((item) => typeof item?.id !== "string" ||
      !mongoose.isObjectIdOrHexString(item.id) ||
      !Number.isSafeInteger(item.quantity) || item.quantity < 1)
  ) {
    return res.status(400).json({ error: "Select 1 to 50 live fabrics with valid quantities and notes of up to 1,000 characters." });
  }

  const ids = items.map(({ id }) => id.toLowerCase());
  if (new Set(ids).size !== ids.length) {
    return res.status(400).json({ error: "Each fabric may appear only once in a quote." });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "The catalog is temporarily unavailable. Try again shortly." });
  }

  let products;
  try {
    products = await Product.find({ _id: { $in: ids } }).select("name stockCount inStock").lean();
  } catch (error) {
    console.error("Quote catalog lookup failed:", error);
    return res.status(503).json({ error: "The catalog is temporarily unavailable. Try again shortly." });
  }

  const productsById = new Map(products.map((product) => [String(product._id), product]));
  const issues = [];
  const lines = [];
  for (const { id, quantity } of items) {
    const product = productsById.get(id.toLowerCase());
    const available = product?.inStock !== false && Number.isSafeInteger(product?.stockCount)
      ? Math.max(0, product.stockCount) : 0;
    if (quantity > available) {
      issues.push({ id, name: product?.name, available });
    } else {
      lines.push(`- ${product.name} × ${quantity}`);
    }
  }
  if (issues.length) {
    return res.status(409).json({ error: "Some fabrics are no longer available in the requested quantity.", issues });
  }

  const message = [lines.join("\n"), notes.trim()].filter(Boolean).join("\n\n");
  await sendInquiry(req, res, "Fabricaa quote request", message);
});

export default router;
