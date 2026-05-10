import type { ReactNode } from "react";
import { requireAdminAccess } from "@/lib/auth/rbac";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Container } from "@/components/layout/container";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminAccess();

  return (
    <Container className="py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar user={{ name: user.name ?? user.email ?? "Contributor", role: user.role }} />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
