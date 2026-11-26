import FabricImage from "../components/FabricImage";
import { availableQuantity, itemPrice } from "../services/catalog";
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
        <h1 className="text-3xl font-bold mb-8">Your Fabric Cart</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl shadow-md p-4"
            >
              <FabricImage
                category={item.category}
                src={item.imageUrl}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-800"><Link className="hover:underline" to={`/products/${item._id}`}>{item.name}</Link></h3>
                <p className="text-gray-500">{item.material}{item.sample ? " · Sample fabric" : ""}</p>
                <p className="text-indigo-600 font-semibold mt-2">
                  ₹
                  {itemPrice(item).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= availableQuantity(item)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name}`}
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
            Estimated total ({totalItems} items):{" "}
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
            <Link to="/checkout" className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              {cart.some((item) => item.sample) ? "Preview Sample Quote" : "Request a Quote"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
