import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const action = await prisma.action.findUnique({ where: { id: params.id } });
  if (!action) return NextResponse.json({ error: "Action not found" }, { status: 404 });
  if (action.status !== "PROPOSED") return NextResponse.json({ error: "Only proposed actions can be approved" }, { status: 409 });

  const actorId = request.headers.get("x-cuemesh-actor") || "human";
  const updated = await prisma.action.update({
    where: { id: action.id },
    data: { status: "APPROVED", approvedAt: new Date(), approvedBy: actorId }
  });
  await prisma.auditEvent.create({ data: { action: "ACTION_APPROVED", entityType: "Action", entityId: action.id, metadata: { situationId: action.situationId, actorId } } });
  return NextResponse.json({ action: updated, approval: { required: true, approved: true, actorId } });
}