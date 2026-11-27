import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import g1 from "../assets/gallery1.jpg";
import g2 from "../assets/gallery2.jpg";
import g3 from "../assets/gallery3.jpg";
import g4 from "../assets/gallery4.jpg";
import ScrollReveal, { Stagger, StaggerItem } from "./ScrollRevealAbout";

const projects = [
  { image: g1, title: "Coastal Living", description: "A sample palette for relaxed layers and natural interiors.", category: "Linen" },
  { image: g2, title: "Alpine Layers", description: "A sample palette for textured, cooler-weather textiles.", category: "Wool" },
  { image: g3, title: "Studio Utility", description: "A sample palette for everyday bags and practical layers.", category: "Synthetic" },
  { image: g4, title: "Soft Structure", description: "A sample palette for specialty weaves and accessories.", category: "Other" },
];

export default function Gallery() {
  const dialog = useRef(null);
  const [index, setIndex] = useState(0);
  const active = projects[index];
  const [featured, ...rest] = projects;

  function openAt(position) {
    setIndex(position);
    dialog.current.showModal();
  }

  function move(offset) {
    setIndex((current) => (current + offset + projects.length) % projects.length);
  }

  return (
    <section className="surface px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 max-w-2xl">
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Inspiration</p>
          <h2 className="display-title theme-text text-4xl sm:text-5xl">Fabric inspiration</h2>
          <p className="theme-muted mt-4">Mood boards from sample palettes — open any story to explore related fabrics.</p>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ScrollReveal>
            <button
              type="button"
              onClick={() => openAt(0)}
              className="group relative block h-full min-h-[22rem] w-full overflow-hidden rounded-3xl text-left"
            >
              <img
                src={featured.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-0 p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">{featured.category}</span>
                <span className="mt-2 block text-3xl font-semibold text-white">{featured.title}</span>
              </span>
            </button>
          </ScrollReveal>

          <Stagger className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {rest.map((project, position) => (
              <StaggerItem key={project.title}>
                <button
                  type="button"
                  onClick={() => openAt(position + 1)}
                className="surface group flex h-full w-full overflow-hidden rounded-3xl border text-left transition hover:border-emerald-700/30"
              >
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    className="h-28 w-28 shrink-0 object-cover transition duration-500 group-hover:scale-105 sm:h-full sm:w-32 lg:h-28 lg:w-36"
                  />
                  <span className="flex flex-1 flex-col justify-center p-4">
                    <span className="theme-brand text-xs font-semibold uppercase tracking-[0.12em]">{project.category}</span>
                    <span className="theme-text mt-1 font-semibold">{project.title}</span>
                  </span>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="gallery-title"
        className="w-[min(90vw,48rem)] overflow-hidden rounded-2xl p-0 backdrop:bg-black/70"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
      >
        <div className="relative">
          <img src={active.image} alt={active.title} className="max-h-[55vh] w-full object-cover" />
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => dialog.current.close()}
            className="absolute right-3 top-3 rounded-full surface p-2 shadow"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 p-5">
          <h3 id="gallery-title" className="text-xl font-semibold">
            {active.title}
          </h3>
          <p>{active.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/products?category=${active.category}`}
              onClick={() => dialog.current.close()}
              className="font-semibold theme-brand underline"
            >
              Explore {active.category}
            </Link>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous project" onClick={() => move(-1)} className="rounded-lg border p-2">
                <ArrowLeft size={19} />
              </button>
              <button type="button" aria-label="Next project" onClick={() => move(1)} className="rounded-lg border p-2">
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
