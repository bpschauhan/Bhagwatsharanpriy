import { ChevronRight } from "lucide-react";
import type { KnowledgeNode } from "@/types/knowledge";

type BreadcrumbTrailProps = {
  trail: KnowledgeNode[];
  onSelect?: (nodeId: string) => void;
};

export function BreadcrumbTrail({ trail, onSelect }: BreadcrumbTrailProps) {
  return (
    <nav aria-label="Knowledge path" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {trail.map((node, index) => (
        <span key={node.id} className="inline-flex items-center gap-2">
          {index > 0 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
          <button
            type="button"
            className="rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onSelect?.(node.id)}
          >
            {node.title}
          </button>
        </span>
      ))}
    </nav>
  );
}
