import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { availableQuantity, itemPrice } from "../services/catalog";
import FabricImage from "./FabricImage";

export default function ProductCard({ product }) {
  const { cart, saved, toggleSaved, addToCart } = useCart();
  const selected = saved.some((item) => item._id === product._id);
  const quantity = cart.find((item) => item._id === product._id)?.quantity || 0;
  const stock = availableQuantity(product);
  const price = itemPrice(product);
  const url = `/products/${product._id}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div className="relative">
        <Link to={url} aria-label={`View ${product.name}`} className="block">
          <FabricImage src={product.imageUrl} category={product.category} alt="" loading="lazy" className="h-52 w-full object-cover" />
        </Link>
        <button
          type="button" aria-pressed={selected} aria-label={`Save ${product.name}`}
          onClick={() => toggleSaved(product)}
          className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-indigo-700 shadow"
        >
          <Heart size={19} fill={selected ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{product.category}{product.sample ? " · Sample" : ""}</p>
          <h3 className="mt-1 text-lg font-semibold"><Link to={url} className="hover:text-indigo-700">{product.name}</Link></h3>
          <p className="text-sm text-gray-600">{product.material}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-indigo-700">₹{price.toLocaleString("en-IN")}</span>
          {price < product.price && <del className="text-sm text-gray-500">₹{product.price.toLocaleString("en-IN")}</del>}
          {product.numReviews > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-gray-700"><Star size={14} className="text-amber-500" /> {product.rating} ({product.numReviews})</span>
          )}
        </div>
        <button
          type="button" disabled={quantity >= stock} onClick={() => addToCart(product)}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:bg-gray-100 disabled:text-gray-600"
        >
          <ShoppingBag size={16} /> {stock === 0 ? "Out of stock" : quantity ? `Add another · ${quantity} in cart` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
