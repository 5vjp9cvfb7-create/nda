"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/types";

function Counter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1100, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => setDisplay(Math.round(latest)));
    motionValue.set(value);
    return unsubscribe;
  }, [motionValue, spring, value]);

  return <span>{display.toLocaleString("en-IN")}</span>;
}

export function StatCounters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.key}
          className="glass rounded-lg p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: index * 0.08 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">{stat.label}</p>
          <p className="mt-3 text-4xl font-black text-ink dark:text-white">
            {inView ? <Counter value={stat.value} /> : 0}
            {stat.suffix}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
