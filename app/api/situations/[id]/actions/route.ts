import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const actions = await prisma.action.findMany({ where: { situationId: params.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ actions });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) return NextResponse.json({ error: "title is required and must be <= 200 characters" }, { status: 400 });
  const action = await prisma.action.create({
    data: { situationId: params.id, title, description: typeof body.description === "string" ? body.description.trim() : undefined }
  });
  await prisma.auditEvent.create({ data: { action: "ACTION_PROPOSED", entityType: "Action", entityId: action.id, metadata: { situationId: params.id } } });
  return NextResponse.json({ action }, { status: 201 });
}