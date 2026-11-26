import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fabricRoutes from "./routes/fabricRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error connecting to MongoDB:", err));

// simple route
app.get("/", (req, res) => {
  res.send("Welcome to Textile Showcase Backend!");
});

app.use("/api/fabrics", fabricRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
