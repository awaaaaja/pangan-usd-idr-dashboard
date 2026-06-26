import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export type ResearchTableColumn<T> = {
  key: keyof T | string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
};

type ResearchDataTableProps<T> = {
  title?: string;
  caption?: string;
  source?: string;
  columns: ResearchTableColumn<T>[];
  rows: T[];
  limit?: number;
  className?: string;
};

export function ResearchDataTable<T extends Record<string, unknown>>({
  title,
  caption,
  source,
  columns,
  rows,
  limit,
  className,
}: ResearchDataTableProps<T>) {
  const visibleRows = typeof limit === "number" ? rows.slice(0, limit) : rows;

  return (
    <section
      className={cn(
        "rounded-lg border border-[#172033]/12 bg-white/76 p-5 shadow-[0_18px_55px_rgba(23,32,51,0.07)]",
        className,
      )}
    >
      {title && (
        <h2 className="text-xl font-semibold text-[#172033]">
          {title}
        </h2>
      )}

      {visibleRows.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#172033]/12 text-xs uppercase tracking-[0.16em] text-[#172033]/52">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={cn(
                      "whitespace-nowrap px-3 py-3 font-semibold",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]/8">
              {visibleRows.map((row, index) => (
                <tr key={index} className="align-top">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-3 py-3 text-[#172033]/78",
                        column.align === "right" && "text-right tabular-nums",
                        column.align === "center" && "text-center",
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {caption && (
        <p className="mt-4 text-sm leading-6 text-[#172033]/68">
          {caption}
        </p>
      )}
      {source && (
        <p className="mt-2 text-xs font-semibold text-[#172033]/48">
          {source}
        </p>
      )}
    </section>
  );
}
