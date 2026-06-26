"use client";

import { useId, useState } from "react";

type AccessibleTooltipProps = {
  label: string;
  children: string;
};

export function AccessibleTooltip({ label, children }: AccessibleTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="rounded-full border border-[#172033]/20 px-2 py-0.5 text-xs font-semibold text-[#172033]/70 underline-offset-4 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f45]"
      >
        {label}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-[#172033]/12 bg-white p-3 text-left text-xs leading-5 text-[#172033] shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
