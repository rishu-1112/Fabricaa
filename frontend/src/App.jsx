import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
const Products = lazy(() => import("./pages/Product"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));

function ScrollToPage() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToPage />
      <div className="paper min-h-screen flex flex-col text-stone-900">
        <a href="#main-content" className="sr-only z-50 rounded bg-white px-4 py-2 text-emerald-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-3">Skip to content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow scroll-mt-24">
          <Suspense fallback={<p role="status" className="p-6">Loading page…</p>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={
                <section className="space-y-5 px-6 py-20 text-center">
                  <h1 className="text-3xl font-semibold">Page not found</h1>
                  <Link to="/products" className="text-emerald-700 underline">Browse fabrics</Link>
                </section>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
