"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditorFormProps = {
  mode: "book" | "verse" | "concept" | "source";
};

export function EditorForm({ mode }: EditorFormProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.form
      className="space-y-5"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      {mode === "book" ? <BookFields /> : null}
      {mode === "verse" ? <VerseFields /> : null}
      {mode === "concept" ? <ConceptFields /> : null}
      {mode === "source" ? <SourceFields /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Verification notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Interpretation label" placeholder="scripture, interpretation, commentary, modern analysis..." />
          <Field label="Review notes" placeholder="What must a reviewer verify before approval?" multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Verification status" options={["DRAFT", "REVIEW", "VERIFIED", "DISPUTED", "ARCHIVED"]} />
            <Field label="Confidence level" placeholder="0-100" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline">
              <Save className="size-4" aria-hidden="true" />
              Save draft
            </Button>
            <Button type="button">
              <Send className="size-4" aria-hidden="true" />
              Submit for review
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.form>
  );
}

function BookFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book editor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Title" placeholder="Bhagavad Gita" />
        <Field label="Slug" placeholder="bhagavad-gita" />
        <Field label="Summary" placeholder="Truthful, concise description..." multiline />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tradition" placeholder="Sanatana Dharma" />
          <SelectField label="Difficulty" options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]} />
        </div>
      </CardContent>
    </Card>
  );
}

function VerseFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verse editor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Sanskrit scripture text" placeholder="Paste verified Sanskrit only" multiline className="font-devanagari" />
        <Field label="Transliteration" placeholder="Use consistent transliteration and verify diacritics" multiline />
        <Field label="Word-by-word meaning" placeholder="Keep this separate from interpretation" multiline />
        <Field label="Simple meaning layer" placeholder="Beginner-safe meaning, clearly not a quotation" multiline />
        <Field label="Practical application" placeholder="Practical meaning, not scripture text" multiline />
        <Field label="Scientific parallel" placeholder="Only cautious parallels with source transparency" multiline />
      </CardContent>
    </Card>
  );
}

function ConceptFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept editor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Concept name" placeholder="Karma" />
        <Field label="Category" placeholder="Action and consequence" />
        <Field label="Explanation" placeholder="Separate traditional meaning from modern examples" multiline />
        <Field label="Related concepts" placeholder="dharma, samatva, moksha" />
      </CardContent>
    </Card>
  );
}

function SourceFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Source editor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Source title" placeholder="Bhagavad Gita" />
        <Field label="Author or tradition" placeholder="Traditional Sanskrit recension" />
        <SelectField label="Source type" options={["SCRIPTURE", "COMMENTARY", "SCHOLARLY", "HISTORICAL", "MODERN_ANALYSIS"]} />
        <Field label="Citation" placeholder="Full citation or source locator" multiline />
        <Field label="Credibility notes" placeholder="Why this source is trusted, limited, or disputed" multiline />
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  placeholder,
  multiline = false,
  className,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  className?: string;
}) {
  const fieldClass =
    "w-full rounded-md border border-border bg-background/70 px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {multiline ? (
        <textarea className={`${fieldClass} min-h-28 ${className ?? ""}`} placeholder={placeholder} />
      ) : (
        <input className={`${fieldClass} ${className ?? ""}`} placeholder={placeholder} />
      )}
    </label>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select className="w-full rounded-md border border-border bg-background/70 px-3 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
