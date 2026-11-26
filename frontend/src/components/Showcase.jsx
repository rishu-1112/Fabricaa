import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FabricImage from "./FabricImage";
import { getAllFabrics } from "../services/fabricService";
import ProductCard from "./ProductCard";
import { isDemoMode } from "../services/catalog";
import useCatalog from "../services/useCatalog";

export default function Showcase() {
  const { products, status } = useCatalog();
  const [swatches, setSwatches] = useState([]);
  useEffect(() => {
    if (isDemoMode) return;
    const controller = new AbortController();
    getAllFabrics(controller.signal).then((fabrics) => {
      if (!controller.signal.aborted && Array.isArray(fabrics)) setSwatches(fabrics);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  const featured = [...products].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))).slice(0, 4);

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">Featured Fabrics</h2>
            {status === "sample" && <p className="mt-2 text-sm text-gray-600">Sample collection with illustrative prices and availability.</p>}
          </div>
          <Link className="font-semibold text-indigo-700 hover:underline" to="/products">Browse all fabrics →</Link>
        </div>
        {status === "loading" ? <p role="status">Loading featured fabrics…</p> :
          status === "empty" || status === "unavailable" ? (
            <p className="text-gray-600">
              {status === "empty" ? "There are no live fabrics yet." : "The live catalog is temporarily unavailable."}
              {" "}<Link to="/products?sample=1" className="text-indigo-700 underline">Browse sample fabrics</Link>
            </p>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
        {swatches.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-bold">Mill Swatches</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {swatches.map((swatch) => (
                <article key={swatch._id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <FabricImage src={swatch.imageUrl} category={swatch.category} alt="" loading="lazy" className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{swatch.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{swatch.description || swatch.material}</p>
                    <Link to={`/contact?topic=swatches&fabric=${encodeURIComponent(swatch.name)}`} className="mt-3 inline-block text-sm font-semibold text-indigo-700 underline">Ask about this swatch</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
