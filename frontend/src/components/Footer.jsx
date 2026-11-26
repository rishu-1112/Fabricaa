import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="display-title text-2xl">Fabricaa</Link>
          <p className="text-sm text-emerald-100/75">© {new Date().getFullYear()} Fabricaa</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link className="hover:underline" to="/products">Browse fabrics</Link>
          <Link className="hover:underline" to="/contact?topic=swatches">Swatch inquiries</Link>
          <Link className="hover:underline" to="/about">About</Link>
        </nav>
      </div>
    </footer>
  );
}
