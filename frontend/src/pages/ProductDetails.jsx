import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import FabricImage from "../components/FabricImage";
import ProductCard from "../components/ProductCard";
import ScrollReveal, { Stagger, StaggerItem } from "../components/ScrollRevealAbout";
import ThemeLoader from "../components/ThemeLoader";
import { useCart } from "../context/CartContext";
import { sampleProducts } from "../data/sampleCatalog";
import { apiUrl } from "../services/api";
import { availableQuantity, formatFabricQuantity, isDemoMode, itemPrice, minimumQuantity } from "../services/catalog";

export default function ProductDetails() {
  const { id } = useParams();
  return <ProductView key={id} id={id} />;
}

function ProductView({ id }) {
  const sampleProduct = sampleProducts.find((item) => item._id === id);
  const [product, setProduct] = useState(sampleProduct);
  const [status, setStatus] = useState(sampleProduct ? "ready" : "loading");
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const { cart, saved, addToCart, toggleSaved } = useCart();

  useEffect(() => {
    if (sampleProduct) return;
    const controller = new AbortController();
    async function loadProduct() {
      try {
        const response = await fetch(apiUrl(`/products/${encodeURIComponent(id)}`), { signal: controller.signal });
        if (!response.ok) {
          setStatus(response.status === 404 ? "missing" : "unavailable");
          return;
        }
        setProduct(await response.json());
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("unavailable");
      }
    }
    if (/^[a-f\d]{24}$/i.test(id)) loadProduct();
    else setStatus("missing");
    return () => controller.abort();
  }, [id, sampleProduct, attempt]);

  if (status !== "ready") {
    if (status === "loading") {
      return <ThemeLoader fullPage label="Loading fabric…" />;
    }
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="display-title text-3xl theme-text">
          {status === "missing" ? "Fabric not found" : "Catalog unavailable"}
        </h1>
        <p className="max-w-md theme-muted">
          {status === "missing"
            ? "This fabric is not in the current catalog."
            : "The fabric catalog is temporarily unavailable."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {status === "unavailable" && (
            <button
              className="btn-secondary"
              onClick={() => {
                setStatus("loading");
                setAttempt(attempt + 1);
              }}
            >
              Try again
            </button>
          )}
          <Link to="/products" className="btn-primary">
            Browse fabrics
          </Link>
        </div>
      </section>
    );
  }

  const sampleFilter = product.sample && !isDemoMode ? "sample=1&" : "";
  const images = [...new Set([product.imageUrl, ...(product.gallery || [])])];
  const inCart = cart.find((item) => item._id === id)?.quantity || 0;
  const stock = availableQuantity(product);
  const remaining = Math.max(0, stock - inCart);
  const minimum = minimumQuantity(product);
  const minimumToAdd = Math.max(1, minimum - inCart);
  const canAdd = remaining >= minimumToAdd;
  const selectedQuantity = Math.min(Math.max(quantity, minimumToAdd), Math.max(remaining, minimumToAdd));
  const isSaved = saved.some((item) => item._id === id);
  const price = itemPrice(product);
  const related = product.sample
    ? sampleProducts.filter((item) => item.category === product.category && item._id !== id)
    : [];

  return (
    <section className="paper px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to={sampleFilter ? "/products?sample=1" : "/products"}
          className="mb-7 inline-flex items-center gap-2 font-medium theme-brand hover:underline"
        >
          <ArrowLeft size={18} /> Browse fabrics
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <ScrollReveal>
            <FabricImage
              src={images[imageIndex]}
              category={product.category}
              alt={product.name}
              className="aspect-square w-full rounded-3xl object-cover shadow-sm"
            />
            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={index === imageIndex}
                    onClick={() => setImageIndex(index)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      index === imageIndex ? "border-emerald-800" : "border-transparent hover:border-[color:var(--fb-border)]"
                    }`}
                  >
                    <FabricImage src={image} category={product.category} alt="" className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </ScrollReveal>
          <ScrollReveal className="space-y-5" delay={0.08}>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] theme-brand">
              {product.category}
              {product.sample ? " · Sample fabric" : ""}
            </p>
            <h1 className="display-title text-4xl theme-text sm:text-5xl">{product.name}</h1>
            <p className="leading-relaxed theme-muted">{product.description}</p>
            <p className="flex items-baseline gap-3 font-semibold">
              <span className="text-2xl theme-brand">
                ₹{price.toLocaleString("en-IN")}
                {product.priceUnit && <span className="text-sm font-normal theme-muted"> / {product.priceUnit}</span>}
              </span>
              {price < product.price && <del className="theme-muted">₹{product.price.toLocaleString("en-IN")}</del>}
              {product.sample && <span className="text-sm font-normal theme-muted">illustrative price</span>}
            </p>
            <dl className="grid grid-cols-2 gap-3 rounded-3xl border border-[color:var(--fb-border)] surface p-5 text-sm">
              <dt className="theme-muted">Composition</dt>
              <dd className="font-semibold theme-text">{product.material}</dd>
              {product.gsm && (
                <>
                  <dt className="theme-muted">Weight</dt>
                  <dd className="font-semibold theme-text">{product.gsm} GSM</dd>
                </>
              )}
              {product.width && (
                <>
                  <dt className="theme-muted">Width</dt>
                  <dd className="font-semibold theme-text">{product.width} cm</dd>
                </>
              )}
              {product.minimumOrderQuantity && (
                <>
                  <dt className="theme-muted">Minimum order</dt>
                  <dd className="font-semibold theme-text">
                    {formatFabricQuantity(product.minimumOrderQuantity, product.priceUnit)}
                  </dd>
                </>
              )}
              {product.intendedUses?.length > 0 && (
                <>
                  <dt className="theme-muted">Intended uses</dt>
                  <dd className="font-semibold theme-text">{product.intendedUses.join(", ")}</dd>
                </>
              )}
              <dt className="theme-muted">Availability</dt>
              <dd className="font-semibold theme-text">{stock > 0 ? `${stock} available` : "Out of stock"}</dd>
            </dl>
            {product.careInstructions && (
              <section aria-label="Fabric care">
                <h2 className="font-semibold theme-text">Care instructions</h2>
                <p className="mt-1 text-sm theme-muted">{product.careInstructions}</p>
              </section>
            )}
            <div className="flex flex-wrap items-end gap-3">
              {canAdd && (
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Quantity
                  <select
                    aria-label="Quantity"
                    className="rounded-xl border border-[color:var(--fb-border)] surface p-2.5"
                    value={selectedQuantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                  >
                    {Array.from({ length: Math.min(remaining - minimumToAdd + 1, 50) }, (_, index) => (
                      <option key={index + minimumToAdd}>{index + minimumToAdd}</option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                disabled={!canAdd}
                onClick={() => addToCart(product, selectedQuantity)}
                className="btn-primary disabled:opacity-50"
              >
                <ShoppingBag size={18} />{" "}
                {canAdd ? "Add to cart" : !stock ? "Out of stock" : stock < minimum ? "Below minimum stock" : "Stock limit reached"}
              </button>
              <button type="button" aria-pressed={isSaved} onClick={() => toggleSaved(product)} className="btn-secondary theme-brand">
                <Heart size={18} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save"}
              </button>
            </div>
            {minimum > 1 && (
              <p className="text-sm theme-muted">Minimum order: {formatFabricQuantity(minimum, product.priceUnit)} per fabric.</p>
            )}
            {inCart > 0 && (
              <p role="status">
                <Link to="/cart" className="text-sm font-semibold theme-brand underline">
                  {inCart} in your cart
                </Link>
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm theme-brand">
              <Link to={`/products?${sampleFilter}category=${encodeURIComponent(product.category)}`} className="underline">
                More {product.category} fabrics
              </Link>
              {!product.sample && (
                <Link to={`/contact?topic=swatches&fabric=${encodeURIComponent(product.name)}`} className="underline">
                  Ask for a swatch
                </Link>
              )}
            </div>
          </ScrollReveal>
        </div>
        {related.length > 0 && (
          <section className="mt-16">
            <ScrollReveal>
              <h2 className="mb-6 display-title text-3xl theme-text">Related fabrics</h2>
            </ScrollReveal>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StaggerItem key={item._id}>
                  <ProductCard product={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </section>
  );
}
