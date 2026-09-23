import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const situationId = new URL(request.url).searchParams.get("situationId");
  if (!situationId) return NextResponse.json({ error: "situationId is required" }, { status: 400 });
  const documents = await prisma.document.findMany({
    where: { situationId },
    select: { id: true, name: true, mimeType: true, sizeBytes: true, createdAt: true, versions: true }
  });
  return NextResponse.json({ documents });
}