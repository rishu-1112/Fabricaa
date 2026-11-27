import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FabricImage from "./FabricImage";
import { getAllFabrics } from "../services/fabricService";
import ProductCard from "./ProductCard";
import { isDemoMode } from "../services/catalog";
import useCatalog from "../services/useCatalog";
import ScrollReveal, { Stagger, StaggerItem } from "./ScrollRevealAbout";
import ThemeLoader from "./ThemeLoader";

export default function Showcase() {
  const { products, status } = useCatalog();
  const [swatches, setSwatches] = useState([]);
  useEffect(() => {
    if (isDemoMode) return;
    const controller = new AbortController();
    getAllFabrics(controller.signal)
      .then((fabrics) => {
        if (!controller.signal.aborted && Array.isArray(fabrics)) setSwatches(fabrics);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const featured = [...products]
    .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
    .slice(0, 4);

  return (
    <section className="paper px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Featured</p>
            <h2 className="display-title theme-text text-4xl sm:text-5xl">Featured fabrics</h2>
            {status === "sample" && (
              <p className="theme-muted mt-3 text-sm">Sample collection with illustrative prices and availability.</p>
            )}
          </div>
          <Link
            className="menu-hover rounded-full border border-[color:var(--fb-border)] px-4 py-2 text-sm font-semibold theme-brand transition"
            to="/products"
          >
            Browse all fabrics →
          </Link>
        </ScrollReveal>
        {status === "loading" ? (
          <ThemeLoader label="Loading featured fabrics…" />
        ) : status === "empty" || status === "unavailable" ? (
          <p className="theme-muted">
            {status === "empty" ? "There are no live fabrics yet." : "The live catalog is temporarily unavailable."}{" "}
            <Link to="/products?sample=1" className="theme-brand underline">
              Browse sample fabrics
            </Link>
          </p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
        {swatches.length > 0 && (
          <section className="mt-20">
            <ScrollReveal>
              <h2 className="mb-8 display-title text-3xl theme-text sm:text-4xl">Mill swatches</h2>
            </ScrollReveal>
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {swatches.map((swatch) => (
                <StaggerItem key={swatch._id}>
                  <article className="overflow-hidden rounded-2xl border border-[color:var(--fb-border)] surface transition hover:shadow-md">
                    <FabricImage
                      src={swatch.imageUrl}
                      category={swatch.category}
                      alt=""
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold theme-text">{swatch.name}</h3>
                      <p className="mt-1 text-sm theme-muted">{swatch.description || swatch.material}</p>
                      <Link
                        to={`/contact?topic=swatches&fabric=${encodeURIComponent(swatch.name)}`}
                        className="mt-3 inline-block text-sm font-semibold theme-brand underline"
                      >
                        Ask about this swatch
                      </Link>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </section>
  );
}
