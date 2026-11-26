import mongoose from "mongoose";
import Fabric from "../models/fabric.js";

// Prefer an environment variable but fall back to localhost for convenience.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/textileDB";
console.log("🌱 Seeding fabric data using URI:", MONGO_URI);


const fabrics = [
  {
    name: "Royal Cotton Breeze",
    material: "Pure Cotton",
    description:
      "Lightweight and breathable cotton fabric perfect for summer wear and everyday comfort.",
    imageUrl:
      "https://images.jdmagicbox.com/quickquotes/images_main/cotton-dark-grey-check-shirting-fabric-xw1zmgen.jpg",
    videoUrl: "https://www.youtube.com/watch?v=7WugkXyUJZw",
    category: "Cotton",
  },
  {
    name: "Majestic Silk Shine",
    material: "Mulberry Silk",
    description:
      "Elegant silk with a glossy texture and smooth touch, ideal for sarees and designer dresses.",
    imageUrl:
      "https://5.imimg.com/data5/SELLER/Default/2021/6/SH/YI/EZ/31575462/plain-mulberry-silk-fabric-500x500.jpg",
    videoUrl: "https://www.youtube.com/watch?v=FlPkkFEn6xM",
    category: "Silk",
  },
  {
    name: "Himalayan Wool Warmth",
    material: "Merino Wool",
    description:
      "Soft, premium wool sourced from the Himalayas, perfect for winter coats and shawls.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSCTRhJCx3EuudDM7n-JvLrc4beR_ZkG7C1A&s",
    videoUrl: "https://www.youtube.com/watch?v=tC4bHSkf8UY",
    category: "Wool",
  },
  {
    name: "Classic Denim Blue",
    material: "Denim Cotton Blend",
    description:
      "Durable denim fabric with a stylish blue finish, ideal for jeans and jackets.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR93nzdrL3nA59EqWMoP3rkVpjf_oX_FZboHQ&s",
    videoUrl: "https://www.youtube.com/watch?v=bvF_sYltZy8",
    category: "Cotton",
  },
  {
    name: "Velvet Luxe Touch",
    material: "Velvet Polyester",
    description:
      "Rich and luxurious velvet fabric with a soft texture, ideal for upholstery and ethnic wear.",
    imageUrl:
      "https://italianartisan.com/wp-content/uploads/2025/05/velvet-value-1-1024x683.webp",
    videoUrl: "https://www.youtube.com/watch?v=lLb7LvvCSjs",
    category: "Synthetic",
  },
  {
    name: "Organza Dream",
    material: "Silk Blend Organza",
    description:
      "Lightweight and sheer organza with subtle shimmer, widely used for sarees and gowns.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIBg6iAMC5eqR1xT1P9rlgFHDf2U4SJAhnCg&s",
    videoUrl: "https://www.youtube.com/watch?v=lPiOC0O1Oxo",
    category: "Silk",
  },
  {
    name: "Cashmere Cloud",
    material: "Pure Cashmere",
    description:
      "Ultra-soft and premium-grade cashmere known for its warmth and luxurious texture.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQASjgwrgxLwYFyPnGBDc3XoSkfsjSxAPSCjA&s",
    videoUrl: "https://www.youtube.com/watch?v=pE93LkLZ4P0",
    category: "Wool",
  },
  {
    name: "Polyester Spark",
    material: "Polyester Blend",
    description:
      "Strong and wrinkle-resistant fabric suitable for casual and formal wear.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIPR0G1ysPIEiwGapbPuvopTYw5pY3o78Tbg&s",
    videoUrl: "https://www.youtube.com/watch?v=3kS3Y5AAKCE",
    category: "Synthetic",
  },
  {
    name: "Linen Essence",
    material: "Pure Linen",
    description:
      "Natural and elegant linen fabric offering both comfort and durability for all seasons.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZktvfSPPWnxa9nyFDKr9E16G4G5utKMuLA&s",
    videoUrl: "https://www.youtube.com/watch?v=7Y3GAVbc2qM",
    category: "Cotton",
  },
  {
    name: "Satin Glow",
    material: "Satin Silk",
    description:
      "Smooth and shiny satin fabric with a lustrous finish, perfect for evening gowns and drapes.",
    imageUrl:
      "https://fabmyntra.com/cdn/shop/products/1562_2.jpg?v=1672818923&width=800",
    videoUrl: "https://www.youtube.com/watch?v=bt2CNJvD9yY",
    category: "Silk",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected — starting seed");

    await Fabric.deleteMany({});
    await Fabric.insertMany(fabrics);
    console.log("🌸 Fabric data seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

seedDB();
