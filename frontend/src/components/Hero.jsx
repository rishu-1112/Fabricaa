import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/fabric-bg.mp4";
import heroPoster from "../assets/fabric-poster.webp";

export default function Hero() {
  return (
    <section className="bg-emerald-950 text-white">
      <div className="mx-auto grid max-w-7xl md:min-h-[35rem] md:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:py-20">
          <h1 className="display-title max-w-xl text-5xl leading-[.98] sm:text-6xl lg:text-7xl">
            Find the fabric for your next project.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-emerald-50/80">
            Compare fibres, save your favourites, and request a quote for the fabrics you need.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/products" className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 font-semibold text-emerald-950 hover:bg-emerald-50">
              Explore fabrics <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact?topic=swatches" className="rounded-full px-4 py-3 font-semibold text-white underline underline-offset-4">
              Ask about swatches
            </Link>
          </div>
        </div>
        <video
          src={heroVideo}
          poster={heroPoster}
          aria-label="Fabric close-up video"
          controls
          muted
          loop
          playsInline
          preload="none"
          className="h-64 w-full object-cover sm:h-80 md:h-full"
        />
      </div>
    </section>
  );
}
