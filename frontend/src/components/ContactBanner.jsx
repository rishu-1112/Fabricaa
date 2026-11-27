import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-white sm:px-10"
      style={{ backgroundColor: "var(--fb-hero)" }}
    >
      <div
        className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--fb-brand) 25%, transparent)" }}
        aria-hidden="true"
      />
      <motion.div
        className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Next step</p>
          <h2 className="display-title text-4xl sm:text-5xl lg:text-6xl">Planning a fabric project?</h2>
          <p className="mt-4 text-lg text-emerald-50/85">
            Ask about swatches, bulk quantities, or a sourcing partnership.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 self-start lg:self-auto">
          <Link
            to="/swatches"
            className="inline-flex items-center gap-3 rounded-full px-6 py-3.5 font-semibold transition"
            style={{ backgroundColor: "var(--fb-surface)", color: "var(--fb-ink)" }}
          >
            Request swatches <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-3 rounded-full border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
          >
            Size / MOQ calculator
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
