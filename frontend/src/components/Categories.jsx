import React from "react";
import cotton from "../assets/cotton.jpg";
import silk from "../assets/silk.jpg";
import denim from "../assets/denim.jpg";

const Categories = () => {
  const fabrics = [
    { name: "Cotton", img: cotton },
    { name: "Silk", img: silk },
    { name: "Denim", img: denim },
  ];

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">Our Fabric Range</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {fabrics.map((fab, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img src={fab.img} alt={fab.name} className="w-full h-64 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{fab.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
