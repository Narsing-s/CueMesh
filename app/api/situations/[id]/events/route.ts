import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const events = await prisma.event.findMany({ where: { situationId: params.id }, orderBy: { occurredAt: "desc" } });
  return NextResponse.json({ ok: true, events });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) return NextResponse.json({ ok:false, error:"title is required and must be <= 200 characters" }, { status:400 });
  const event = await prisma.event.create({
    data: { situationId: params.id, title, description: typeof body?.description === "string" ? body.description.trim() : undefined, occurredAt: body?.occurredAt ? new Date(body.occurredAt) : undefined }
  });
  return NextResponse.json({ ok:true, event }, { status:201 });
}