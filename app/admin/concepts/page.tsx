import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditorForm } from "@/components/admin/editor-form";
import { ReviewQueue } from "@/components/admin/review-queue";
import { reviewQueue } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "Concepts Admin | Bhagwatsharanpriy",
  description: "Manage concepts and relationship verification.",
};

export default function AdminConceptsPage() {
  return (
    <>
      <AdminHeader
        title="Concepts"
        description="Edit concept definitions, relationships, traditional framing, and modern parallels without blurring categories."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EditorForm mode="concept" />
        <ReviewQueue items={reviewQueue.filter((item) => item.entityType === "CONCEPT")} />
      </div>
    </>
  );
}
