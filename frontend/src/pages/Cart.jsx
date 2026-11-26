import React from "react";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl shadow-md p-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500">{item.material}</p>
                <p className="text-indigo-600 font-semibold mt-2">
                  ₹
                  {(item.discountPrice || item.price).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Total + Clear */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800">
            Total ({totalItems} items):{" "}
            <span className="text-indigo-600 font-semibold">
              ₹{totalPrice.toLocaleString()}
            </span>
          </h3>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={clearCart}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Clear Cart
            </button>
            <Link to="/checkout">
              <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                Request a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
