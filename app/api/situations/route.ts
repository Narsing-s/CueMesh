import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const situations = await prisma.situation.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, status: true, progress: true, createdAt: true, updatedAt: true }
    });
    return NextResponse.json({ situations });
  } catch {
    return NextResponse.json({ error: "CueMesh runtime store is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 160) return NextResponse.json({ error: "title must be between 1 and 160 characters" }, { status: 400 });
  try {
    const situation = await prisma.situation.create({ data: { title }, select: { id: true, title: true, status: true, progress: true, createdAt: true } });
    return NextResponse.json({ situation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "CueMesh runtime store is unavailable." }, { status: 503 });
  }
}