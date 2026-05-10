import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditorForm } from "@/components/admin/editor-form";
import { RevisionPanel } from "@/components/admin/revision-panel";
import { SourcePicker } from "@/components/admin/source-picker";
import { adminSources, revisions } from "@/lib/content/admin";

type AdminBookPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AdminBookPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Edit ${id} | Bhagwatsharanpriy Admin`,
    description: "Edit book metadata and verification workflow.",
  };
}

export default async function AdminBookPage({ params }: AdminBookPageProps) {
  const { id } = await params;

  return (
    <>
      <AdminHeader
        title={`Edit book: ${id}`}
        description="Book edits create revisions and remain separate from review approval."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <EditorForm mode="book" />
          <RevisionPanel revisions={revisions} />
        </div>
        <SourcePicker sources={adminSources} />
      </div>
    </>
  );
}
