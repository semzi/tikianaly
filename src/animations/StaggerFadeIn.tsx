import { motion } from "framer-motion";
import React from "react";
import type { ReactNode } from "react";

interface StaggerFadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export default function StaggerFadeIn({
  children,
  delay = 0,
  duration = 0.6,
  stagger = 0.15,
}: StaggerFadeInProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
