import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminMetric } from "@/types/admin";
import { VerificationBadge } from "./verification-badge";

type ContentStatusCardProps = {
  metric: AdminMetric;
};

export function ContentStatusCard({ metric }: ContentStatusCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{metric.label}</CardTitle>
          <VerificationBadge status={metric.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-4xl font-semibold">{metric.value}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{metric.detail}</p>
      </CardContent>
    </Card>
  );
}
