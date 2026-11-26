import { apiUrl } from "../services/api";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";


export default function ProductDetails() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(apiUrl(`/products/${id}`));
        setProduct(res.data);
        setMainImage(res.data.imageUrl);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-20 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8"
        >
          <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Image Section */}
          <div className="space-y-4">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[450px] object-cover rounded-xl shadow-md"
            />
            {/* Thumbnail gallery */}
            <div className="flex gap-4 justify-center">
              {[product.imageUrl, ...(product.gallery || [])].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`gallery-${i}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === img ? "border-indigo-600" : "border-transparent"
                  } hover:border-indigo-300 transition`}
                />
              ))}
            </div>
          </div>

          {/* Right - Details Section */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 mb-3">{product.material}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.rating) ? "#facc15" : "none"}
                  stroke="#facc15"
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({product.numReviews} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-indigo-600">
                ₹{product.discountPrice?.toLocaleString() || product.price.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock Info */}
            <p
              className={`mb-6 font-medium ${
                product.stockCount > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stockCount > 0
                ? `In Stock (${product.stockCount} available)`
                : "Out of Stock"}
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(product)}
              disabled={product.stockCount === 0}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                product.stockCount > 0
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={18} />
              {product.stockCount > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
