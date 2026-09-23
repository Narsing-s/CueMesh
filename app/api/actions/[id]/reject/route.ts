import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const action = await prisma.action.findUnique({ where: { id: params.id } });
  if (!action) return NextResponse.json({ error: "Action not found" }, { status: 404 });
  if (action.status !== "PROPOSED") return NextResponse.json({ error: "Only proposed actions can be rejected" }, { status: 409 });

  const updated = await prisma.action.update({ where: { id: action.id }, data: { status: "REJECTED" } });
  await prisma.auditEvent.create({ data: { action: "ACTION_REJECTED", entityType: "Action", entityId: action.id, metadata: { situationId: action.situationId } } });
  return NextResponse.json({ action: updated });
}