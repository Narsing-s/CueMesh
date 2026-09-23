import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const entityId = new URL(request.url).searchParams.get("entityId");
  if (!entityId) return NextResponse.json({ error: "entityId is required" }, { status: 400 });
  const events = await prisma.auditEvent.findMany({ where: { entityId }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ events });
}