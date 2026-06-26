import type { ReactNode } from "react";

type Props = { title?: string; children: ReactNode; tone?: "default" | "exchange" | "data" };

export function SimpleInterpretation({ title = "Apa artinya?", children, tone = "default" }: Props) {
  return (
    <aside className={`pp-meaning pp-meaning--${tone}`} aria-label={title}>
      <p className="pp-meaning__label">{title}</p>
      <div>{children}</div>
    </aside>
  );
}
