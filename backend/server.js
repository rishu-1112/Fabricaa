import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fabricRoutes from "./routes/fabricRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (!Number.isInteger(proxyHops) || proxyHops < 0) {
  throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");
}
app.set("trust proxy", proxyHops);

if (process.env.FRONTEND_ORIGIN) {
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
}
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Textile Showcase Backend!");
});

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Catalog database is temporarily unavailable" });
  }
  next();
}

app.use("/api/fabrics", requireDatabase, fabricRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", requireDatabase, productRoutes);

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false,
  });
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
} catch {
  console.error("Could not connect to MongoDB. Check MONGO_URI and database availability.");
  process.exitCode = 1;
}
