import { Link } from "react-router-dom";
import processVideo from "../assets/processFibre.mp4";
import heroPoster from "../assets/fabric-poster.webp";
import LazyVideo from "./LazyVideo";
import ScrollReveal, { Stagger, StaggerItem } from "./ScrollRevealAbout";

const steps = [
  { step: "01", title: "Spinning", description: "Transforming raw fibres into fine threads." },
  { step: "02", title: "Weaving", description: "Interlacing threads to form durable fabric." },
  { step: "03", title: "Dyeing", description: "Applying colour to achieve the intended shade." },
  { step: "04", title: "Finishing", description: "Refining the fabric’s texture, sheen, and feel." },
];

export default function Process() {
  return (
    <section className="px-6 py-24 text-white sm:px-10" style={{ backgroundColor: "var(--fb-hero)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <ScrollReveal>
          <div className="overflow-hidden rounded-3xl" style={{ backgroundColor: "var(--fb-footer)" }}>
            <LazyVideo
              src={processVideo}
              poster={heroPoster}
              aria-label="Textile process video"
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Craft</p>
            <h2 className="display-title text-4xl sm:text-5xl">From fibre to fabric</h2>
            <p className="mt-4 max-w-md text-emerald-50/80">
              A clear path from yarn to finished cloth — watch the process, then explore each stage.
            </p>
            <Link to="/about" className="mt-5 inline-block font-semibold text-emerald-200 underline underline-offset-4">
              Open the full process video
            </Link>
          </ScrollReveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2" delay={0.08}>
            {steps.map(({ step, title, description }) => (
              <StaggerItem key={title}>
                <p className="text-xs font-bold tracking-[0.14em] text-emerald-400">{step}</p>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-50/75">{description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
