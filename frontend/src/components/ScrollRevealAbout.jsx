import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const offsets = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  as = "div",
  style,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const offset = offsets[direction] || offsets.up;

  if (reduceMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
