import express from "express";
import nodemailer from "nodemailer";
import { rateLimit } from "express-rate-limit";

const router = express.Router();
const limitSubmissions = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

router.post("/", limitSubmissions, async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (
    typeof name !== "string" || !name.trim() || name.length > 100 ||
    typeof email !== "string" || email.length > 254 ||
    !/^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/.test(email.trim()) ||
    typeof message !== "string" || !message.trim() || message.length > 2000
  ) {
    return res.status(400).json({
      error: "Enter a valid email, a name of up to 100 characters, and a message of up to 2,000 characters.",
    });
  }

  const { EMAIL_USER: user, EMAIL_PASS: pass } = process.env;
  if (!user || !pass) {
    return res.status(503).json({ error: "Contact service is temporarily unavailable." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: user,
      to: user,
      replyTo: email.trim(),
      subject: "Fabricaa website inquiry",
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });
    res.json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact email delivery failed:", error.code);
    res.status(502).json({ error: "Could not send your message. Please try again." });
  }
});

export default router;
