import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const situation = await prisma.situation.findUnique({ where: { id: params.id }, include: { documents: true, events: true, actions: true, missingItems: true } });
  if (!situation) return NextResponse.json({ ok:false, error:"Situation not found" }, { status:404 });
  const candidates = [
    situation.documents.length === 0 ? ["Supporting document", "No document has been added to this situation yet."] : null,
    situation.events.length === 0 ? ["Important event/date", "No timeline event has been recorded yet."] : null,
    situation.actions.length === 0 ? ["Next action", "No follow-up action has been proposed yet."] : null,
  ].filter(Boolean) as string[][];
  const created:any[] = [];
  for (const [label, reason] of candidates) {
    const existing = await prisma.missingItem.findFirst({ where: { situationId: params.id, label } });
    if (!existing) created.push(await prisma.missingItem.create({ data: { situationId: params.id, label, reason, resolved:false } }));
  }
  return NextResponse.json({ ok:true, detected:created.length, items:await prisma.missingItem.findMany({ where:{situationId:params.id}, orderBy:{createdAt:"desc"} }) });
}
