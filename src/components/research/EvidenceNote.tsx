"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type EvidenceNoteProps = {
  title?: string;
  children: ReactNode;
  tone?: "info" | "warning" | "neutral";
  className?: string;
};

const toneClass = {
  info: "border-[#2f6f45]/28 bg-[#eff7ef] text-[#172033]",
  warning: "border-[#d1453b]/30 bg-[#fff4ee] text-[#172033]",
  neutral: "border-[#172033]/12 bg-white/72 text-[#172033]",
};

const accentColor = {
  info: "bg-[#2f6f45]",
  warning: "bg-[#d1453b]",
  neutral: "bg-[#172033]",
};

export function EvidenceNote({
  title = "Catatan bukti",
  children,
  tone = "info",
  className,
}: EvidenceNoteProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.aside
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, x: 0 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, x: -20 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("relative overflow-hidden rounded-lg border border-l-0 p-5", toneClass[tone], className)}
    >
      {/* Growing Left Accent Bar */}
      <motion.div
        initial={false}
        whileInView={isMounted && !reduceMotion ? { scaleY: 1 } : undefined}
        style={isMounted && !reduceMotion ? { scaleY: 0 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        className={cn("absolute left-0 top-0 bottom-0 w-[4px] origin-top", accentColor[tone])}
      />

      <div className="pl-1">
        <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-65">
          {title}
        </p>
        <div className="mt-2 text-sm leading-7">{children}</div>
      </div>
    </motion.aside>
  );
}
