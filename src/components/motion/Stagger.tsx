import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerGroup({
  children,
  className,
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  /** For content that appears after a user action (filters, tabs): the viewport
   *  observer can miss elements mounted mid-scroll and leave them at opacity 0 —
   *  animate immediately on mount instead. */
  animateOnMount?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...(animateOnMount
        ? { animate: "visible" as const }
        : { whileInView: "visible" as const, viewport: { once: true, margin: "-80px" } })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
