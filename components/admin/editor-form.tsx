"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Save, Send } from "lucide-react";
import { useActionState } from "react";
import { saveEditorDraft, type EditorState } from "@/actions/content-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditorFormProps = {
  mode: "book" | "verse" | "concept" | "source";
};

export function EditorForm({ mode }: EditorFormProps) {
  const reduceMotion = useReducedMotion();
  const [state, formAction, pending] = useActionState(saveEditorDraft, initialState);

  return (
    <motion.form
      action={formAction}
      className="space-y-5"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <input type="hidden" name="mode" value={mode} />
      {mode === "book" ? <BookFields /> : null}
      {mode === "verse" ? <VerseFields /> : null}
      {mode === "concept" ? <ConceptFields /> : null}
      {mode === "source" ? <SourceFields /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Verification notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field name="interpretationLabel" label="Interpretation label" placeholder="scripture, interpretation, commentary, modern analysis..." />
          <Field name="reviewNotes" label="Review notes" placeholder="What must a reviewer verify before approval?" multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField name="verificationStatus" label="Verification status" options={["DRAFT", "REVIEW", "VERIFIED", "DISPUTED", "ARCHIVED"]} />
            <Field name="confidenceLevel" label="Confidence level" placeholder="0-100" defaultValue="0" />
          </div>
          {!state.ok || state.message ? (
            <p className="rounded-md border border-border bg-background px-3 py-2 text-sm" role={!state.ok ? "alert" : "status"}>
              {state.message}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="outline" disabled={pending}>
              <Save className="size-4" aria-hidden="true" />
              {pending ? "Saving..." : "Save draft"}
            </Button>
            <Button type="submit" disabled={pending}>
              <Send className="size-4" aria-hidden="true" />
              Submit for review
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.form>
  );
}

const initialState: EditorState = {
  ok: true,
  message: "",
};

function BookFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book editor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field name="title" label="Title" placeholder="Bhagavad Gita" />
        <Field name="slug" label="Slug" placeholder="bhagavad-gita" />
        <Field name="summary" label="Summary" placeholder="Truthful, concise description..." multiline />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="tradition" label="Tradition" placeholder="Sanatana Dharma" />
          <SelectField name="difficulty" label="Difficulty" options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]} />
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
        <Field name="sanskrit" label="Sanskrit scripture text" placeholder="Paste verified Sanskrit only" multiline className="font-devanagari" />
        <Field name="transliteration" label="Transliteration" placeholder="Use consistent transliteration and verify diacritics" multiline />
        <Field name="wordByWord" label="Word-by-word meaning" placeholder="Keep this separate from interpretation" multiline />
        <Field name="simpleMeaning" label="Simple meaning layer" placeholder="Beginner-safe meaning, clearly not a quotation" multiline />
        <Field name="practicalApplication" label="Practical application" placeholder="Practical meaning, not scripture text" multiline />
        <Field name="scientificParallel" label="Scientific parallel" placeholder="Only cautious parallels with source transparency" multiline />
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
        <Field name="name" label="Concept name" placeholder="Karma" />
        <Field name="category" label="Category" placeholder="Action and consequence" />
        <Field name="explanation" label="Explanation" placeholder="Separate traditional meaning from modern examples" multiline />
        <Field name="relatedConcepts" label="Related concepts" placeholder="dharma, samatva, moksha" />
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
        <Field name="title" label="Source title" placeholder="Bhagavad Gita" />
        <Field name="author" label="Author or tradition" placeholder="Traditional Sanskrit recension" />
        <SelectField name="sourceType" label="Source type" options={["SCRIPTURE", "COMMENTARY", "SCHOLARLY", "HISTORICAL", "MODERN_ANALYSIS"]} />
        <Field name="citation" label="Citation" placeholder="Full citation or source locator" multiline />
        <Field name="credibilityNotes" label="Credibility notes" placeholder="Why this source is trusted, limited, or disputed" multiline />
      </CardContent>
    </Card>
  );
}

function Field({
  name,
  label,
  placeholder,
  multiline = false,
  className,
  defaultValue,
}: {
  name: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  className?: string;
  defaultValue?: string;
}) {
  const fieldClass =
    "w-full rounded-md border border-border bg-background/70 px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {multiline ? (
        <textarea name={name} className={`${fieldClass} min-h-28 ${className ?? ""}`} placeholder={placeholder} defaultValue={defaultValue} />
      ) : (
        <input name={name} className={`${fieldClass} ${className ?? ""}`} placeholder={placeholder} defaultValue={defaultValue} />
      )}
    </label>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select name={name} className="w-full rounded-md border border-border bg-background/70 px-3 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
