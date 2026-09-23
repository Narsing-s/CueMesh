import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const situation = await prisma.situation.findUnique({ where:{ id:params.id } });
  if (!situation) return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
  const updated = await prisma.situation.update({ where:{id:params.id}, data:{status:"ACTIVE"} });
  await prisma.auditEvent.create({data:{action:"SITUATION_RESTORED",entityType:"Situation",entityId:params.id}});
  return NextResponse.json({ok:true,situation:updated});
}