import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const situation = await prisma.situation.findUnique({
    where: { id: params.id },
    include: { documents: true, events: true, actions: true, missingItems: true }
  });
  if (!situation) return NextResponse.json({ ok:false, error:"Situation not found" }, { status:404 });

  const unresolved = new Set((situation.missingItems || []).filter((x:any)=>!x.resolved).map((x:any)=>x.label));
  const candidates: [string,string,string][] = [];

  if (situation.documents.length === 0) candidates.push(["Supporting document","No document has been added to this situation yet.","EVIDENCE"]);
  if (situation.events.length === 0) candidates.push(["Important event/date","No timeline event has been recorded yet.","TIMELINE"]);
  if (situation.actions.length === 0) candidates.push(["Next action","No follow-up action has been proposed yet.","FOLLOW_UP"]);
  if (situation.documents.length > 0 && situation.actions.length === 0) candidates.push(["Document review follow-up","Evidence exists, but no follow-up action has been proposed to review it.","FOLLOW_UP"]);
  if (situation.actions.some((a:any)=>a.status === "PROPOSED")) candidates.push(["Human approval pending","One or more follow-up actions are awaiting human approval.","APPROVAL"]);

  const created:any[] = [];
  for (const [label, reason, category] of candidates) {
    if (!unresolved.has(label)) {
      created.push(await prisma.missingItem.create({
        data:{ situationId:params.id, label, reason, category, resolved:false }
      }));
    }
  }
  return NextResponse.json({
    ok:true,
    detected:created.length,
    items:await prisma.missingItem.findMany({where:{situationId:params.id},orderBy:{createdAt:"desc"}})
  });
}