import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLoading() {
  return (
    <>
      <AdminHeader title="Loading internal workspace" description="Preparing protected review data." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="surface-calm rounded-lg p-6">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="mt-5 h-8 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </>
  );
}
