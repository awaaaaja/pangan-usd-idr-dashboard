import { ResearchShell } from "@/components/research";
import { type PropsWithChildren } from "react";

export default function WithLayout({ children }: PropsWithChildren) {
  return <ResearchShell>{children}</ResearchShell>;
}
