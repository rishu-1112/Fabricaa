import { Link } from "react-router-dom";
import FabricImage from "../components/FabricImage";
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
    <section className="mx-auto min-h-[60vh] max-w-6xl space-y-5 px-5 py-12">
      <h1 className="display-title text-5xl">Compare Fabrics</h1>
      <Link to="/products" className="inline-block text-emerald-800 underline">Browse fabrics</Link>
      {!comparison.length ? <p>Choose up to three fabrics using the Compare button in the catalog.</p> : (
        <>
          {(differentUnits || missingUnits || mixedPricing) && (
            <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-950">
              {differentUnits || missingUnits ? "Price units differ or are unspecified. Compare prices only where the units match. " : ""}
              {mixedPricing ? "Sample prices are illustrative." : ""}
            </p>
          )}
          <div tabIndex={0} role="region" aria-label="Scrollable fabric comparison" className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Fabric specifications side by side</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-32 p-3 align-bottom">Specification</th>
                  {comparison.map((item) => (
                    <th key={item._id} scope="col" className="min-w-44 p-3 align-top">
                      <FabricImage src={item.imageUrl} category={item.category} alt="" className="mb-2 aspect-video w-full max-w-xs rounded-md object-cover" />
                      <Link to={`/products/${item._id}`} className="block text-base text-emerald-900 hover:underline">{item.name}</Link>
                      {item.sample && <p className="text-xs font-normal text-stone-600">Sample</p>}
                      <button type="button" onClick={() => toggleComparison(item)} aria-label={`Remove ${item.name} from comparison`} className="mt-2 font-normal text-emerald-800 underline">Remove</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specifications.map(([label, value]) => (
                  <tr key={label} className="border-t border-stone-200">
                    <th scope="row" className="p-3 font-semibold">{label}</th>
                    {comparison.map((item) => <td key={item._id} className="p-3 align-top">{value(item) || "Not specified"}</td>)}
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
