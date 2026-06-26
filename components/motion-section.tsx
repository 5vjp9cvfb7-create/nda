"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function MotionSection({ children, className, delay = 0, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      className={cn("section-shell py-16 sm:py-20", className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}
