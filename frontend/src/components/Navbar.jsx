import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Columns2, Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/newLOGO-Photoroom.png";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

const primaryLinks = [
  ["/", "Home"],
  ["/products", "Catalog"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

const moreLinks = [
  ["/products?saved=1", "Saved fabrics"],
  ["/compare", "Compare"],
  ["/cart", "Cart"],
  ["/checkout", "Checkout"],
  ["/swatches", "Swatch request"],
  ["/calculator", "Size / MOQ calculator"],
  ["/quotes", "Quote history"],
  ["/contact#location", "Mill map"],
];

function linkActive(pathname, search, to) {
  const [path, query = ""] = to.split("?");
  if (path !== pathname) return false;
  if (!query) {
    if (path === "/products") return !new URLSearchParams(search).get("saved");
    if (path === "/contact") return !new URLSearchParams(search).get("topic");
    return true;
  }
  const wanted = new URLSearchParams(query);
  const current = new URLSearchParams(search);
  return [...wanted.entries()].every(([key, value]) => current.get(key) === value);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const { pathname, search } = useLocation();
  const { totalItems, saved, comparison } = useCart();
  const reduceMotion = useReducedMotion();
  const close = () => {
    setOpen(false);
    setMoreOpen(false);
  };
  const linkClass = ({ isActive }) =>
    `hover-brand rounded-lg px-2 py-2 transition ${isActive ? "font-semibold theme-brand" : ""}`;
  const moreActive = moreLinks.some(([to]) => linkActive(pathname, search, to));

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!moreRef.current?.contains(event.target)) setMoreOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const first = moreRef.current?.querySelector('[role="menuitem"]');
    first?.focus();
  }, [moreOpen]);

  function onMoreKeyDown(event) {
    const items = [...(moreRef.current?.querySelectorAll('[role="menuitem"]') || [])];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!moreOpen) {
        setMoreOpen(true);
        return;
      }
      const next = items[(index + 1 + items.length) % items.length];
      next?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!moreOpen) {
        setMoreOpen(true);
        return;
      }
      const prev = items[(index - 1 + items.length) % items.length];
      prev?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <motion.nav
      aria-label="Main navigation"
      className="theme-nav sticky top-0 z-40 border-b backdrop-blur-md"
      initial={reduceMotion ? false : { y: -16, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <NavLink to="/" className="flex min-w-0 items-center gap-2" onClick={close}>
          <img src={logo} alt="" className="h-10 w-auto sm:h-12" />
          <span className="display-title text-2xl">Fabricaa</span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
              {label}
            </NavLink>
          ))}

          <div className="relative" ref={moreRef} onKeyDown={onMoreKeyDown}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-controls="more-menu"
              onClick={() => setMoreOpen((value) => !value)}
              className={`hover-brand inline-flex items-center gap-1 rounded-lg px-2 py-2 transition ${
                moreActive || moreOpen ? "font-semibold theme-brand" : "theme-muted"
              }`}
            >
              More
              <ChevronDown size={16} className={`transition ${moreOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  id="more-menu"
                  role="menu"
                  aria-label="More pages"
                  className="surface absolute right-0 top-full z-50 mt-2 min-w-[13rem] overflow-hidden rounded-2xl border py-2 shadow-lg"
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {moreLinks.map(([to, label]) => (
                    <Link
                      key={to}
                      role="menuitem"
                      tabIndex={-1}
                      to={to}
                      onClick={close}
                      className={`menu-hover block px-4 py-2.5 text-sm outline-none transition ${
                        linkActive(pathname, search, to) ? "font-semibold theme-brand" : "theme-muted"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            to="/compare"
            onClick={close}
            aria-label={`Compare fabrics, ${comparison.length} selected`}
            className="hover-brand relative p-2 transition"
          >
            <Columns2 size={21} />
            <AnimatePresence>
              {comparison.length > 0 && (
                <motion.span
                  key={comparison.length}
                  aria-hidden="true"
                  className="badge-count absolute -right-1 -top-1 rounded-full px-1.5 text-xs"
                  initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  {comparison.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Link
            to="/products?saved=1"
            onClick={close}
            aria-label={`Saved fabrics, ${saved.length}`}
            className="hover-brand relative p-2 transition"
          >
            <Heart size={21} />
            <AnimatePresence>
              {saved.length > 0 && (
                <motion.span
                  key={saved.length}
                  aria-hidden="true"
                  className="badge-count absolute -right-1 -top-1 rounded-full px-1.5 text-xs"
                  initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  {saved.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <NavLink
            to="/cart"
            onClick={close}
            aria-label={`Fabric cart, ${totalItems} items`}
            className="hover-brand relative p-2 transition"
          >
            <ShoppingCart size={21} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  aria-hidden="true"
                  className="badge-count absolute -right-1 -top-1 rounded-full px-1.5 text-xs"
                  initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="p-2 lg:hidden"
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="grid gap-1 border-t border-[color:var(--fb-border)] px-4 py-3 lg:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {primaryLinks.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={linkClass} onClick={close}>
                {label}
              </NavLink>
            ))}
            <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.14em] theme-muted">More</p>
            {moreLinks.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                className={`hover-brand rounded-lg px-2 py-2 transition ${
                  linkActive(pathname, search, to) ? "font-semibold theme-brand" : "theme-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
