import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { availableQuantity, formatFabricQuantity, itemPrice, minimumQuantity } from "../services/catalog";
import FabricImage from "./FabricImage";

export default function ProductCard({ product }) {
  const { cart, saved, comparison, toggleSaved, toggleComparison, addToCart } = useCart();
  const selected = saved.some((item) => item._id === product._id);
  const quantity = cart.find((item) => item._id === product._id)?.quantity || 0;
  const stock = availableQuantity(product);
  const minimum = minimumQuantity(product);
  const compared = comparison.some((item) => item._id === product._id);
  const price = itemPrice(product);
  const url = `/products/${product._id}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-md">
      <div className="relative">
        <Link to={url} aria-label={`View ${product.name}`} className="group block overflow-hidden">
          <FabricImage src={product.imageUrl} category={product.category} alt="" loading="lazy" className="aspect-[5/4] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.035]" />
        </Link>
        <button
          type="button" aria-pressed={selected} aria-label={`Save ${product.name}`} title={selected ? "Remove from saved fabrics" : "Save fabric"}
          onClick={() => toggleSaved(product)}
          className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-emerald-700 shadow hover:bg-emerald-50 aria-pressed:bg-emerald-50 motion-safe:transition motion-safe:duration-200 motion-safe:active:scale-90"
        >
          <Heart size={19} fill={selected ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{product.category}{product.sample ? " · Sample" : ""}</p>
          <h3 className="mt-1 text-lg font-semibold"><Link to={url} className="hover:text-emerald-700">{product.name}</Link></h3>
          <p className="text-sm text-gray-600">{product.material}</p>
          {(product.gsm || product.width || product.minimumOrderQuantity) && (
            <p className="mt-2 text-xs text-stone-600">
              {[product.gsm && `${product.gsm} GSM`, product.width && `${product.width} cm wide`, product.minimumOrderQuantity && `Min. ${formatFabricQuantity(product.minimumOrderQuantity, product.priceUnit)}`].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-emerald-700">₹{price.toLocaleString("en-IN")}{product.priceUnit && <span className="text-sm font-normal text-stone-600"> / {product.priceUnit}</span>}</span>
          {price < product.price && <del className="text-sm text-gray-500">₹{product.price.toLocaleString("en-IN")}</del>}
          {product.numReviews > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-gray-700"><Star size={14} className="text-amber-500" /> {product.rating} ({product.numReviews})</span>
          )}
        </div>
        <button
          type="button" disabled={stock < minimum || quantity >= stock} onClick={() => addToCart(product)}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 motion-safe:transition-colors disabled:bg-gray-100 disabled:text-gray-600"
        >
          <ShoppingBag size={16} /> {stock === 0 ? "Out of stock" : stock < minimum ? "Below minimum stock" : quantity >= stock ? `Stock limit · ${quantity} in cart` : quantity ? `Add another · ${quantity} in cart` : "Add to cart"}
        </button>
        <button type="button" aria-pressed={compared} aria-label={`Compare ${product.name}`}
          disabled={!compared && comparison.length >= 3} onClick={() => toggleComparison(product)}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-emerald-800 enabled:hover:border-emerald-300 aria-pressed:border-emerald-300 aria-pressed:bg-emerald-50 motion-safe:transition-colors disabled:text-stone-400">
          {compared ? "Remove from comparison" : comparison.length >= 3 ? "Comparison full" : "Compare"}
        </button>
      </div>
    </article>
  );
}
