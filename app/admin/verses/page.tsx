import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditorForm } from "@/components/admin/editor-form";
import { SourcePicker } from "@/components/admin/source-picker";
import { adminSources } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "Verse Editor | Bhagwatsharanpriy Admin",
  description: "Edit verses, meaning layers, commentary, concepts, and source citations.",
};

export default function AdminVersesPage() {
  return (
    <>
      <AdminHeader
        title="Verse editor"
        description="Keep scripture text, word meaning, interpretation, commentary, and modern analysis visually and structurally separate."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <EditorForm mode="verse" />
        <SourcePicker sources={adminSources} />
      </div>
    </>
  );
}
