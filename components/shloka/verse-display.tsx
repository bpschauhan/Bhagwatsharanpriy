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
    <Card className="overflow-hidden bg-wisdom-layered">
      <CardContent className="p-6 sm:p-9">
        <div className="mb-7 flex items-center gap-3 text-sm text-muted-foreground">
          <BookOpenText className="size-4 text-primary" aria-hidden="true" />
          <span>{reference}</span>
        </div>
        <div className="rounded-lg border border-primary/20 bg-background/55 p-5 shadow-inner-calm">
          <ScriptureText sanskrit={verse.sanskrit} transliteration={verse.transliteration} />
        </div>
      </CardContent>
    </Card>
  );
}
