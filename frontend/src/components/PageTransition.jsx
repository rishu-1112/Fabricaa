import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  );
}
