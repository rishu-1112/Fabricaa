import React from "react";
import heroVideo from "../assets/fabric-bg.mp4";
import heroPoster from "../assets/fabric-poster.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={heroPoster}
        className="absolute inset-0 w-full h-full object-cover"
        src={heroVideo}
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          Innovating Textiles with Style & Soul
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Discover a world of premium fabrics, colors, and textures curated for modern fashion and design.
        </p>
        <Link to="/products" className="inline-block rounded-full bg-blue-700 px-8 py-3 font-medium text-white transition hover:bg-blue-800">Explore Fabrics</Link>
      </div>
    </section>
  );
};

export default Hero;
