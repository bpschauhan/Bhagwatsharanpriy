import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditEntry } from "@/types/admin";

type AuditLogListProps = {
  entries: AuditEntry[];
};

export function AuditLogList({ entries }: AuditLogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" aria-hidden="true" />
          Audit trail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <article key={entry.id} className="border-l-2 border-primary/35 pl-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">{entry.action.replaceAll("_", " ").toLowerCase()}</span>
              <span className="text-muted-foreground">by {entry.actor}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{entry.entity}</p>
            <p className="mt-2 leading-7">{entry.message}</p>
            <time className="mt-2 block text-xs text-muted-foreground">{entry.createdAt}</time>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
