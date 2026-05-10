import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, children, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 max-w-3xl", className)}>
      {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 leading-8 text-muted-foreground">{description}</p> : null}
      {children}
    </div>
  );
}
