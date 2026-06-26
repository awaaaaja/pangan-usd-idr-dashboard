"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

type DataSourceFooterProps = {
  artifacts: Array<{
    key: string;
    type: string;
    file: string;
    rows?: number | string | null;
  }>;
};

export function DataSourceFooter({ artifacts }: DataSourceFooterProps) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="bg-[#172033] px-4 py-16 text-[#f6efe2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.35fr]">
          <motion.div
            initial={false}
            whileInView={isMounted && !reduceMotion ? { opacity: 1, x: 0 } : undefined}
            style={isMounted && !reduceMotion ? { opacity: 0, x: -25 } : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9cc7ab]">
              Artefak penelitian
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Data, grafik, dan metadata tetap dapat ditelusuri.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#f6efe2]/72">
              Setiap visual di website ini merujuk pada CSV, metadata model,
              atau gambar BAB IV yang diimpor ke database.
            </p>
            <Link
              href="/dashboard/downloads"
              className="relative mt-6 overflow-hidden inline-flex rounded-full bg-[#f6efe2] px-5 py-3 text-sm font-semibold text-[#172033] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9cc7ab] active:scale-95 group"
            >
              <span className="relative z-10">Buka halaman artefak</span>
              {isMounted && !reduceMotion && (
                <motion.div
                  initial={false}
                  animate={{ x: ["-100%", "150%"] }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 3.5,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
                />
              )}
            </Link>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {artifacts.slice(0, 6).map((artifact, idx) => (
              <motion.div
                key={`${artifact.key}-${artifact.file}`}
                initial={false}
                whileInView={isMounted && !reduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
                style={isMounted && !reduceMotion ? { opacity: 0, y: 20, scale: 0.96 } : undefined}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                whileHover={reduceMotion ? undefined : { 
                  y: -4, 
                  borderColor: "rgba(156, 199, 171, 0.4)", 
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                }}
                className="rounded-lg border border-white/12 bg-white/5 p-4 transition-all duration-300 cursor-default"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f6efe2]/52">
                  {artifact.type}
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-white">
                  {artifact.file}
                </p>
                <p className="mt-2 text-xs text-[#f6efe2]/55">
                  Key: {artifact.key}
                  {artifact.rows ? ` | rows: ${artifact.rows}` : ""}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
