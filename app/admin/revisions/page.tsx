import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { RevisionPanel } from "@/components/admin/revision-panel";
import { auditEntries, revisions } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "Revisions | Bhagwatsharanpriy Admin",
  description: "Revision history and rollback architecture.",
};

export default function AdminRevisionsPage() {
  return (
    <>
      <AdminHeader
        title="Revisions"
        description="Track every meaningful content change with snapshots, change notes, authorship, and future rollback support."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <RevisionPanel revisions={revisions} />
        <AuditLogList entries={auditEntries} />
      </div>
    </>
  );
}
