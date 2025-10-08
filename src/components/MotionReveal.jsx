// src/components/MotionReveal.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll'da görünce yumuşakça beliren sarmalayıcı.
 * delay: ms cinsinden gecikme (örn. 80, 160)
 * once:  true → bir kez animasyon; false → her görünüşte
 * y:     dikeyden geliş (px)  | opacity: 0→1
 */
export default function MotionReveal({ children, delay = 0, once = true, y = 16 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15, once });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
