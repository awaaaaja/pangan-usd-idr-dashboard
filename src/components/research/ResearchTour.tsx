"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type ResearchTourItem = {
  label: string;
  title: string;
  value: string;
  detail: string;
  tone?: "baseline" | "ml" | "usd" | "warning";
};

const toneClass = {
  baseline: "border-[#6b7280] bg-[#f4f4f1]",
  ml: "border-[#2f6f45] bg-[#eff7ef]",
  usd: "border-[#6f4aa8] bg-[#f3eef8]",
  warning: "border-[#d1453b] bg-[#fff4ee]",
};

export function ResearchTour({ items }: { items: ResearchTourItem[] }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const item = items[active] ?? items[0];

  if (!item) return null;

  return (
    <div className="rounded-lg border border-[#172033]/12 bg-white/70 p-4 shadow-[0_20px_70px_rgba(23,32,51,0.08)] sm:p-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tur riset">
        {items.map((candidate, index) => {
          const isActive = active === index;
          return (
            <button
              key={candidate.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "relative rounded-full border border-[#172033]/16 px-4 py-2 text-sm font-semibold text-[#172033]/68 transition-all duration-300 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2f6f45] overflow-hidden hover:scale-[1.04] active:scale-[0.96] motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
                isActive && "border-transparent text-[#f6efe2] hover:bg-[#172033]/90 hover:scale-100 active:scale-100"
              )}
            >
              <span className="relative z-10">{candidate.label}</span>
              {isActive && isMounted && !reduceMotion && (
                <motion.span
                  layoutId="activeTourTab"
                  className="absolute inset-0 bg-[#172033] z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              {isActive && (reduceMotion || !isMounted) && (
                <span className="absolute inset-0 bg-[#172033] z-0" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.label}
          initial={isMounted && !reduceMotion ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={isMounted && !reduceMotion ? { opacity: 0, y: -10 } : undefined}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "mt-5 rounded-lg border-l-4 p-5",
            toneClass[item.tone ?? "ml"],
          )}
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#172033]/55">
            {item.title}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#172033]">
            {item.value}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#172033]/72">
            {item.detail}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
