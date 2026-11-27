import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { availableQuantity, formatFabricQuantity, itemPrice, minimumQuantity } from "../services/catalog";
import FabricImage from "./FabricImage";

export default function ProductCard({ product }) {
  const reduceMotion = useReducedMotion();
  const { cart, saved, comparison, toggleSaved, toggleComparison, addToCart } = useCart();
  const selected = saved.some((item) => item._id === product._id);
  const quantity = cart.find((item) => item._id === product._id)?.quantity || 0;
  const stock = availableQuantity(product);
  const minimum = minimumQuantity(product);
  const compared = comparison.some((item) => item._id === product._id);
  const price = itemPrice(product);
  const url = `/products/${product._id}`;

  return (
    <motion.article
      className="surface flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm"
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <Link to={url} aria-label={`View ${product.name}`} className="group block overflow-hidden">
          <FabricImage
            src={product.imageUrl}
            category={product.category}
            alt=""
            loading="lazy"
            className="aspect-[5/4] w-full object-cover motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
        </Link>
        <motion.button
          type="button"
          aria-pressed={selected}
          aria-label={`Save ${product.name}`}
          title={selected ? "Remove from saved fabrics" : "Save fabric"}
          onClick={() => toggleSaved(product)}
          className="absolute right-3 top-3 rounded-full p-2.5 theme-brand shadow"
          style={{ backgroundColor: "color-mix(in srgb, var(--fb-surface) 95%, transparent)" }}
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          animate={selected && !reduceMotion ? { scale: [1, 1.15, 1] } : undefined}
          transition={{ duration: 0.35 }}
        >
          <Heart size={19} fill={selected ? "currentColor" : "none"} />
        </motion.button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="theme-muted text-xs font-semibold uppercase tracking-wide">
            {product.category}
            {product.sample ? " · Sample" : ""}
          </p>
          <h3 className="theme-text mt-1 text-lg font-semibold">
            <Link to={url} className="theme-brand transition hover:opacity-80">
              {product.name}
            </Link>
          </h3>
          <p className="theme-muted text-sm">{product.material}</p>
          {(product.colour || product.finish || product.stretch || product.gsm || product.width || product.minimumOrderQuantity) && (
            <p className="theme-muted mt-2 text-xs">
              {[
                product.colour,
                product.finish,
                product.stretch && product.stretch !== "None" ? `${product.stretch} stretch` : null,
                product.gsm && `${product.gsm} GSM`,
                product.width && `${product.width} cm wide`,
                product.minimumOrderQuantity && `Min. ${formatFabricQuantity(product.minimumOrderQuantity, product.priceUnit)}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold theme-brand">
            ₹{price.toLocaleString("en-IN")}
            {product.priceUnit && <span className="text-sm font-normal theme-muted"> / {product.priceUnit}</span>}
          </span>
          {price < product.price && <del className="text-sm theme-muted">₹{product.price.toLocaleString("en-IN")}</del>}
          {product.numReviews > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs theme-muted">
              <Star size={14} className="text-amber-500" /> {product.rating} ({product.numReviews})
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={stock < minimum || quantity >= stock}
          onClick={() => addToCart(product)}
          aria-label={
            stock === 0
              ? `${product.name} out of stock`
              : stock < minimum
                ? `${product.name} below minimum stock`
                : quantity >= stock
                  ? `${product.name} stock limit reached, ${quantity} in cart`
                  : quantity
                    ? `Add another ${product.name}, ${quantity} already in cart`
                    : `Add ${product.name} to cart`
          }
          className="brand-fill mt-auto flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold leading-none transition"
        >
          <ShoppingBag size={16} className="shrink-0" aria-hidden="true" />
          <span className="truncate">
            {stock === 0
              ? "Out of stock"
              : stock < minimum
                ? "Below MOQ stock"
                : quantity >= stock
                  ? "Stock limit"
                  : quantity
                    ? "Add more"
                    : "Add to cart"}
          </span>
          {quantity > 0 && stock > 0 && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: "color-mix(in srgb, var(--fb-on-brand) 18%, transparent)", color: "var(--fb-on-brand)" }}
            >
              {quantity}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-pressed={compared}
          aria-label={compared ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
          disabled={!compared && comparison.length >= 3}
          onClick={() => toggleComparison(product)}
          className="min-h-10 rounded-xl border border-[color:var(--fb-border)] px-3 py-2 text-sm font-semibold leading-none theme-brand transition hover:border-[color:var(--fb-brand)] disabled:opacity-40"
        >
          {compared ? "Compared" : comparison.length >= 3 ? "Full" : "Compare"}
        </button>
      </div>
    </motion.article>
  );
}
