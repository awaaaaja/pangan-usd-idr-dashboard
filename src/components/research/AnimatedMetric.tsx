"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedMetricProps = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  description?: string;
};

export function AnimatedMetric({
  label,
  value,
  suffix,
  decimals = 0,
  description,
}: AnimatedMetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  // Always start at 0 on the server to avoid SSR/client hydration mismatch.
  const [isMounted, setIsMounted] = useState(false);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // After mount, immediately jump to the final value if motion is reduced.
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    // Otherwise the count-up animation will run once the element is in view.
  }, [reduceMotion, value]);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    let frame = 0;
    const totalFrames = 42;
    const start = 0;
    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (value - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, reduceMotion, value]);

  return (
    <motion.div
      ref={ref}
      initial={false}
      whileInView={isMounted && !reduceMotion ? { opacity: 1, scale: 1 } : undefined}
      style={isMounted && !reduceMotion ? { opacity: 0, scale: 0.92 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative group rounded-lg border border-[#172033]/12 bg-white/72 p-5 shadow-[0_16px_45px_rgba(23,32,51,0.08)] transition-all duration-300 hover:bg-white hover:border-transparent hover:shadow-xl"
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      {/* Shimmer Border Overlay */}
      {isMounted && !reduceMotion && (
        <div
          className="absolute -inset-[1px] -z-10 rounded-[9px] bg-gradient-to-r from-[#2d7e67]/40 via-[#7256c8]/40 to-[#2d7e67]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer-fast"
          style={{ backgroundSize: "200% auto" }}
        />
      )}

      <div className="relative z-10">
        <p className="text-sm font-semibold text-[#172033]/65">{label}</p>
        <p className="mt-3 text-4xl font-semibold tracking-tight text-[#172033] group-hover:text-[#2d7e67] group-hover:animate-pulse-glow transition-all duration-300">
          {new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(display)}
          {suffix && <span className="text-xl text-[#172033]/70">{suffix}</span>}
        </p>
        {description && (
          <p className="mt-3 text-sm leading-6 text-[#172033]/68">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
