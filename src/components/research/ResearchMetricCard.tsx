"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type ResearchMetricCardProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  caption?: string;
  badge?: ReactNode;
  className?: string;
};

export function ResearchMetricCard({
  label,
  value,
  unit,
  caption,
  badge,
  className,
}: ResearchMetricCardProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, scale: 1 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, scale: 0.92 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={reduceMotion ? undefined : { 
        y: -4, 
        boxShadow: "0 20px 35px rgba(45, 126, 103, 0.08)",
        borderColor: "rgba(45, 126, 103, 0.25)"
      }}
      className={cn(
        "rounded-lg border border-[#172033]/12 bg-white/72 p-5 shadow-[0_16px_45px_rgba(23,32,51,0.08)] transition-all duration-300 hover:bg-white",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#172033]/62">
          {label}
        </p>
        {badge}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-[#172033]">
          {value}
        </p>
        {unit && (
          <span className="text-sm font-semibold text-[#172033]/55">
            {unit}
          </span>
        )}
      </div>
      {caption && (
        <p className="mt-3 text-sm leading-6 text-[#172033]/68">
          {caption}
        </p>
      )}
    </motion.section>
  );
}
