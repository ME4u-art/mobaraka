import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** For content that appears after a user action (filters, tabs): the viewport
   *  observer can miss elements mounted mid-scroll — animate on mount instead. */
  animateOnMount?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      {...(animateOnMount
        ? { animate: "visible" as const }
        : { whileInView: "visible" as const, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
