import React from "react";
import { CheckCircle } from "lucide-react";

const WhyUs = () => {
  const points = [
    "Premium Quality Fabrics",
    "Eco-Friendly Dyeing Processes",
    "On-Time Global Delivery",
    "Customizable Fabric Designs",
  ];

  return (
    <section className="bg-gray-100 py-20 text-center">
      <h2 className="text-3xl font-bold mb-8">Why Choose FABRICAA?</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-6">
        {points.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center gap-3 bg-white p-5 rounded-xl shadow hover:shadow-md transition"
          >
            <CheckCircle className="text-blue-600 w-6 h-6" />
            <p className="text-lg font-medium">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
