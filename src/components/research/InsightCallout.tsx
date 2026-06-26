"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type InsightCalloutProps = {
  title: string;
  children: ReactNode;
  tone?: "navy" | "cream" | "warning";
};

const toneClass = {
  navy: "border-[#172033] bg-[#172033] text-[#f6efe2]",
  cream: "border-[#172033]/12 bg-white/72 text-[#172033]",
  warning: "border-[#d1453b]/35 bg-[#fff4ee] text-[#172033]",
};

const accentColor = {
  navy: "bg-[#9cc7ab]",
  cream: "bg-[#2d7e67]",
  warning: "bg-[#d1453b]",
};

export function InsightCallout({
  title,
  children,
  tone = "cream",
}: InsightCalloutProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.aside
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, y: 20, scale: 0.96, perspective: 1000 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { 
        y: -4, 
        rotateX: 1.5, 
        rotateY: -1.5,
        boxShadow: "0 20px 35px rgba(23, 32, 51, 0.08)"
      }}
      className={`relative overflow-hidden rounded-lg border border-l-0 p-6 transition-colors duration-300 ${toneClass[tone]}`}
    >
      {/* Growing Left Accent Bar */}
      <motion.div
        initial={false}
        whileInView={isMounted && !reduceMotion ? { scaleY: 1 } : undefined}
        style={isMounted && !reduceMotion ? { scaleY: 0 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`absolute left-0 top-0 bottom-0 w-[4px] origin-top ${accentColor[tone]}`}
      />

      <div className="pl-1">
        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-70">
          Temuan
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight">{title}</h3>
        <div className="mt-4 text-base leading-8 opacity-85">{children}</div>
      </div>
    </motion.aside>
  );
}
