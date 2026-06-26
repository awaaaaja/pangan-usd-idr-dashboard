"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { IndonesiaPulseIllustration } from "./PanganPulseIllustrations";

type ResearchHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  meta?: ReactNode;
};

export function ResearchHero({
  eyebrow = "Pangan Pulse",
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  meta,
}: ResearchHeroProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <section className="relative isolate min-h-[calc(100svh-73px)] overflow-hidden bg-[#172033] px-4 py-12 text-[#f6efe2] sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 opacity-70">
        <IndonesiaPulseIllustration className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(246,239,226,0.16),transparent_28%),linear-gradient(90deg,rgba(23,32,51,0.96),rgba(23,32,51,0.78)_45%,rgba(23,32,51,0.62))]" />

      {/* Floating particles/circles for visual depth */}
      {isMounted && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 -z-5 overflow-hidden">
          <div className="absolute top-[15%] left-[10%] h-3 w-3 rounded-full bg-[#9cc7ab]/20 blur-[1px] animate-float-slow" />
          <div className="absolute top-[45%] left-[80%] h-5 w-5 rounded-full bg-[#f6efe2]/15 blur-[2px] animate-float-medium" />
          <div className="absolute top-[75%] left-[25%] h-4 w-4 rounded-full bg-[#9cc7ab]/10 blur-[1px] animate-float-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[25%] right-[20%] h-6 w-6 rounded-full bg-[#f6efe2]/10 blur-[3px] animate-float-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-[20%] right-[40%] h-3.5 w-3.5 rounded-full bg-[#9cc7ab]/25 blur-[1px] animate-float-medium" style={{ animationDelay: "3s" }} />
          <div className="absolute top-[60%] left-[5%] h-5 w-5 rounded-full bg-[#f6efe2]/10 blur-[2px] animate-float-slow" style={{ animationDelay: "4s" }} />
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100svh-170px)] max-w-7xl flex-col justify-center">
        <div className="max-w-4xl">
          <motion.p
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-xs font-bold uppercase tracking-[0.28em] text-[#9cc7ab]"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 25 } : undefined}
            transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
            className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 20 } : undefined}
            transition={{ duration: 0.6, delay: 0.34, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-lg leading-8 text-[#f6efe2]/78 sm:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
            transition={{ duration: 0.6, delay: 0.46, ease: "easeOut" }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href={primaryHref}
              className="inline-flex justify-center items-center rounded-full bg-[#f6efe2] px-6 py-3 text-sm font-bold text-[#172033] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-[#f6efe2]/10 focus:outline-none focus:ring-2 focus:ring-[#9cc7ab] active:scale-95"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex justify-center items-center rounded-full border border-[#f6efe2]/36 bg-[#f6efe2]/5 px-6 py-3 text-sm font-bold text-[#f6efe2] backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#f6efe2] hover:bg-[#f6efe2]/15 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9cc7ab] active:scale-95"
            >
              {secondaryLabel}
            </Link>
          </motion.div>

          {meta && (
            <motion.div
              initial={false}
              animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
              style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
              transition={{ duration: 0.6, delay: 0.58, ease: "easeOut" }}
              className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
            >
              {meta}
            </motion.div>
          )}
        </div>
      </div>

      <a
        href="#masalah"
        className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f6efe2]/72 hover:text-[#f6efe2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9cc7ab]"
      >
        Scroll
        <motion.span
          initial={false}
          animate={isMounted && !reduceMotion ? { y: [0, 8, 0] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-[#f6efe2]/70 to-transparent"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}
