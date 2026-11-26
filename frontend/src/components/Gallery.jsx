import React from "react";
import g1 from "../assets/gallery1.jpg";
import g2 from "../assets/gallery2.jpg";
import g3 from "../assets/gallery3.jpg";
import g4 from "../assets/gallery4.jpg";

const Gallery = () => {
  const images = [g1, g2, g3, g4];

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">Fabric Gallery</h2>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Fabric ${i}`}
            className="rounded-xl shadow hover:scale-105 transition object-cover h-64 w-full"
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
