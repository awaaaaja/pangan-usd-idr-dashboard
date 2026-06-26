"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type ResearchPageHeaderProps = {
  title: string;
  description: string;
  badges?: ReactNode;
  visual?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export function ResearchPageHeader({
  title,
  description,
  badges,
  visual,
}: ResearchPageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative isolate mb-8 overflow-hidden rounded-lg border border-[#172033]/12 bg-[#101b33] p-5 text-[#f7f0e4] shadow-[0_22px_70px_rgba(16,27,51,0.16)] sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 18%, rgba(247,240,228,0.2), transparent 30%), url('/assets/pangan-pulse/price-wave.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b33] via-[#101b33]/92 to-[#101b33]/68" />

      <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          {badges && (
            <motion.div
              initial={false}
              animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
              style={isMounted && !reduceMotion ? { opacity: 0, y: 10 } : undefined}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {badges}
            </motion.div>
          )}
          <motion.p
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 10 } : undefined}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-bold uppercase tracking-[0.24em] text-[#9cc7ab]"
          >
            Cerita riset publik
          </motion.p>
          <motion.h1
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#fff9f1] sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-5 max-w-4xl text-base leading-8 text-[#f7f0e4]/76 sm:text-lg"
          >
            {description}
          </motion.p>
        </div>

        {visual && (
          <motion.figure
            initial={false}
            animate={isMounted && !reduceMotion ? { opacity: 1, scale: 1 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, scale: 0.97 } : undefined}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-lg border border-[#f7f0e4]/14 bg-[#f7f0e4]/8 p-3 overflow-hidden"
          >
            <div className="overflow-hidden rounded-md bg-[#fff9f1]/8">
              <motion.img
                initial={false}
                animate={isMounted && !reduceMotion ? { scale: 1 } : undefined}
                style={isMounted && !reduceMotion ? { scale: 1.06 } : undefined}
                transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
                src={visual.src}
                alt={visual.alt}
                className="h-56 w-full object-contain lg:h-64 origin-center"
              />
            </div>
            {visual.caption && (
              <figcaption className="mt-3 text-xs leading-5 text-[#f7f0e4]/62">
                {visual.caption}
              </figcaption>
            )}
          </motion.figure>
        )}
      </div>
    </section>
  );
}
