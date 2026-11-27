import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/fabric-bg.mp4";
import heroPoster from "../assets/fabric-poster.webp";
import LazyVideo from "./LazyVideo";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden text-white" style={{ backgroundColor: "var(--fb-hero)" }}>
      <LazyVideo
        src={heroVideo}
        poster={heroPoster}
        eager
        aria-label="Fabric close-up video"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/55 to-emerald-950/25" aria-hidden="true" />

      <div className="relative z-10 w-full px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fade(0)} className="display-title mb-6 text-4xl text-white sm:text-5xl lg:text-6xl">
            Fabricaa
          </motion.p>
          <motion.h1
            {...fade(0.1)}
            className="max-w-3xl text-3xl font-medium leading-tight tracking-tight text-emerald-50 sm:text-4xl lg:text-5xl"
          >
            Find the fabric for your next project.
          </motion.h1>
          <motion.p {...fade(0.18)} className="mt-5 max-w-lg text-base leading-relaxed text-emerald-50/85 sm:text-lg">
            Compare fibres, save favourites, and request a quote when you are ready.
          </motion.p>
          <motion.div {...fade(0.26)} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3.5 font-semibold transition"
              style={{ backgroundColor: "var(--fb-surface)", color: "var(--fb-ink)" }}
            >
              Explore fabrics <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/contact?topic=swatches"
              className="rounded-full px-2 py-3 font-semibold text-white underline decoration-emerald-300/60 underline-offset-4 transition hover:decoration-white"
            >
              Ask about swatches
            </Link>
          </motion.div>
        </div>
      </div>

      {!reduceMotion && (
        <motion.a
          href="#browse"
          className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Scroll
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </motion.span>
        </motion.a>
      )}
    </section>
  );
}
