import { Link } from "react-router-dom";

const explore = [
  ["/products", "Catalog"],
  ["/products?saved=1", "Saved fabrics"],
  ["/compare", "Compare"],
  ["/calculator", "Size / MOQ calculator"],
  ["/swatches", "Swatch request"],
  ["/cart", "Cart"],
];

const company = [
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/quotes", "Quote history"],
  ["/contact#location", "Mill map"],
  ["/checkout", "Checkout"],
];

export default function Footer() {
  return (
    <footer className="theme-footer border-t border-emerald-900/40 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to="/" className="display-title text-3xl transition hover:text-white">
            Fabricaa
          </Link>
          <p className="mt-3 max-w-sm text-sm text-emerald-100/70">
            Textile catalog for comparing fibres, saving favourites, and requesting quotes.
          </p>
          <p className="mt-4 text-sm text-emerald-100/55">© {new Date().getFullYear()} Fabricaa</p>
        </div>
        <nav aria-label="Explore">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Explore</p>
          <ul className="space-y-2 text-sm">
            {explore.map(([to, label]) => (
              <li key={to}>
                <Link className="transition hover:text-white hover:underline" to={to}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Company</p>
          <ul className="space-y-2 text-sm">
            {company.map(([to, label]) => (
              <li key={to}>
                <Link className="transition hover:text-white hover:underline" to={to}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
