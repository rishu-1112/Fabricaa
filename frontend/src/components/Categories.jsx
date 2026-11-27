import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fabricCategories } from "../data/sampleCatalog";
import ScrollReveal, { Stagger, StaggerItem } from "./ScrollRevealAbout";

export default function Categories() {
  const categories = fabricCategories.filter(({ name }) => name !== "Other");

  return (
    <section id="browse" className="surface scroll-mt-24 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 max-w-2xl">
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Browse</p>
          <h2 className="display-title theme-text text-4xl sm:text-5xl">Shop by fabric</h2>
          <p className="theme-muted mt-4">Start with the fibre that fits your project, then refine by weight and use.</p>
        </ScrollReveal>

        <Stagger className="grid auto-rows-[14rem] gap-3 sm:auto-rows-[16rem] sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {categories.map(({ name, image, use }, index) => (
            <StaggerItem key={name} className={index === 0 ? "sm:row-span-2" : ""}>
              <Link
                to={`/products?category=${name}`}
                className="group relative block h-full overflow-hidden rounded-3xl"
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-white">
                    {name}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-emerald-50/85">{use}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
