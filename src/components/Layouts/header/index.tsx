"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { ThemeToggleSwitch } from "./theme-toggle";

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Pangan Insight Indonesia",
    description: "Dashboard publik hasil penelitian dan backtesting historis",
  },
  "/dashboard": {
    title: "Ikhtisar Riset",
    description: "Evaluasi model dan kualitas data fase pertama",
  },
  "/dashboard/data-quality": {
    title: "Kualitas Data",
    description: "Audit sumber, strict-lag, dan outlier",
  },
  "/dashboard/validation": {
    title: "Validasi Temporal",
    description: "Walk-forward validation dengan embargo satu bulan",
  },
  "/dashboard/usd-idr-ablation": {
    title: "Ablation USD/IDR",
    description: "Evaluasi fitur USD/IDR tanpa klaim kausal",
  },
  "/dashboard/test-evaluation": {
    title: "Evaluasi Test Akhir",
    description: "Backtesting Januari-Desember 2025",
  },
  "/dashboard/segments": {
    title: "Segmen Hasil",
    description: "Level harga dan komoditas yang tersedia",
  },
  "/dashboard/sumatera-barat": {
    title: "Sumatera Barat",
    description: "Fokus backtesting historis provinsi",
  },
  "/dashboard/explainability": {
    title: "Explainability",
    description: "Interpretasi SHAP model champion",
  },
  "/dashboard/methodology": {
    title: "Metodologi",
    description: "Batas klaim dan reproduksibilitas",
  },
  "/dashboard/downloads": {
    title: "Downloads",
    description: "Artefak resmi penelitian",
  },
  "/admin": {
    title: "Admin",
    description: "Status import dan run penelitian",
  },
};

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();
  const copy = PAGE_COPY[pathname] ?? PAGE_COPY["/dashboard"];

  return (
    <header className="border-stroke shadow-1 dark:border-stroke-dark dark:bg-gray-dark sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-5 md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="dark:border-stroke-dark rounded-lg border px-1.5 py-1 lg:hidden dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A]"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link
          href={"/"}
          className="2xsm:ml-4 ml-2 max-[430px]:hidden text-sm font-bold text-slate-950 dark:text-white"
        >
          Pangan Insight
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="text-heading-5 text-dark mb-0.5 font-bold dark:text-white">
          {copy.title}
        </h1>
        <p className="font-medium">{copy.description}</p>
      </div>

      <div className="2xsm:gap-4 flex flex-1 items-center justify-end gap-2">
        <ThemeToggleSwitch />
        <Link
          href="/admin"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
