import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import FiltersBar from "../components/FiltersBar";
import ScrollReveal from "../components/ScrollRevealProduct";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + Sort + Search
  useEffect(() => {
    let temp = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === "low") temp.sort((a, b) => a.price - b.price);
    if (sort === "high") temp.sort((a, b) => b.price - a.price);
    if (sort === "new")
      temp.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setFiltered(temp);
  }, [selectedCategory, sort, searchQuery, products]);

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm p-5 h-96">
      <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <ScrollReveal>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Explore Our Premium Fabrics
          </h1>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            Discover fabrics crafted for comfort, elegance, and quality.
          </p>
        </ScrollReveal>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center border border-gray-300 rounded-full px-5 py-3 w-full sm:w-2/3 lg:w-1/2 bg-white shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, material or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none px-3 text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <FiltersBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(8)
              .fill()
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 mt-20"
              >
                No products match your search or filters.
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
