import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminSource } from "@/types/admin";
import { VerificationBadge } from "./verification-badge";

type SourcePickerProps = {
  sources: AdminSource[];
};

export function SourcePicker({ sources }: SourcePickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" aria-hidden="true" />
          Source picker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((source) => (
          <label key={source.id} className="flex cursor-pointer gap-3 rounded-lg border border-border bg-background/60 p-4">
            <input type="checkbox" className="mt-1 size-4 accent-primary" aria-label={`Select ${source.title}`} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{source.title}</span>
                <VerificationBadge status={source.status} />
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{source.sourceType.replaceAll("_", " ").toLowerCase()}</span>
              <span className="mt-2 block text-sm leading-6 text-muted-foreground">{source.citation}</span>
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
