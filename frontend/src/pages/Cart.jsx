import FabricImage from "../components/FabricImage";
import { availableQuantity, formatFabricQuantity, itemPrice, minimumQuantity } from "../services/catalog";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="display-title theme-text mb-4 text-4xl">Your cart is empty</h2>
        <p className="theme-muted mb-8">
          Browse the catalog and add fabrics when you are ready to request a quote.
        </p>
        <Link to="/products" className="btn-primary relative z-10">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="paper min-h-screen py-14">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <h1 className="display-title theme-text mb-8 text-4xl">Your fabric cart</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="surface flex flex-col items-center gap-5 rounded-3xl border p-4 shadow-sm sm:flex-row"
            >
              <FabricImage
                category={item.category}
                src={item.imageUrl}
                alt={item.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-lg font-semibold theme-text">
                  <Link className="hover:underline" to={`/products/${item._id}`}>
                    {item.name}
                  </Link>
                </h3>
                <p className="theme-muted">
                  {item.material}
                  {item.sample ? " · Sample fabric" : ""}
                </p>
                <p className="mt-2 font-semibold theme-brand">
                  ₹{itemPrice(item).toLocaleString("en-IN")}
                  {item.priceUnit && ` / ${item.priceUnit}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= minimumQuantity(item)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="qty-btn rounded-lg px-3 py-1 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-2">{formatFabricQuantity(item.quantity, item.priceUnit)}</span>
                <button
                  onClick={() => updateQuantity(item._id, Math.max(item.quantity + 1, minimumQuantity(item)))}
                  disabled={Math.max(item.quantity + 1, minimumQuantity(item)) > availableQuantity(item)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="qty-btn rounded-lg px-3 py-1 disabled:opacity-40"
                >
                  +
                </button>
                {item.minimumOrderQuantity && (
                  <p className="w-full text-xs theme-muted">
                    Minimum order: {formatFabricQuantity(minimumQuantity(item), item.priceUnit)}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name}`}
                className="text-red-500 transition hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--fb-border)] pt-6 sm:flex-row">
          <h3 className="text-lg font-medium theme-text">
            Estimated total:{" "}
            <span className="font-semibold theme-brand">₹{totalPrice.toLocaleString()}</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={clearCart} className="btn-secondary">
              Clear cart
            </button>
            <Link to="/checkout" className="btn-primary">
              {cart.some((item) => item.sample) ? "Preview sample quote" : "Request a quote"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
