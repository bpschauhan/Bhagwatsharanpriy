import { NextResponse } from "next/server";
import { searchWisdom } from "@/lib/search";
import { searchParamsSchema } from "@/lib/validation/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = searchParamsSchema.safeParse({ q: searchParams.get("q") ?? "" });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search query." }, { status: 400 });
  }

  return NextResponse.json(await searchWisdom(parsed.data.q));
}
