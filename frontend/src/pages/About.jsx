import { useRef } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import storyImage from "../assets/gallery1.jpg";
import processVideo from "../assets/processFibre.mp4";
import MillMap from "../components/MillMap";
import ScrollReveal, { Stagger, StaggerItem } from "../components/ScrollRevealAbout";

const growthData = [
  { name: "Production", value: 85 },
  { name: "Eco process", value: 92 },
  { name: "Satisfaction", value: 95 },
  { name: "Export", value: 40 },
];

const values = [
  { title: "Innovation", desc: "Combining tradition with technology to craft timeless textiles." },
  { title: "Quality", desc: "Strict testing and clear specifications in every detail." },
  { title: "Sustainability", desc: "Eco-minded dyes, water care, and responsible sourcing." },
  { title: "Trust", desc: "Reliable lead times and consistent communication worldwide." },
];

const audiences = [
  ["Design studios", "Compare drape and weight for upcoming collections."],
  ["Small-batch makers", "Organize shortlist quantities before requesting a quote."],
  ["Sourcing teams", "Send a consolidated inquiry for multiple fabric types."],
];

export default function About() {
  const videoDialog = useRef(null);
  const video = useRef(null);

  return (
    <section className="paper">
      <div className="px-6 py-20 text-white sm:px-10" style={{ backgroundColor: "var(--fb-hero)" }}>
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">About</p>
          <h1 className="display-title text-5xl sm:text-6xl">About Fabricaa</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-50/85">
            We weave innovation with tradition, crafting a catalog for comparing textiles and requesting quotes.
          </p>
        </ScrollReveal>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-10 md:grid-cols-2">
        <ScrollReveal>
          <img src={storyImage} alt="Textile textures" loading="lazy" className="rounded-3xl object-cover shadow-sm" />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] theme-brand">Our journey</p>
          <h2 className="display-title text-4xl theme-text">Built for fabric decisions</h2>
          <p className="mt-4 theme-muted">
            Fabricaa is a textile showcase for comparing materials, collecting fabrics, and requesting quotes for design
            and sourcing projects.
          </p>
          <p className="mt-3 theme-muted">
            Use sample fabric specifications to compare composition, weight, and width as you plan a collection.
          </p>
        </ScrollReveal>
      </div>

      <div className="surface border-y px-6 py-16 sm:px-10" style={{ borderColor: "var(--fb-border)" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-10 max-w-2xl">
            <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Values</p>
            <h2 className="display-title theme-text text-4xl">Our core values</h2>
          </ScrollReveal>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, desc }, index) => (
              <StaggerItem key={title}>
                <p className="text-xs font-bold tracking-[0.14em] theme-brand">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold theme-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed theme-muted">{desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:px-10">
        <ScrollReveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] theme-brand">Process</p>
          <h2 className="display-title text-4xl theme-text">Inside the textile process</h2>
          <p className="mx-auto mt-4 max-w-2xl theme-muted">
            Watch a sample textile production video for a closer look at fabric processing.
          </p>
          <button type="button" onClick={() => videoDialog.current.showModal()} className="btn-primary mt-8">
            Watch process video
          </button>
        </ScrollReveal>
      </div>

      <dialog
        ref={videoDialog}
        aria-labelledby="process-title"
        onClose={() => video.current?.pause()}
        className="w-[min(90vw,52rem)] rounded-2xl p-4 backdrop:bg-black/75"
      >
        <div className="mb-3 flex justify-between gap-3">
          <h2 id="process-title" className="font-semibold theme-text">
            Sample process video
          </h2>
          <button type="button" className="font-semibold theme-brand underline" onClick={() => videoDialog.current.close()}>
            Close
          </button>
        </div>
        <video ref={video} src={processVideo} controls playsInline preload="none" className="max-h-[70vh] w-full rounded-lg" />
      </dialog>

      <div className="surface-muted px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-8 text-center">
            <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Metrics</p>
            <h2 className="display-title theme-text text-4xl">Illustrative textile metrics</h2>
            <p className="theme-muted mt-3 text-sm">Example dashboard figures for the showcase — not live production data.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08} className="surface rounded-3xl border p-4 shadow-sm sm:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fb-border)" />
                <XAxis dataKey="name" stroke="var(--fb-muted)" />
                <YAxis stroke="var(--fb-muted)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    borderColor: "var(--fb-border)",
                    background: "var(--fb-surface)",
                    color: "var(--fb-ink)",
                  }}
                />
                <Bar dataKey="value" fill="var(--fb-brand)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ScrollReveal>
        </div>
      </div>

      <section className="paper mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <ScrollReveal className="mb-8">
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Audience</p>
          <h2 className="display-title theme-text text-4xl">Who the catalog is for</h2>
        </ScrollReveal>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {audiences.map(([audience, description]) => (
            <StaggerItem key={audience}>
              <article className="surface h-full rounded-3xl border p-6 shadow-sm">
                <h3 className="theme-text text-lg font-semibold">{audience}</h3>
                <p className="theme-muted mt-2 text-sm leading-relaxed">{description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <div className="paper">
        <MillMap />
      </div>

      <div className="px-6 py-16 text-center text-white sm:px-10" style={{ backgroundColor: "var(--fb-hero)" }}>
        <ScrollReveal className="mx-auto max-w-2xl">
          <h2 className="display-title text-4xl sm:text-5xl">Join our vision</h2>
          <p className="mx-auto mt-4 mb-8 max-w-xl text-emerald-50/85">
            Designers, suppliers, or distributors — become part of the network and help shape the next textile projects.
          </p>
          <Link
            to="/contact?topic=partnership"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold transition"
            style={{ backgroundColor: "var(--fb-surface)", color: "var(--fb-ink)" }}
          >
            Become a partner
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
