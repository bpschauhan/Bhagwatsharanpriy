import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { ContentStatusCard } from "@/components/admin/content-status-card";
import { ReviewQueue } from "@/components/admin/review-queue";
import { getAdminDashboard } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Bhagwatsharanpriy",
  description: "Internal truth verification dashboard for Bhagwatsharanpriy content.",
};

export default async function AdminPage() {
  const dashboard = await getAdminDashboard();

  return (
    <>
      <AdminHeader
        title="Truth verification dashboard"
        description="A calm internal workspace for source transparency, scholarly review, revision history, and publish-ready confidence."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <ContentStatusCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ReviewQueue items={dashboard.reviewQueue} />
        <AuditLogList entries={dashboard.auditEntries} />
      </div>
    </>
  );
}
