import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import FiltersBar from "../components/FiltersBar";
import ScrollReveal, { Stagger, StaggerItem } from "../components/ScrollRevealAbout";
import ThemeLoader from "../components/ThemeLoader";
import {
  availableQuantity,
  isDemoMode,
  itemPrice,
  matchesFabricSearch,
  matchesFabricTrait,
  matchesFabricWeight,
  uniqueTraitValues,
  weightBands,
} from "../services/catalog";
import { shortlistLimit } from "../services/shortlist";
import useCatalog from "../services/useCatalog";
import { fabricCategories } from "../data/sampleCatalog";

export default function Products() {
  const { saved } = useCart();
  const [shareStatus, setShareStatus] = useState("");
  const [params, setParams] = useSearchParams();
  const { products, status, retry } = useCatalog(params.get("sample") === "1");
  const resetUrl = status === "sample" && !isDemoMode ? "/products?sample=1" : "/products";
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "new";
  const query = params.get("q") || "";
  const stock = params.get("stock") === "1";
  const savedOnly = params.get("saved") === "1";
  const shareUrl = new URL("/shortlist", window.location.origin);
  if (savedOnly) shareUrl.searchParams.set("fabrics", saved.map(({ _id }) => _id).join(","));
  const source = savedOnly ? saved : products;
  const categories = [...new Set([...fabricCategories.map(({ name }) => name), ...source.map((item) => item.category)])].filter(Boolean);
  const weight = weightBands.some(({ value }) => value === params.get("weight")) ? params.get("weight") : "";
  const useOptions = [...new Set(source.flatMap((product) => product.intendedUses ?? []))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const use = useOptions.includes(params.get("use")) ? params.get("use") : "";
  const colours = uniqueTraitValues(source, "colour");
  const finishes = uniqueTraitValues(source, "finish");
  const stretches = uniqueTraitValues(source, "stretch");
  const colour = colours.includes(params.get("colour")) ? params.get("colour") : "";
  const finish = finishes.includes(params.get("finish")) ? params.get("finish") : "";
  const stretch = stretches.includes(params.get("stretch")) ? params.get("stretch") : "";
  const visible = source.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      (!stock || availableQuantity(product) > 0) &&
      matchesFabricWeight(product, weight) &&
      (!use || product.intendedUses?.includes(use)) &&
      matchesFabricTrait(product, "colour", colour) &&
      matchesFabricTrait(product, "finish", finish) &&
      matchesFabricTrait(product, "stretch", stretch) &&
      matchesFabricSearch(product, query)
  );
  if (sort === "low") visible.sort((a, b) => itemPrice(a) - itemPrice(b));
  if (sort === "high") visible.sort((a, b) => itemPrice(b) - itemPrice(a));
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "new") visible.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === "q", preventScrollReset: true });
  }

  return (
    <section className="paper min-h-screen px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <h1 className="display-title theme-text text-5xl sm:text-6xl">
            {savedOnly ? "Saved Fabrics" : "Fabric Catalog"}
          </h1>
          <p className="theme-muted mt-3 max-w-xl">
            {savedOnly
              ? "Compare the fabrics you’ve shortlisted."
              : "Find fabrics by fibre, colour, finish, stretch, weight, and use."}
          </p>
        </ScrollReveal>

        {savedOnly && saved.length > 0 && (
          <ScrollReveal className="surface mt-6 space-y-2 rounded-2xl border p-5" delay={0.05}>
            <h2 className="font-semibold theme-text">Share your shortlist</h2>
            {saved.length > shortlistLimit ? (
              <p>Remove fabrics until the shortlist has {shortlistLimit} or fewer items.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <input
                  aria-label="Shortlist link"
                  readOnly
                  value={shareUrl.href}
                  onFocus={(event) => event.target.select()}
                  className="field-input min-w-0 flex-1"
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareUrl.href);
                      setShareStatus("Shortlist link copied.");
                    } catch {
                      setShareStatus("Select the shortlist link and copy it manually.");
                    }
                  }}
                >
                  Copy link
                </button>
              </div>
            )}
            {shareStatus && (
              <p role="status" className="text-sm">
                {shareStatus}
              </p>
            )}
          </ScrollReveal>
        )}

        {status === "sample" && !savedOnly && (
          <ScrollReveal className="theme-soft mt-6 rounded-2xl px-4 py-3 text-sm" delay={0.05}>
            You’re viewing sample fabrics. Prices and availability are illustrative.
            {!isDemoMode && (
              <Link to="/products" className="ml-3 font-semibold underline">
                Back to live catalog
              </Link>
            )}
          </ScrollReveal>
        )}

        <ScrollReveal className="surface my-8 space-y-5 rounded-3xl border p-4 shadow-sm sm:p-5" delay={0.08}>
          <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--fb-border)] px-4 transition focus-within:border-[color:var(--fb-brand)] focus-within:ring-2 focus-within:ring-[color:var(--fb-brand)]/15">
            <Search size={19} aria-hidden="true" className="theme-muted" />
            <input
              className="theme-text w-full bg-transparent py-3 outline-none"
              type="search"
              aria-label="Search fabrics"
              placeholder="Search names, fibres or uses"
              value={query}
              onChange={(event) => updateFilter("q", event.target.value)}
            />
          </label>
          <FiltersBar
            categories={categories}
            category={category}
            sort={sort}
            inStock={stock}
            savedOnly={savedOnly}
            weight={weight}
            use={use}
            uses={useOptions}
            colour={colour}
            colours={colours}
            finish={finish}
            finishes={finishes}
            stretch={stretch}
            stretches={stretches}
            updateFilter={updateFilter}
          />
        </ScrollReveal>

        {!savedOnly && status === "loading" ? (
          <ThemeLoader label="Loading fabrics…" />
        ) : !savedOnly && (status === "empty" || status === "unavailable") ? (
          <div className="surface space-y-4 rounded-2xl p-8 text-center shadow-sm">
            <p role="status" className="theme-muted">
              {status === "empty" ? "There are no live fabrics in the catalog yet." : "The live catalog is temporarily unavailable."}
            </p>
            <div className="theme-brand flex flex-wrap justify-center gap-4">
              {status === "unavailable" && (
                <button type="button" className="underline" onClick={retry}>
                  Try again
                </button>
              )}
              <Link to="/products?sample=1" className="underline">
                Browse sample fabrics
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p role="status" className="text-sm theme-muted">
                {visible.length} {visible.length === 1 ? "fabric" : "fabrics"}
              </p>
              {[...params.keys()].some((key) => key !== "sample") && (
                <Link to={resetUrl} className="text-sm font-semibold theme-brand hover:underline">
                  Clear filters
                </Link>
              )}
            </div>
            {visible.length ? (
              <Stagger
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                key={`${category}-${sort}-${query}-${weight}-${use}-${stock}-${savedOnly}-${colour}-${finish}-${stretch}`}
              >
                {visible.map((product) => (
                  <StaggerItem key={product._id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="surface rounded-2xl p-8 text-center theme-muted shadow-sm">
                {savedOnly && !saved.length ? "Use the heart on any fabric to save it here." : "No fabrics match your filters."}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
