import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const situation = await prisma.situation.findUnique({
      where: { id: params.id },
      include: { documents: true, events: true, actions: true, insights: true, missingItems: true }
    });
    if (!situation) return NextResponse.json({ error: "Situation not found" }, { status: 404 });
    return NextResponse.json({ situation });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}