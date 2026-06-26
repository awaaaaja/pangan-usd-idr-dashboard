"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type ChartNarrativeCardProps = {
  title: string;
  kicker?: string;
  unit: string;
  period: string;
  caption: string;
  source: string;
  summary: string;
  children: ReactNode;
  action?: ReactNode;
};

export function ChartNarrativeCard({
  title,
  kicker,
  unit,
  period,
  caption,
  source,
  summary,
  children,
  action,
}: ChartNarrativeCardProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, y: 24, scale: 0.98 } : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { 
        y: -4, 
        boxShadow: "0 25px 50px -12px rgba(45, 126, 103, 0.15)"
      }}
      className="rounded-lg border border-[#172033]/12 bg-white/78 p-5 shadow-[0_20px_70px_rgba(23,32,51,0.08)] transition-all duration-300 hover:bg-white sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {kicker && (
            <div className="overflow-hidden">
              <motion.p
                initial={false}
                whileInView={isMounted && !reduceMotion ? { x: 0, opacity: 1 } : undefined}
                style={isMounted && !reduceMotion ? { x: -30, opacity: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f6f45]"
              >
                {kicker}
              </motion.p>
            </div>
          )}
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#172033]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[#172033]/62">
            Satuan: {unit}. Periode: {period}.
          </p>
        </div>
        {action}
      </div>

      <p className="sr-only">{summary}</p>
      <div className="mt-6 min-h-72">{children}</div>

      <p className="mt-5 text-sm leading-7 text-[#172033]/72">{caption}</p>
      <p className="mt-2 text-xs font-semibold text-[#172033]/52">{source}</p>
    </motion.section>
  );
}
