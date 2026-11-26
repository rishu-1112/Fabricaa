import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Mock growth data for Recharts
const growthData = [
  { name: "Production", value: 85 },
  { name: "Eco Process", value: 92 },
  { name: "Customer Sat.", value: 95 },
  { name: "Export Growth", value: 40 },
];

// Framer variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const [showVideo, setShowVideo] = useState(false);

  const partners = [
    { name: "Arvind", logo: "/partners/arvind.png" },
    { name: "Raymond", logo: "/partners/raymond.png" },
    { name: "Reliance", logo: "/partners/reliance.png" },
    { name: "FabIndia", logo: "/partners/fabindia.png" },
    { name: "Lifestyle", logo: "/partners/lifestyle.png" },
  ];

  return (
    <section className="bg-white text-gray-800">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-indigo-100 py-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
          src="https://cdn.pixabay.com/video/2025/03/04/262484_tiny.mp4"
        />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-indigo-700 mb-4"
          >
            About Fabricaa
          </motion.h1>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            “We weave innovation with tradition, crafting textiles that define quality and comfort.”
          </motion.p>
        </div>
      </div>

      {/* STORY */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center"
      >
        <img
          src="https://img.freepik.com/premium-photo/textile-dyeing-factory-equipment-production-dyed-fabrics_124507-51494.jpg?w=1380"
          alt="Textile Factory"
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Our Journey</h2>
          <p className="text-gray-600 mb-4">
            Established in 1990, <strong>Fabricaa</strong> started as a small weaving unit with a dream —
            to redefine the Indian textile industry through technology and creativity. Today, we export to
            <strong> 35+ countries</strong>, serving top fashion brands.
          </p>
          <p className="text-gray-600">
            From cotton to silk — every thread we produce carries our legacy of craftsmanship and sustainability.
          </p>
        </div>
      </motion.div>

      {/* VALUES */}
      <div className="bg-indigo-50 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto text-center px-6"
        >
          <h2 className="text-3xl font-semibold text-indigo-700 mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Innovation", desc: "Combining tradition with technology to craft timeless textiles." },
              { title: "Quality", desc: "Strict testing and excellence in every detail." },
              { title: "Sustainability", desc: "Eco-friendly dyes, water recycling & ethical sourcing." },
              { title: "Customer Trust", desc: "Delivering consistency and reliability worldwide." },
            ].map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-indigo-700 mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MACHINERY VIDEO SECTION */}
      <div className="max-w-6xl mx-auto py-16 px-6 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-semibold text-indigo-700 mb-6"
        >
          Our State-of-the-Art Machinery
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-gray-600 max-w-2xl mx-auto mb-8"
        >
          See how innovation meets craftsmanship inside our factory — automated weaving, eco-dyeing & AI-driven quality control.
        </motion.p>
        <button
          onClick={() => setShowVideo(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition"
        >
          Watch Process Video
        </button>
      </div>

      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-11/12 md:w-2/3">
            <button
              className="absolute top-2 right-4 text-white text-2xl"
              onClick={() => setShowVideo(false)}
            >
              ✕
            </button>
            <video
              src="https://videos.pexels.com/video-files/3736926/3736926-uhd_2560_1440_25fps.mp4"
              controls
              autoPlay
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      )}

      {/* GROWTH CHART */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-10">Our Growth Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PARTNERS */}
      <div className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-10">Our Trusted Partners</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white border rounded-xl shadow p-6 w-40 hover:shadow-lg transition"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="mx-auto h-12 object-contain"
                onError={(e) => (e.target.style.display = "none")}
              />
              <p className="mt-3 font-semibold text-gray-700">{p.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 py-16 text-center text-white">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-semibold mb-4"
        >
          Join Our Vision
        </motion.h2>
        <p className="max-w-2xl mx-auto mb-8 text-indigo-100">
          Designers, suppliers, or distributors — become a part of our growing network and help us weave the future of textiles.
        </p>
        <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Become a Partner
        </button>
      </div>
    </section>
  );
}
