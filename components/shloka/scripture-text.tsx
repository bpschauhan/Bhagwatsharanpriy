import { cn } from "@/lib/utils/cn";

type ScriptureTextProps = {
  sanskrit: string;
  transliteration: string;
  className?: string;
};

export function ScriptureText({ sanskrit, transliteration, className }: ScriptureTextProps) {
  return (
    <div className={cn("space-y-7", className)}>
      <p className="scripture-sanskrit whitespace-pre-line font-devanagari text-foreground">
        {sanskrit}
      </p>
      <p className="scripture-transliteration whitespace-pre-line border-t border-border pt-5 text-base italic text-foreground/78">
        {transliteration}
      </p>
    </div>
  );
}
