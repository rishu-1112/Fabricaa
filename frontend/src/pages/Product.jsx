import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import FiltersBar from "../components/FiltersBar";
import { availableQuantity, isDemoMode, itemPrice } from "../services/catalog";
import { matchesFabricSearch } from "../services/catalog";
import useCatalog from "../services/useCatalog";
import { fabricCategories } from "../data/sampleCatalog";

export default function Products() {
  const { saved } = useCart();
  const [params, setParams] = useSearchParams();
  const { products, status, retry } = useCatalog(params.get("sample") === "1");
  const resetUrl = status === "sample" && !isDemoMode ? "/products?sample=1" : "/products";
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "new";
  const query = params.get("q") || "";
  const stock = params.get("stock") === "1";
  const savedOnly = params.get("saved") === "1";
  const source = savedOnly ? saved : products;
  const categories = [...new Set([...fabricCategories.map(({ name }) => name), ...source.map((item) => item.category)])].filter(Boolean);
  const visible = source.filter((product) =>
    (category === "All" || product.category === category) &&
    (!stock || availableQuantity(product) > 0) &&
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
    <section className="paper min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="display-title text-5xl sm:text-6xl">{savedOnly ? "Saved Fabrics" : "Fabric Catalog"}</h1>
        <p className="mt-3 text-gray-600">{savedOnly ? "Compare the fabrics you’ve shortlisted." : "Find fabrics by fibre, weight, and intended use."}</p>
        {status === "sample" && !savedOnly && (
          <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            You’re viewing sample fabrics. Prices and availability are illustrative.
            {!isDemoMode && <Link to="/products" className="ml-3 font-semibold underline">Back to live catalog</Link>}
          </div>
        )}
        <div className="my-7 space-y-5 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4">
            <Search size={19} aria-hidden="true" />
            <input className="w-full bg-transparent py-3" type="search" aria-label="Search fabrics" placeholder="Search names, fibres or uses" value={query} onChange={(event) => updateFilter("q", event.target.value)} />
          </label>
          <FiltersBar categories={categories} category={category} sort={sort} inStock={stock} savedOnly={savedOnly} updateFilter={updateFilter} />
        </div>
        {!savedOnly && status === "loading" ? <p role="status">Loading fabrics…</p> :
          !savedOnly && (status === "empty" || status === "unavailable") ? (
            <div className="space-y-4 rounded-xl bg-white p-8 text-center">
              <p role="status">{status === "empty" ? "There are no live fabrics in the catalog yet." : "The live catalog is temporarily unavailable."}</p>
              <div className="flex flex-wrap justify-center gap-4 text-emerald-700">
                {status === "unavailable" && <button type="button" className="underline" onClick={retry}>Try again</button>}
                <Link to="/products?sample=1" className="underline">Browse sample fabrics</Link>
              </div>
            </div>
          ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p role="status" className="text-sm text-gray-600">{visible.length} {visible.length === 1 ? "fabric" : "fabrics"}</p>
              {[...params.keys()].some((key) => key !== "sample") && <Link to={resetUrl} className="text-sm font-semibold text-emerald-700 hover:underline">Clear filters</Link>}
            </div>
            {visible.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
            ) : <p className="rounded-xl bg-white p-8 text-center text-gray-600">{savedOnly && !saved.length ? "Use the heart on any fabric to save it here." : "No fabrics match your filters."}</p>}
          </>
        )}
      </div>
    </section>
  );
}
