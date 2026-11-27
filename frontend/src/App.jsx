import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ThemeLoader from "./components/ThemeLoader";

import Home from "./pages/Home";
const Products = lazy(() => import("./pages/Product"));
const Compare = lazy(() => import("./pages/Compare"));
const Shortlist = lazy(() => import("./pages/Shortlist"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Calculator = lazy(() => import("./pages/Calculator"));
const SwatchRequest = lazy(() => import("./pages/SwatchRequest"));
const QuoteHistory = lazy(() => import("./pages/QuoteHistory"));

function ScrollToPage() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<ThemeLoader fullPage label="Loading page…" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/shortlist" element={<Shortlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/swatches" element={<SwatchRequest />} />
            <Route path="/quotes" element={<QuoteHistory />} />
            <Route
              path="*"
              element={
                <section className="space-y-5 px-6 py-20 text-center">
                  <h1 className="display-title text-4xl theme-text">Page not found</h1>
                  <Link to="/products" className="font-semibold theme-brand underline">
                    Browse fabrics
                  </Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToPage />
      <div className="paper flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only z-50 rounded surface px-4 py-2 theme-text focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow scroll-mt-24">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
