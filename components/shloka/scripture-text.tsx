import { cn } from "@/lib/utils/cn";

type ScriptureTextProps = {
  sanskrit: string;
  transliteration: string;
  className?: string;
};

export function ScriptureText({ sanskrit, transliteration, className }: ScriptureTextProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <p className="whitespace-pre-line font-devanagari text-3xl leading-[1.8] text-foreground sm:text-4xl">
        {sanskrit}
      </p>
      <p className="whitespace-pre-line text-base italic leading-8 text-muted-foreground">{transliteration}</p>
    </div>
  );
}
