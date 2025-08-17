import { motion } from "framer-motion";
import React, { type ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export default function StaggerChildren({
  children,
  delay = 0,
  duration = 0.6,
  stagger = 0.15,
  className = "",
}: StaggerChildrenProps) {
  const container = {
    hidden: { opacity: 1 }, // keep parent visible
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
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
