"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";

type ChartCardProps = {
  title: string;
  unit: string;
  period: string;
  caption: string;
  source: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  className?: string;
};

export function ChartCard({
  title,
  unit,
  period,
  caption,
  source,
  children,
  isLoading = false,
  isEmpty = false,
  className,
}: ChartCardProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, y: 20, scale: 0.98 } : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "rounded-lg border border-[#172033]/12 bg-white/76 p-5 shadow-[0_18_55px_rgba(23,32,51,0.07)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#172033]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[#172033]/58">
            Satuan: {unit}. Periode: {period}.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="relative h-72 overflow-hidden rounded-lg bg-[#172033]/8">
            {isMounted && !reduceMotion && (
              <motion.div
                initial={false}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          children
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-[#172033]/68">
        {caption}
      </p>
      <p className="mt-2 text-xs font-semibold text-[#172033]/48">
        {source}
      </p>
    </motion.section>
  );
}
