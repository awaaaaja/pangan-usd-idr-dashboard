import { cn } from "@/lib/utils";

type MethodologyBadgeProps = {
  children: string;
  tone?: "validation" | "test" | "backtest" | "shap" | "data";
};

const toneClass = {
  validation:
    "border-[#2468a8]/25 bg-[#edf5fb] text-[#2468a8]",
  test: "border-[#d1453b]/25 bg-[#fff4ee] text-[#d1453b]",
  backtest:
    "border-[#2f6f45]/25 bg-[#eff7ef] text-[#2f6f45]",
  shap: "border-[#6f4aa8]/25 bg-[#f3eef8] text-[#6f4aa8]",
  data: "border-[#172033]/14 bg-white/70 text-[#172033]/72",
};

export function MethodologyBadge({
  children,
  tone = "data",
}: MethodologyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}
