import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ScrollReveal = ({
  children,
  delay = 0.1,
  direction = "up",
  duration = 0.8,
  distance = 60,
  threshold = 0.2,
  once = true,
  scale = 1,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: threshold,
    rootMargin: "-60px 0px",
  });

  // Define smoother motion variants
  const variants = {
    hidden: {
      opacity: 0,
      y:
        direction === "up"
          ? distance
          : direction === "down"
          ? -distance
          : 0,
      x:
        direction === "left"
          ? distance
          : direction === "right"
          ? -distance
          : 0,
      scale: direction === "scale" ? 0.9 : 1,
      filter: "blur(5px)", // slight blur for elegance
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: scale,
      filter: "blur(0px)",
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for extra smoothness
      },
    },
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
