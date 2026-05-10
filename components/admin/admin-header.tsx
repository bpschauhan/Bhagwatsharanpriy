import { ShieldCheck } from "lucide-react";
import { VerificationBadge } from "./verification-badge";

type AdminHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function AdminHeader({ eyebrow = "Admin", title, description }: AdminHeaderProps) {
  return (
    <header className="mb-8 rounded-lg border border-border bg-wisdom-radial p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <VerificationBadge status="REVIEW" />
      </div>
      <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">{description}</p>
    </header>
  );
}
