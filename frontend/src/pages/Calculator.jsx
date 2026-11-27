import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollRevealAbout";
import { sampleProducts } from "../data/sampleCatalog";
import { formatFabricQuantity, minimumQuantity } from "../services/catalog";
import { metresNeeded } from "../services/quoteHistory";
import useCatalog from "../services/useCatalog";

export default function Calculator() {
  const { products } = useCatalog(true);
  const fabrics = products.length ? products : sampleProducts;
  const [garments, setGarments] = useState(12);
  const [metresPerGarment, setMetresPerGarment] = useState(1.6);
  const [wastage, setWastage] = useState(10);
  const [fabricId, setFabricId] = useState(fabrics[0]?._id || "");

  const selected = fabrics.find((item) => item._id === fabricId) || fabrics[0];
  const total = useMemo(
    () => metresNeeded(garments, metresPerGarment, wastage),
    [garments, metresPerGarment, wastage]
  );
  const moq = selected ? minimumQuantity(selected) : 1;
  const meetsMoq = total >= moq;
  const shortfall = Math.max(0, Number((moq - total).toFixed(2)));

  return (
    <section className="paper px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Tools</p>
          <h1 className="display-title theme-text text-5xl">Size / MOQ calculator</h1>
          <p className="theme-muted mt-3 max-w-2xl">
            Estimate metres from garment count and wastage, then check against a fabric’s minimum order quantity.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal className="surface space-y-5 rounded-3xl border p-6 shadow-sm sm:p-8">
            <label className="block text-sm font-medium">
              Number of garments
              <input
                className="field-input"
                type="number"
                min="1"
                step="1"
                value={garments}
                onChange={(event) => setGarments(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Metres per garment
              <input
                className="field-input"
                type="number"
                min="0.1"
                step="0.1"
                value={metresPerGarment}
                onChange={(event) => setMetresPerGarment(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Wastage (%)
              <input
                className="field-input"
                type="number"
                min="0"
                max="100"
                step="1"
                value={wastage}
                onChange={(event) => setWastage(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Compare with fabric MOQ
              <select className="field-input" value={selected?._id || ""} onChange={(event) => setFabricId(event.target.value)}>
                {fabrics.map((fabric) => (
                  <option key={fabric._id} value={fabric._id}>
                    {fabric.name} · min {formatFabricQuantity(minimumQuantity(fabric), fabric.priceUnit)}
                  </option>
                ))}
              </select>
            </label>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div
              className="rounded-3xl p-6 shadow-sm sm:p-8"
              style={{ backgroundColor: "var(--fb-hero)", color: "#ecfdf5" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Estimate</p>
              <p className="display-title mt-4 text-5xl text-white">{total}</p>
              <p className="mt-2 text-emerald-100/85">metres needed (including wastage)</p>
              <dl className="mt-8 space-y-3 text-sm text-emerald-50/90">
                <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                  <dt>Base metres</dt>
                  <dd>{Number((Number(garments) * Number(metresPerGarment) || 0).toFixed(2))}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                  <dt>Wastage add-on</dt>
                  <dd>{Number((total - Number(garments) * Number(metresPerGarment) || 0).toFixed(2))}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                  <dt>Selected fabric</dt>
                  <dd className="text-right">{selected?.name || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Minimum order</dt>
                  <dd>{selected ? formatFabricQuantity(moq, selected.priceUnit) : "—"}</dd>
                </div>
              </dl>
              <p
                className="mt-8 rounded-2xl px-4 py-3 text-sm font-medium"
                style={{
                  backgroundColor: meetsMoq
                    ? "color-mix(in srgb, #ecfdf5 16%, transparent)"
                    : "color-mix(in srgb, #f59e0b 28%, transparent)",
                  color: "#ecfdf5",
                }}
              >
                {meetsMoq
                  ? "Your estimate meets or exceeds this fabric’s MOQ."
                  : `Add about ${shortfall} more metres to reach the MOQ, or choose another fabric.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {selected && (
                  <Link
                    to={`/products/${selected._id}`}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{ backgroundColor: "#ecfdf5", color: "#022c22" }}
                  >
                    View fabric
                  </Link>
                )}
                <Link
                  to="/swatches"
                  className="rounded-full border border-white/45 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request swatches
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
