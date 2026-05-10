import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditorForm } from "@/components/admin/editor-form";
import { SourcePicker } from "@/components/admin/source-picker";
import { adminSources } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "New Book | Bhagwatsharanpriy Admin",
  description: "Create a new scripture book draft.",
};

export default function NewBookPage() {
  return (
    <>
      <AdminHeader
        title="Create book draft"
        description="Add only sourced, reviewable metadata. Chapters and verses can be attached after the book shell is saved."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <EditorForm mode="book" />
        <SourcePicker sources={adminSources} />
      </div>
    </>
  );
}
