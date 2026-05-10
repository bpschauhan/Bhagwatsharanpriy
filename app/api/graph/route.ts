import { NextResponse } from "next/server";
import { getKnowledgeGraph } from "@/lib/queries/knowledge-graph";

export async function GET() {
  return NextResponse.json(await getKnowledgeGraph());
}
