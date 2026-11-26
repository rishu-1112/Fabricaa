import { Link } from "react-router-dom";
import { fabricCategories } from "../data/sampleCatalog";

export default function Categories() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-bold">Shop by Fabric</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fabricCategories.filter(({ name }) => name !== "Other").map(({ name, image, use }) => (
            <Link key={name} to={`/products?category=${name}`} className="group overflow-hidden rounded-2xl border border-gray-200">
              <img src={image} alt="" loading="lazy" className="h-44 w-full object-cover transition group-hover:scale-105" />
              <div className="relative bg-white p-5">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-gray-600">{use}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
