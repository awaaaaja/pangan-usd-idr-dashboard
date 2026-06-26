"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type PropsWithChildren } from "react";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Temuan", href: "/dashboard" },
  { label: "Data", href: "/dashboard/data-quality" },
  { label: "Validasi", href: "/dashboard/validation" },
  { label: "USD/IDR", href: "/dashboard/usd-idr-ablation" },
  { label: "SHAP", href: "/dashboard/explainability" },
  { label: "Metodologi", href: "/dashboard/methodology" },
  { label: "Artefak", href: "/dashboard/downloads" },
];

const BRAND_MARK = "/assets/pangan-pulse/pangan-pulse-mark.svg";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

function WaveSeparator() {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)] overflow-hidden leading-[0] h-10 pointer-events-none">
      <style>{`
        @keyframes wave-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-svg {
          animation: wave-move 20s linear infinite;
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2880 48"
        preserveAspectRatio="none"
        className={cn(
          "h-8 absolute bottom-0 left-0",
          isMounted && !reduceMotion && "animate-wave-svg"
        )}
        style={{ width: "200%", minWidth: "2880px" }}
        aria-hidden="true"
      >
        <path
          fill="#101B33"
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 C1680,48 1920,0 2160,24 C2400,48 2640,0 2880,24 L2880,48 L0,48 Z"
        />
      </svg>
    </div>
  );
}

export function ResearchShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [markError, setMarkError] = useState(false);
  const navLabelId = useId();

  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFullBleed = pathname === "/" || pathname === "/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-pp-paper text-pp-ink selection:bg-pp-leaf selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-pp-rice focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-pp-ink focus:ring-2 focus:ring-pp-leaf focus:ring-offset-2 focus:ring-offset-pp-paper"
      >
        Lewati ke konten utama
      </a>

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-pp-ink/10 transition-all duration-300",
          scrolled 
            ? "bg-pp-paper/95 backdrop-blur-md shadow-sm" 
            : "bg-pp-paper/85 backdrop-blur-xs shadow-none"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-pp-paper"
          >
            {markError ? (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pp-midnight text-sm font-bold tracking-tight text-pp-paper">
                PP
              </span>
            ) : (
              <Image
                src={BRAND_MARK}
                alt=""
                width={36}
                height={36}
                unoptimized
                className="h-9 w-9 shrink-0 rounded-full transition-transform duration-500 group-hover:rotate-12"
                onError={() => setMarkError(true)}
              />
            )}
            <span className="font-sans text-lg font-semibold tracking-tight text-pp-ink">
              Pangan Pulse
            </span>
          </Link>

          <nav
            id={navLabelId}
            aria-label="Navigasi riset"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium text-pp-ink/70 transition-colors hover:text-pp-ink focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-pp-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-pp-paper",
                    isActive && "font-semibold text-pp-ink",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && isMounted && !reduceMotion ? (
                    <motion.span
                      layoutId="activeNavLink"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-pp-leaf"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  ) : (
                    isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-pp-leaf" />
                    )
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={`${navLabelId}-mobile`}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-pp-ink transition-colors hover:bg-pp-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-pp-paper lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        <div
          id={`${navLabelId}-mobile`}
          className={cn(
            "overflow-hidden border-t border-pp-sand/30 bg-pp-rice transition-[max-height,opacity] duration-300 ease-in-out lg:hidden",
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <motion.nav
            aria-label="Navigasi riset mobile"
            className="flex flex-col px-4 py-3 sm:px-6"
            initial={false}
            animate={mobileOpen && isMounted && !reduceMotion ? "open" : "closed"}
            variants={{
              open: {
                transition: { staggerChildren: 0.04, delayChildren: 0.05 }
              },
              closed: {}
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <motion.div
                  key={item.href}
                  variants={{
                    open: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                    closed: { opacity: 0, x: -16 }
                  }}
                  className="w-full"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-pp-rice",
                      isActive
                        ? "bg-pp-paper font-semibold text-pp-leaf"
                        : "text-pp-ink/80 hover:bg-pp-paper hover:text-pp-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {isFullBleed ? (
          children
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </div>
        )}
      </main>

      <footer className="relative bg-pp-midnight text-pp-paper">
        <WaveSeparator />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm leading-relaxed text-pp-paper/80">
                Dashboard ini menyajikan hasil backtesting historis dan evaluasi
                model machine learning pada data harga pangan 2022–2025. Semua
                angka berasal dari artefak penelitian yang dijalankan pada data
                nyata dengan desain temporal ketat — bukan proyeksi ke depan dan
                bukan klaim kausalitas.
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm font-semibold text-pp-paper">
                Pangan Pulse
              </p>
              <p className="text-sm text-pp-paper/70">
                Penelitian, 2026
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-pp-paper/10 pt-6">
            <p className="text-xs text-pp-paper/50">
              Semua metrik diambil langsung dari artefak penelitian. Angka yang
              ditampilkan mencerminkan performa historis model pada data yang
              belum pernah dilihat selama pelatihan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
