import { Link } from "react-router-dom";

export default function ContactBanner() {
  return (
    <section className="bg-emerald-700 px-6 py-14 text-center text-white">
      <h2 className="mb-4 text-3xl font-bold">Planning a Fabric Project?</h2>
      <p className="mb-6">Ask about swatches, bulk quantities, or a sourcing partnership.</p>
      <Link to="/contact?topic=swatches" className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">Ask About Swatches</Link>
    </section>
  );
}
