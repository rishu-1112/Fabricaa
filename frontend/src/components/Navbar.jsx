import { useState } from "react";
import { Columns2, Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/newLOGO-Photoroom.png";
import { useCart } from "../context/CartContext";

const links = [
  ["/", "Home"],
  ["/products", "Catalog"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems, saved, comparison } = useCart();
  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => `rounded px-2 py-2 hover:text-emerald-700 ${isActive ? "font-semibold text-emerald-700" : "text-gray-700"}`;

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <NavLink to="/" className="flex min-w-0 items-center gap-2" onClick={close}>
          <img src={logo} alt="" className="h-10 w-auto sm:h-12" />
          <span className="display-title text-2xl text-emerald-950">Fabricaa</span>
        </NavLink>
        <div className="hidden gap-5 md:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={linkClass}>{label}</NavLink>)}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/compare" onClick={close} aria-label={`Compare fabrics, ${comparison.length} selected`} className="relative p-2 text-gray-700 hover:text-emerald-700">
            <Columns2 size={21} />
            {comparison.length > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 rounded-full bg-emerald-700 px-1.5 text-xs text-white">{comparison.length}</span>}
          </Link>
          <Link to="/products?saved=1" onClick={close} aria-label={`Saved fabrics, ${saved.length}`} className="p-2 text-gray-700 hover:text-emerald-700"><Heart size={21} /></Link>
          <NavLink to="/cart" onClick={close} aria-label={`Fabric cart, ${totalItems} items`} className="relative p-2 text-gray-700 hover:text-emerald-700">
            <ShoppingCart size={21} />
            {totalItems > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 rounded-full bg-emerald-700 px-1.5 text-xs text-white">{totalItems}</span>}
          </NavLink>
          <button type="button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-navigation" className="p-2 md:hidden">
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className={`border-t px-4 py-2 md:hidden ${open ? "grid" : "hidden"}`}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={linkClass} onClick={close}>{label}</NavLink>)}
      </div>
    </nav>
  );
}
