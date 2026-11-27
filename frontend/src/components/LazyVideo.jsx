import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Plays muted looping video only when in view; falls back to poster when reduced motion.
 */
export default function LazyVideo({
  src,
  poster,
  className = "",
  eager = false,
  "aria-label": ariaLabel,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (eager || reduceMotion) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "160px", threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, reduceMotion]);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    if (active) node.play().catch(() => {});
    else node.pause();
  }, [active, reduceMotion]);

  if (reduceMotion && poster) {
    return <img src={poster} alt="" className={className} aria-hidden={!ariaLabel} />;
  }

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      autoPlay={eager && !reduceMotion}
      aria-label={ariaLabel}
      className={className}
      {...props}
    />
  );
}
