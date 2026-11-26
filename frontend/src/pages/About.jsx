import { Link } from "react-router-dom";
import storyImage from "../assets/gallery1.jpg";
import processVideo from "../assets/processFibre.mp4";
import React, { useRef } from "react";
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
  const videoDialog = useRef(null);
  const video = useRef(null);

  return (
    <section className="bg-white text-gray-800">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-emerald-100 py-20">
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-emerald-700 mb-4"
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
          src={storyImage}
          alt="Textile textures"
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Our Journey</h2>
          <p className="text-gray-600 mb-4">
            Fabricaa is a textile showcase for comparing materials, collecting fabrics, and requesting quotes for design and sourcing projects.
          </p>
          <p className="text-gray-600">
            Use sample fabric specifications to compare composition, weight, and width as you plan a collection.
          </p>
        </div>
      </motion.div>

      {/* VALUES */}
      <div className="bg-emerald-50 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto text-center px-6"
        >
          <h2 className="text-3xl font-semibold text-emerald-700 mb-10">Our Core Values</h2>
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
                <h3 className="text-xl font-bold text-emerald-700 mb-2">{v.title}</h3>
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
          className="text-3xl font-semibold text-emerald-700 mb-6"
        >
          Inside the Textile Process
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Watch a sample textile production video for a closer look at fabric processing.
        </motion.p>
        <button
          onClick={() => videoDialog.current.showModal()}
          className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition"
        >
          Watch Process Video
        </button>
      </div>

      <dialog ref={videoDialog} aria-labelledby="process-title" onClose={() => video.current.pause()} className="w-[min(90vw,52rem)] rounded-xl p-4 backdrop:bg-black/75">
        <div className="mb-3 flex justify-between gap-3">
          <h2 id="process-title" className="font-semibold">Sample Process Video</h2>
          <button type="button" className="text-emerald-700 underline" onClick={() => videoDialog.current.close()}>Close</button>
        </div>
        <video ref={video} src={processVideo} controls playsInline preload="none" className="max-h-[70vh] w-full rounded-lg" />
      </dialog>

      {/* GROWTH CHART */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-10">Illustrative Textile Metrics</h2>
          <p className="mb-5 text-sm text-gray-600">Example dashboard data.</p>
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

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-semibold text-emerald-700">Who the Catalog Is For</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Design studios", "Compare drape and weight for upcoming collections."],
            ["Small-batch makers", "Organize shortlist quantities before requesting a quote."],
            ["Sourcing teams", "Send a consolidated inquiry for multiple fabric types."],
          ].map(([audience, description]) => (
            <article key={audience} className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold">{audience}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-emerald-600 py-16 text-center text-white">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-semibold mb-4"
        >
          Join Our Vision
        </motion.h2>
        <p className="max-w-2xl mx-auto mb-8 text-emerald-100">
          Designers, suppliers, or distributors — become a part of our growing network and help us weave the future of textiles.
        </p>
        <Link to="/contact?topic=partnership" className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-emerald-700 hover:bg-gray-200">Become a Partner</Link>
      </div>
    </section>
  );
}
