import { apiUrl } from "../services/api";
import React, { useEffect, useState } from "react";

const Showcase = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const res = await fetch(apiUrl("/fabrics"));
        const data = await res.json();
        setFabrics(data);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFabrics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">Loading fabrics...</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">Latest Collection</h2>

      {fabrics.length === 0 ? (
        <p className="text-center text-gray-500">No fabrics found.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
          {fabrics.map((fabric) => (
            <div
              key={fabric._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={fabric.imageUrl}
                alt={fabric.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{fabric.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{fabric.description}</p>
                {/* <p className="font-semibold text-blue-600">₹{fabric.prices}</p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Showcase;
