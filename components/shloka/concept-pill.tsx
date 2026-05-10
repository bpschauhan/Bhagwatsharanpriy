import { Badge } from "@/components/ui/badge";
import type { ConceptContent } from "@/types/gita";

type ConceptPillProps = {
  concept: ConceptContent;
};

export function ConceptPill({ concept }: ConceptPillProps) {
  return (
    <Badge variant="outline" title={concept.description}>
      {concept.name}
    </Badge>
  );
}
