import { BookOpenText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScriptureText } from "./scripture-text";
import type { VerseContent } from "@/types/gita";

type VerseDisplayProps = {
  verse: VerseContent;
  reference: string;
};

export function VerseDisplay({ verse, reference }: VerseDisplayProps) {
  return (
    <Card className="scripture-card overflow-hidden border-primary/30 bg-card">
      <CardContent className="p-5 sm:p-9">
        <div className="mb-7 flex items-center gap-3 text-sm font-medium text-foreground">
          <BookOpenText className="size-4 text-primary" aria-hidden="true" />
          <span>{reference}</span>
        </div>
        <div className="scripture-panel rounded-lg border border-primary/30 bg-background p-5 shadow-inner-calm sm:p-8">
          <ScriptureText sanskrit={verse.sanskrit} transliteration={verse.transliteration} />
        </div>
      </CardContent>
    </Card>
  );
}
