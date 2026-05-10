import { NextResponse } from "next/server";
import { getBook } from "@/lib/queries/books";
import { bookRouteParamsSchema } from "@/lib/validation/content";

type BookRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: BookRouteProps) {
  const parsed = bookRouteParamsSchema.safeParse(await params);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid book slug." }, { status: 400 });
  }

  const book = await getBook(parsed.data.slug);

  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }

  return NextResponse.json({ book });
}
