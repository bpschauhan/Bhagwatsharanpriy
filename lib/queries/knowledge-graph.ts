import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { knowledgeEdges as staticEdges, knowledgeNodes as staticNodes } from "@/lib/content/knowledge-graph";
import type { KnowledgeEdge, KnowledgeNode } from "@/types/knowledge";

export const getKnowledgeGraph = cache(async (): Promise<{ nodes: KnowledgeNode[]; edges: KnowledgeEdge[] }> => {
  if (!env.DATABASE_URL) {
    return { nodes: staticNodes, edges: staticEdges };
  }

  try {
    const [nodes, edges] = await Promise.all([
      prisma.knowledgeNode.findMany({
        orderBy: { title: "asc" },
        include: {
          concept: true,
          book: true,
        },
      }),
      prisma.knowledgeEdge.findMany({
        include: {
          sourceNode: true,
          targetNode: true,
        },
        orderBy: { weight: "desc" },
      }),
    ]);

    if (nodes.length === 0) {
      return { nodes: staticNodes, edges: staticEdges };
    }

    const nodeByDatabaseId = new Map<string, KnowledgeNode>();
    const mappedNodes = nodes.map((node) => {
      const fallback = staticNodes.find((item) => item.slug === node.slug);
      const mapped: KnowledgeNode = {
        id: fallback?.id ?? node.slug,
        slug: node.slug,
        title: node.title,
        subtitle: node.subtitle ?? undefined,
        summary: node.summary,
        nodeType: node.nodeType,
        parentId: fallback?.parentId,
        x: fallback?.x ?? 50,
        y: fallback?.y ?? 50,
        href: node.book?.slug ? `/books/${node.book.slug}` : node.concept?.slug ? `/concepts/${node.concept.slug}` : fallback?.href,
        tags: fallback?.tags,
      };
      nodeByDatabaseId.set(node.id, mapped);
      return mapped;
    });

    const mappedEdges = edges.flatMap((edge) => {
      const source = nodeByDatabaseId.get(edge.sourceNodeId);
      const target = nodeByDatabaseId.get(edge.targetNodeId);

      if (!source || !target) {
        return [];
      }

      return {
        id: `${source.id}-${edge.relationshipType.toLowerCase()}-${target.id}`,
        source: source.id,
        target: target.id,
        relationshipType: edge.relationshipType,
        label: edge.label,
        summary: edge.summary,
        explanation: edge.explanation ?? undefined,
        bidirectional: edge.bidirectional,
        weight: edge.weight,
      } satisfies KnowledgeEdge;
    });

    return {
      nodes: mappedNodes,
      edges: mappedEdges.length > 0 ? mappedEdges : staticEdges,
    };
  } catch {
    return { nodes: staticNodes, edges: staticEdges };
  }
});
