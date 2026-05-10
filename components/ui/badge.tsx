import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "secondary" | "outline" | "muted";

const variants: Record<BadgeVariant, string> = {
  default: "border-primary/35 bg-primary/15 text-foreground",
  secondary: "border-secondary/25 bg-secondary/10 text-foreground",
  outline: "border-border bg-background/70 text-muted-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
