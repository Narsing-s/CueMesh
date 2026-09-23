import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.situationId) return NextResponse.json({ error: "situationId is required" }, { status: 400 });

  return NextResponse.json({
    status: "not_started",
    message: "Insight generation requires a configured AI provider and ingestion data.",
    situationId: body.situationId
  }, { status: 501 });
}