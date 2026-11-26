import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { sampleProducts } from "../data/sampleCatalog";
import useCatalog from "../services/useCatalog";

import { shortlistLimit } from "../services/shortlist";

export default function Shortlist() {
  const [params] = useSearchParams();
  const ids = [...new Set((params.get("fabrics") || "").split(",").filter(Boolean))].slice(0, shortlistLimit);
  const [imported, setImported] = useState(false);
  const { saved, saveFabrics } = useCart();
  const { products, status, retry } = useCatalog(ids.every((id) => id.startsWith("sample-")));
  const byId = new Map([...sampleProducts, ...products].map((product) => [product._id, product]));
  const fabrics = ids.map((id) => byId.get(id)).filter(Boolean);
  const missing = ids.length - fabrics.length;
  const isSaved = fabrics.every((item) => saved.some((entry) => entry._id === item._id));

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl space-y-5 px-5 py-12">
      <h1 className="display-title text-5xl">Shared Fabric Shortlist</h1>
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/products" className="text-emerald-800 underline">Browse fabrics</Link>
        {fabrics.length > 0 && <button type="button" disabled={isSaved} onClick={() => {
          saveFabrics(fabrics);
          setImported(true);
        }} className="rounded-lg bg-emerald-800 px-4 py-2 text-white disabled:bg-stone-500">
          {isSaved ? "Fabrics saved" : "Save this shortlist"}
        </button>}
        {imported && isSaved && <Link to="/products?saved=1" className="text-emerald-800 underline">View saved fabrics</Link>}
      </div>
      {status === "loading" && <p role="status">Loading the shortlist…</p>}
      {status === "unavailable" && <p role="alert">The live catalog is temporarily unavailable. <button onClick={retry} className="underline">Try again</button></p>}
      {missing > 0 && status !== "loading" && <p>{missing} {missing === 1 ? "fabric is" : "fabrics are"} currently unavailable in this catalog.</p>}
      {!ids.length && <p>This shortlist has no fabrics.</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fabrics.map((item) => <ProductCard key={item._id} product={item} />)}
      </div>
    </section>
  );
}
