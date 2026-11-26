export default function FiltersBar({ categories, category, sort, inStock, savedOnly, updateFilter }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2" aria-label="Fabric categories" role="group">
        {["All", ...categories].map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => updateFilter("category", name === "All" ? "" : name)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${category === name ? "border-indigo-700 bg-indigo-700 text-white" : "border-gray-200 bg-white hover:bg-indigo-50"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inStock} onChange={(event) => updateFilter("stock", event.target.checked ? "1" : "")} />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={savedOnly} onChange={(event) => updateFilter("saved", event.target.checked ? "1" : "")} />
          Saved only
        </label>
        <label className="flex items-center gap-2">
          Sort by
          <select value={sort} onChange={(event) => updateFilter("sort", event.target.value === "new" ? "" : event.target.value)} className="rounded-lg border border-gray-200 bg-white p-2">
            <option value="new">Newest</option>
            <option value="low">Price · low to high</option>
            <option value="high">Price · high to low</option>
            <option value="name">Name · A to Z</option>
          </select>
        </label>
      </div>
    </div>
  );
}
