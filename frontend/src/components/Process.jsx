import React from "react";
import processVdo from "../assets/processFibre.mp4";


const steps = [
  { title: "Spinning", desc: "Transforming raw fibers into fine threads." },
  { title: "Weaving", desc: "Interlacing threads to form durable fabric." },
  { title: "Dyeing", desc: "Adding rich colors through eco-friendly processes." },
  { title: "Finishing", desc: "Perfecting texture, shine, and softness." },
];

const Process = () => (
  <section className="relative overflow-hidden bg-gray-50 py-20">
    {/* Background video (decorative) */}
    <video
      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      src={processVdo}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
    {/* optional overlay to darken the video for better text contrast */}
    <div className="absolute inset-0 bg-black/20 pointer-events-none" />

    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-center mb-10">Our Crafting Process</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6 text-center">
        {steps.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
