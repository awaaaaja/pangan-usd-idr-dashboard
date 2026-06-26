"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type StorySectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

export function StorySection({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: StorySectionProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <section
      id={id}
      className={`mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.4fr] lg:px-8 lg:py-24 ${className}`}
    >
      <div className="lg:sticky lg:top-28 lg:h-fit">
        {eyebrow && (
          <div className="mb-3 flex items-center gap-2">
            <motion.span
              initial={false}
              whileInView={isMounted && !reduceMotion ? { width: 24 } : undefined}
              style={isMounted && !reduceMotion ? { width: 0 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="h-0.5 bg-[#2f6f45] inline-block"
            />
            <motion.p
              initial={false}
              whileInView={isMounted && !reduceMotion ? { opacity: 1, x: 0 } : undefined}
              style={isMounted && !reduceMotion ? { opacity: 0, x: -10 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="text-xs font-bold uppercase tracking-[0.24em] text-[#2f6f45]"
            >
              {eyebrow}
            </motion.p>
          </div>
        )}
        <motion.h2
          initial={false}
          whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
          style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
          className="max-w-xl text-3xl font-semibold leading-tight text-[#172033] sm:text-4xl"
        >
          {title}
        </motion.h2>
        {lead && (
          <motion.p
            initial={false}
            whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, y: 15 } : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.34, ease: "easeOut" }}
            className="mt-5 max-w-xl text-base leading-8 text-[#172033]/72"
          >
            {lead}
          </motion.p>
        )}
      </div>
      <motion.div
        initial={false}
        whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
        style={isMounted && !reduceMotion ? { opacity: 0, y: 24 } : undefined}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="min-w-0"
      >
        {children}
      </motion.div>
    </section>
  );
}
