import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import g1 from "../assets/gallery1.jpg";
import g2 from "../assets/gallery2.jpg";
import g3 from "../assets/gallery3.jpg";
import g4 from "../assets/gallery4.jpg";

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

  function move(offset) {
    setIndex((current) => (current + offset + projects.length) % projects.length);
  }

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 display-title text-4xl">Fabric Inspiration</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, position) => (
            <button key={project.title} type="button" onClick={() => { setIndex(position); dialog.current.showModal(); }} className="group overflow-hidden rounded-xl border border-gray-200 text-left shadow-sm">
              <img src={project.image} alt="" loading="lazy" className="h-52 w-full object-cover transition group-hover:scale-105" />
              <span className="relative block bg-white p-4 font-semibold">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
      <dialog ref={dialog} aria-labelledby="gallery-title" className="w-[min(90vw,48rem)] overflow-hidden rounded-2xl p-0 backdrop:bg-black/70"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}>
        <div className="relative">
          <img src={active.image} alt={active.title} className="max-h-[55vh] w-full object-cover" />
          <button type="button" aria-label="Close gallery" onClick={() => dialog.current.close()} className="absolute right-3 top-3 rounded-full bg-white p-2"><X size={20} /></button>
        </div>
        <div className="space-y-3 p-5">
          <h3 id="gallery-title" className="text-xl font-semibold">{active.title}</h3>
          <p>{active.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to={`/products?category=${active.category}`} onClick={() => dialog.current.close()} className="font-semibold text-emerald-700 underline">Explore {active.category}</Link>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous project" onClick={() => move(-1)} className="rounded-lg border p-2"><ArrowLeft size={19} /></button>
              <button type="button" aria-label="Next project" onClick={() => move(1)} className="rounded-lg border p-2"><ArrowRight size={19} /></button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
