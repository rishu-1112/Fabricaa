import { weightBands } from "../services/catalog";

function ChipGroup({ label, options, value, onChange, allLabel = "All" }) {
  return (
    <div className="space-y-2">
      <p className="theme-muted text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        <button
          type="button"
          aria-pressed={!value}
          onClick={() => onChange("")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            !value ? "theme-chip-active" : "theme-chip hover:border-emerald-700/40"
          }`}
        >
          {allLabel}
        </button>
        {options.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={value === name}
            onClick={() => onChange(value === name ? "" : name)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              value === name ? "theme-chip-active" : "theme-chip hover:border-emerald-700/40"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FiltersBar({
  categories,
  category,
  sort,
  inStock,
  savedOnly,
  weight,
  use,
  uses,
  colour,
  colours,
  finish,
  finishes,
  stretch,
  stretches,
  updateFilter,
}) {
  return (
    <div className="space-y-5">
      <ChipGroup
        label="Fibre"
        options={categories}
        value={category === "All" ? "" : category}
        onChange={(value) => updateFilter("category", value)}
        allLabel="All fibres"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <ChipGroup label="Colour" options={colours} value={colour} onChange={(value) => updateFilter("colour", value)} />
        <ChipGroup label="Finish" options={finishes} value={finish} onChange={(value) => updateFilter("finish", value)} />
        <ChipGroup label="Stretch" options={stretches} value={stretch} onChange={(value) => updateFilter("stretch", value)} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={savedOnly}
          onClick={() => updateFilter("saved", savedOnly ? "" : "1")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            savedOnly ? "theme-chip-active" : "theme-chip hover:border-emerald-700/40"
          }`}
        >
          Favorites only
        </button>
        <button
          type="button"
          aria-pressed={inStock}
          onClick={() => updateFilter("stock", inStock ? "" : "1")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            inStock ? "theme-chip-active" : "theme-chip hover:border-emerald-700/40"
          }`}
        >
          In stock
        </button>
      </div>

      <div className="theme-muted flex flex-wrap items-center gap-4 text-sm">
        <label className="flex flex-wrap items-center gap-2">
          Fabric weight
          <select
            value={weight}
            onChange={(event) => updateFilter("weight", event.target.value)}
            className="field-input mt-0 w-auto"
          >
            <option value="">Any weight</option>
            {weightBands.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-wrap items-center gap-2">
          Intended use
          <select
            value={use}
            onChange={(event) => updateFilter("use", event.target.value)}
            className="field-input mt-0 w-auto"
          >
            <option value="">Any use</option>
            {uses.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Sort by
          <select
            value={sort}
            onChange={(event) => updateFilter("sort", event.target.value === "new" ? "" : event.target.value)}
            className="field-input mt-0 w-auto"
          >
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
