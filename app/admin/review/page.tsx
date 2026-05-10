import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { ReviewQueue } from "@/components/admin/review-queue";
import { requireReviewerAccess } from "@/lib/auth/rbac";
import { getAdminDashboard } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Review Queue | Bhagwatsharanpriy Admin",
  description: "Moderation and verification review queue.",
};

export default async function AdminReviewPage() {
  await requireReviewerAccess();
  const dashboard = await getAdminDashboard();

  return (
    <>
      <AdminHeader
        title="Review queue"
        description="Approve only what has source support, correct category labels, and transparent interpretation boundaries."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ReviewQueue items={dashboard.reviewQueue} />
        <AuditLogList entries={dashboard.auditEntries} />
      </div>
    </>
  );
}
