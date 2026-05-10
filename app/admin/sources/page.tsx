import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditorForm } from "@/components/admin/editor-form";
import { SourcePicker } from "@/components/admin/source-picker";
import { adminSources } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "Sources Admin | Bhagwatsharanpriy",
  description: "Manage source credibility, citations, and verification metadata.",
};

export default function AdminSourcesPage() {
  return (
    <>
      <AdminHeader
        title="Sources"
        description="Every claim needs a source posture: scripture, commentary, scholarly, historical, or modern analysis."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EditorForm mode="source" />
        <SourcePicker sources={adminSources} />
      </div>
    </>
  );
}
