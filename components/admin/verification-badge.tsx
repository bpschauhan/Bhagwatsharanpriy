import { Badge } from "@/components/ui/badge";
import type { VerificationStatus } from "@/types/admin";

type VerificationBadgeProps = {
  status: VerificationStatus;
};

const variantByStatus: Record<VerificationStatus, "default" | "secondary" | "outline" | "muted"> = {
  DRAFT: "outline",
  REVIEW: "default",
  VERIFIED: "muted",
  DISPUTED: "secondary",
  ARCHIVED: "outline",
};

export function VerificationBadge({ status }: VerificationBadgeProps) {
  return <Badge variant={variantByStatus[status]}>{status.toLowerCase()}</Badge>;
}
