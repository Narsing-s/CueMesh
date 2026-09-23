import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const situationId = new URL(request.url).searchParams.get("situationId");
  if (!situationId) return NextResponse.json({ error: "situationId is required" }, { status: 400 });
  const items = await prisma.missingItem.findMany({ where: { situationId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}