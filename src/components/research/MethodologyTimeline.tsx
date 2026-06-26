"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type TimelineItem = {
  title: string;
  period: string;
  description: string;
  tone?: "navy" | "green" | "red" | "purple" | "gray";
};

const dotClass = {
  navy: "bg-[#172033]",
  green: "bg-[#2f6f45]",
  red: "bg-[#d1453b]",
  purple: "bg-[#6f4aa8]",
  gray: "bg-[#6b7280]",
};

export function MethodologyTimeline({ items }: { items: TimelineItem[] }) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ol className="relative space-y-5 pl-6">
      {/* Animated vertical line */}
      <motion.div
        initial={false}
        whileInView={isMounted && !reduceMotion ? { scaleY: 1 } : undefined}
        style={isMounted && !reduceMotion ? { scaleY: 0 } : undefined}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#172033]/16 origin-top"
      />

      {items.map((item, index) => (
        <li key={`${item.title}-${item.period}`} className="relative">
          <motion.span
            initial={false}
            whileInView={isMounted && !reduceMotion ? { scale: 1 } : undefined}
            style={isMounted && !reduceMotion ? { scale: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: index * 0.15 + 0.3 }}
            className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ${
              dotClass[item.tone ?? "navy"]
            }`}
            aria-hidden="true"
          />
          <motion.div
            initial={false}
            whileInView={isMounted && !reduceMotion ? { opacity: 1, x: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, x: -16 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4, ease: "easeOut" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#172033]/55">
              {item.period}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[#172033]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#172033]/70">
              {item.description}
            </p>
          </motion.div>
        </li>
      ))}
    </ol>
  );
}
