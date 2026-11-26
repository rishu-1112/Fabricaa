import React from "react";

const FiltersBar = ({ selectedCategory, setSelectedCategory, sort, setSort }) => {
  const categories = ["All", "Cotton", "Silk", "Wool", "Synthetic", "Other"];
  const sortOptions = [
    { label: "Newest", value: "new" },
    { label: "Price: Low to High", value: "low" },
    { label: "Price: High to Low", value: "high" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltersBar;
