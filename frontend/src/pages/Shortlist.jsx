import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ScrollReveal, { Stagger, StaggerItem } from "../components/ScrollRevealAbout";
import ThemeLoader from "../components/ThemeLoader";
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
  const isSaved = fabrics.length > 0 && fabrics.every((item) => saved.some((entry) => entry._id === item._id));

  return (
    <section className="paper mx-auto min-h-[60vh] max-w-7xl px-6 py-14 sm:px-10">
      <ScrollReveal>
        <h1 className="display-title theme-text text-5xl">Shared fabric shortlist</h1>
        <p className="theme-muted mt-3 max-w-xl">A shareable selection of fabrics for review, saving, and quote planning.</p>
      </ScrollReveal>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link to="/products" className="font-semibold theme-brand underline">
          Browse fabrics
        </Link>
        {fabrics.length > 0 && (
          <button
            type="button"
            disabled={isSaved}
            onClick={() => {
              saveFabrics(fabrics);
              setImported(true);
            }}
            className="btn-primary disabled:opacity-50"
          >
            {isSaved ? "Fabrics saved" : "Save this shortlist"}
          </button>
        )}
        {imported && isSaved && (
          <Link to="/products?saved=1" className="font-semibold theme-brand underline">
            View saved fabrics
          </Link>
        )}
      </div>

      {status === "loading" && <ThemeLoader label="Loading the shortlist…" />}
      {status === "unavailable" && (
        <p role="alert" className="mt-6 rounded-2xl border border-amber-200 theme-soft p-4 text-amber-950">
          The live catalog is temporarily unavailable.{" "}
          <button type="button" onClick={retry} className="underline">
            Try again
          </button>
        </p>
      )}
      {missing > 0 && status !== "loading" && (
        <p className="mt-4 theme-muted">
          {missing} {missing === 1 ? "fabric is" : "fabrics are"} currently unavailable in this catalog.
        </p>
      )}
      {!ids.length && (
        <ScrollReveal className="mt-10 rounded-3xl border border-[color:var(--fb-border)] surface p-8 text-center shadow-sm">
          <p className="theme-muted">This shortlist has no fabrics.</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">
            Browse products
          </Link>
        </ScrollReveal>
      )}
      {fabrics.length > 0 && (
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fabrics.map((item) => (
            <StaggerItem key={item._id}>
              <ProductCard product={item} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}
