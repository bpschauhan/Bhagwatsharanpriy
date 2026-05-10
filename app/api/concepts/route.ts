import { NextResponse } from "next/server";
import { getConceptProfiles } from "@/lib/queries/concepts";

export async function GET() {
  return NextResponse.json({ concepts: await getConceptProfiles() });
}
