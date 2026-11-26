import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fabricCategories } from "../data/sampleCatalog";

export default function Categories() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 display-title text-4xl">Shop by Fabric</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {fabricCategories.filter(({ name }) => name !== "Other").map(({ name, image, use }) => (
            <Link key={name} to={`/products?category=${name}`} className="group overflow-hidden rounded-2xl border border-gray-200">
              <img src={image} alt="" loading="lazy" className="h-28 w-full sm:h-40 object-cover transition group-hover:scale-105" />
              <div className="relative bg-white p-3 sm:p-5">
                <h3 className="flex items-center justify-between gap-1 text-lg font-semibold">{name}<ArrowUpRight size={16} aria-hidden="true" /></h3>
                <p className="text-sm text-gray-600">{use}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
