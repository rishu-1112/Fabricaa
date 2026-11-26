import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Cotton", "Silk", "Wool", "Synthetic", "Denim", "Linen", "Other"],
      default: "Other",
    },
    material: {
      type: String,
      required: true,
    },
    gsm: {
      type: Number,
      min: 1,
    },
    width: {
      type: Number,
      min: 1,
    },
    priceUnit: {
      type: String,
      enum: ["metre", "yard", "piece"],
    },
    minimumOrderQuantity: {
      type: Number,
      min: 1,
      validate: Number.isSafeInteger,
    },
    intendedUses: {
      type: [{ type: String, trim: true, minlength: 1, maxlength: 40 }],
      default: undefined,
      validate: { validator: (uses) => uses == null || uses.length <= 8, message: "Use up to eight intended uses." },
    },
    careInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String, // additional product images
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isFinite,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          return value == null || (Number.isFinite(value) && value <= this.price);
        },
        message: "Discount price must be at most the regular price.",
      },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: { validator: Number.isSafeInteger, message: "Stock count must be a whole number." },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
