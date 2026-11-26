import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [isPaying, setIsPaying] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate payment
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      setIsPaying(false);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 bg-gray-50 min-h-screen text-center"
      >
        <div className="max-w-lg mx-auto bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">
            🎉 Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you, {form.name}. Your fabrics will be shipped soon.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </motion.section>
    );
  }

  if (cart.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-indigo-600 hover:underline"
        >
          Browse Products
        </button>
      </div>
    );

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
        {/* Left - Shipping Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>
          <form onSubmit={handleCheckout} className="space-y-5">
            {["name", "email", "address", "city", "zip", "phone"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ))}
            <button
              type="submit"
              disabled={isPaying}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isPaying
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isPaying ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </motion.div>

        {/* Right - Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="divide-y">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <h4 className="text-gray-800 font-medium">{item.name}</h4>
                  <p className="text-gray-500 text-sm">
                    Qty: {item.quantity} × ₹
                    {(item.discountPrice || item.price).toLocaleString()}
                  </p>
                </div>
                <p className="text-indigo-600 font-semibold">
                  ₹
                  {(
                    (item.discountPrice || item.price) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 text-lg font-semibold">
            <p>Total</p>
            <p className="text-indigo-600">₹{totalPrice.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
