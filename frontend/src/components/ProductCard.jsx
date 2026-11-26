import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const discount =
    product.discountPrice &&
    Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 text-left">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-1">{product.material}</p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-indigo-600 font-semibold">
            ₹{product.discountPrice?.toLocaleString() || product.price.toLocaleString()}
          </p>
          {product.discountPrice && (
            <p className="text-gray-400 line-through text-sm">
              ₹{product.price.toLocaleString()}
            </p>
          )}
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1 mt-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(product.rating) ? "#facc15" : "none"}
              stroke="#facc15"
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numReviews})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAddToCart?.(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
