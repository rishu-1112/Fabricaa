import { Link } from "react-router-dom";
import processVideo from "../assets/processFibre.mp4";

const steps = [
  { title: "Spinning", description: "Transforming raw fibres into fine threads." },
  { title: "Weaving", description: "Interlacing threads to form durable fabric." },
  { title: "Dyeing", description: "Applying colour to achieve the intended shade." },
  { title: "Finishing", description: "Refining the fabric’s texture, sheen, and feel." },
];

export default function Process() {
  return (
    <section className="paper px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display-title text-4xl">From Fibre to Fabric</h2>
          <Link to="/about" className="font-semibold text-emerald-800 underline underline-offset-4">Learn about Fabricaa</Link>
        </div>
        <video
          src={processVideo}
          aria-label="Textile process video"
          controls
          playsInline
          preload="metadata"
          className="mb-6 aspect-video max-h-96 w-full rounded-xl bg-emerald-950 object-contain"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description }) => (
            <li key={title} className="rounded-xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-stone-600">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
