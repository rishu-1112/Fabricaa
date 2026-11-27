import { Link } from "react-router-dom";
import FabricImage from "../components/FabricImage";
import ScrollReveal from "../components/ScrollRevealAbout";
import { useCart } from "../context/CartContext";
import { formatFabricQuantity, itemPrice } from "../services/catalog";

const specifications = [
  ["Price", (item) => `₹${itemPrice(item).toLocaleString("en-IN")}${item.priceUnit ? ` / ${item.priceUnit}` : ""}`],
  ["Composition", (item) => item.material],
  ["Width", (item) => item.width && `${item.width} cm`],
  ["Weight", (item) => item.gsm && `${item.gsm} GSM`],
  ["Minimum order", (item) => item.minimumOrderQuantity && formatFabricQuantity(item.minimumOrderQuantity, item.priceUnit)],
  ["Intended uses", (item) => item.intendedUses?.join(", ")],
  ["Care", (item) => item.careInstructions],
];

export default function Compare() {
  const { comparison, toggleComparison } = useCart();
  const differentUnits = new Set(comparison.map((item) => item.priceUnit || "")).size > 1;
  const missingUnits = comparison.length > 1 && comparison.some((item) => !item.priceUnit);
  const mixedPricing = comparison.some((item) => item.sample) && comparison.some((item) => !item.sample);

  return (
    <section className="paper mx-auto min-h-[60vh] max-w-6xl px-6 py-14 sm:px-10">
      <ScrollReveal>
        <h1 className="display-title theme-text text-5xl">Compare fabrics</h1>
        <p className="theme-muted mt-3 max-w-xl">Place up to three fabrics side by side to check price, weight, and care.</p>
        <Link to="/products" className="mt-4 inline-block font-semibold theme-brand underline">
          Browse fabrics
        </Link>
      </ScrollReveal>

      {!comparison.length ? (
        <ScrollReveal className="mt-10 rounded-3xl border border-[color:var(--fb-border)] surface p-8 text-center shadow-sm" delay={0.05}>
          <p className="theme-muted">Choose up to three fabrics using the Compare button in the catalog.</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">
            Open catalog
          </Link>
        </ScrollReveal>
      ) : (
        <>
          {(differentUnits || missingUnits || mixedPricing) && (
            <p className="mt-6 rounded-2xl border border-amber-200 theme-soft p-4 text-sm text-amber-950" role="status">
              {differentUnits || missingUnits
                ? "Price units differ or are unspecified. Compare prices only where the units match. "
                : ""}
              {mixedPricing ? "Sample prices are illustrative." : ""}
            </p>
          )}
          <div
            tabIndex={0}
            role="region"
            aria-label="Scrollable fabric comparison"
            className="mt-6 overflow-x-auto rounded-3xl border border-[color:var(--fb-border)] surface shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Fabric specifications side by side</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-32 p-4 align-bottom theme-muted">
                    Specification
                  </th>
                  {comparison.map((item) => (
                    <th key={item._id} scope="col" className="min-w-44 p-4 align-top">
                      <FabricImage
                        src={item.imageUrl}
                        category={item.category}
                        alt=""
                        loading="lazy"
                        className="mb-3 aspect-video w-full max-w-xs rounded-2xl object-cover"
                      />
                      <Link to={`/products/${item._id}`} className="block text-base font-semibold theme-text hover:underline">
                        {item.name}
                      </Link>
                      {item.sample && <p className="text-xs font-normal theme-muted">Sample</p>}
                      <button
                        type="button"
                        onClick={() => toggleComparison(item)}
                        aria-label={`Remove ${item.name} from comparison`}
                        className="mt-2 font-normal theme-brand underline"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specifications.map(([label, value]) => (
                  <tr key={label} className="border-t border-[color:var(--fb-border)]">
                    <th scope="row" className="p-4 font-semibold theme-text">
                      {label}
                    </th>
                    {comparison.map((item) => (
                      <td key={item._id} className="p-4 align-top theme-muted">
                        {value(item) || "Not specified"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
