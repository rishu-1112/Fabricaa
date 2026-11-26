import mongoose from "mongoose";

const fabricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Cotton", "Silk", "Wool", "Synthetic", "Other"],
    default: "Other",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Fabric = mongoose.model("Fabric", fabricSchema);
export default Fabric;
