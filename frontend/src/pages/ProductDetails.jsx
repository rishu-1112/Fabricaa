import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import FabricImage from "../components/FabricImage";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { sampleProducts } from "../data/sampleCatalog";
import { apiUrl } from "../services/api";
import { availableQuantity, isDemoMode, itemPrice } from "../services/catalog";

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
    const messages = { loading: "Loading fabric…", missing: "Fabric not found.", unavailable: "The fabric catalog is temporarily unavailable." };
    return (
      <section className="space-y-4 px-6 py-20 text-center">
        <p role="status">{messages[status]}</p>
        {status === "unavailable" && <button className="mr-5 text-emerald-700 underline" onClick={() => { setStatus("loading"); setAttempt(attempt + 1); }}>Try again</button>}
        <Link to="/products" className="text-emerald-700 underline">Browse fabrics</Link>
      </section>
    );
  }

  const sampleFilter = product.sample && !isDemoMode ? "sample=1&" : "";
  const images = [...new Set([product.imageUrl, ...(product.gallery || [])])];
  const inCart = cart.find((item) => item._id === id)?.quantity || 0;
  const stock = availableQuantity(product);
  const remaining = Math.max(0, stock - inCart);
  const selectedQuantity = Math.min(quantity, remaining || 1);
  const isSaved = saved.some((item) => item._id === id);
  const price = itemPrice(product);
  const related = product.sample ? sampleProducts.filter((item) => item.category === product.category && item._id !== id) : [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <Link to={sampleFilter ? "/products?sample=1" : "/products"} className="mb-7 inline-flex items-center gap-2 text-emerald-700 hover:underline"><ArrowLeft size={18} /> Browse fabrics</Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <FabricImage src={images[imageIndex]} category={product.category} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" />
          {images.length > 1 && <div className="mt-4 flex flex-wrap gap-3">
            {images.map((image, index) => (
              <button key={image} type="button" aria-label={`View image ${index + 1}`} aria-pressed={index === imageIndex} onClick={() => setImageIndex(index)} className={`overflow-hidden rounded-lg border-2 ${index === imageIndex ? "border-emerald-700" : "border-transparent"}`}>
                <FabricImage src={image} category={product.category} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>}
        </div>
        <div className="space-y-5">
          <p className="text-sm font-semibold text-emerald-700">{product.category}{product.sample ? " · Sample fabric" : ""}</p>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="flex items-baseline gap-3 font-semibold">
            <span className="text-2xl text-emerald-700">₹{price.toLocaleString("en-IN")}</span>
            {price < product.price && <del className="text-gray-500">₹{product.price.toLocaleString("en-IN")}</del>}
            {product.sample && <span className="text-sm text-gray-600">illustrative price</span>}
          </p>
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm">
            <dt>Composition</dt><dd className="font-semibold">{product.material}</dd>
            {product.gsm && <><dt>Weight</dt><dd className="font-semibold">{product.gsm} GSM</dd></>}
            {product.width && <><dt>Width</dt><dd className="font-semibold">{product.width} cm</dd></>}
            <dt>Availability</dt><dd className="font-semibold">{stock > 0 ? `${stock} available` : "Out of stock"}</dd>
          </dl>
          <div className="flex flex-wrap items-end gap-3">
            {remaining > 0 && <label className="flex flex-col gap-1 text-sm font-medium">
              Quantity
              <select className="rounded-lg border border-gray-300 bg-white p-2.5" value={selectedQuantity} onChange={(event) => setQuantity(Number(event.target.value))}>
                {Array.from({ length: Math.min(remaining, 50) }, (_, index) => <option key={index + 1}>{index + 1}</option>)}
              </select>
            </label>}
            <button type="button" disabled={!remaining} onClick={() => addToCart(product, selectedQuantity)} className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white disabled:bg-gray-200 disabled:text-gray-600">
              <ShoppingBag size={18} /> {remaining ? "Add to cart" : stock ? "Stock limit reached" : "Out of stock"}
            </button>
            <button type="button" aria-pressed={isSaved} onClick={() => toggleSaved(product)} className="flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-emerald-700"><Heart size={18} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save"}</button>
          </div>
          {inCart > 0 && <p role="status"><Link to="/cart" className="text-sm font-semibold text-emerald-700 underline">{inCart} in your cart</Link></p>}
          <div className="flex flex-wrap gap-4 text-sm text-emerald-700">
            <Link to={`/products?${sampleFilter}category=${encodeURIComponent(product.category)}`} className="underline">More {product.category} fabrics</Link>
            {!product.sample && <Link to={`/contact?topic=swatches&fabric=${encodeURIComponent(product.name)}`} className="underline">Ask for a swatch</Link>}
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold">Related Fabrics</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item._id} product={item} />)}</div>
      </section>}
    </section>
  );
}
