import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-16 sm:py-20 lg:py-[var(--section-rhythm)]", className)} {...props} />;
}
