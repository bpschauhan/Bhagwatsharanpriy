type HighlightedTextProps = {
  text: string;
  query: string;
};

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-IN");

  if (!normalizedQuery) {
    return <>{text}</>;
  }

  const normalizedText = text.toLocaleLowerCase("en-IN");
  const start = normalizedText.indexOf(normalizedQuery);

  if (start < 0) {
    return <>{text}</>;
  }

  const end = start + normalizedQuery.length;

  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-primary/20 px-1 text-foreground">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}
