import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.situationId !== "string" || typeof body?.type !== "string")
    return NextResponse.json({ok:false,error:"situationId and type are required"},{status:400});
  const job = await prisma.job.create({data:{situationId:body.situationId,type:body.type.trim(),payload:body.payload ?? undefined}});
  return NextResponse.json({ok:true,job},{status:201});
}

export async function GET(request: Request) {
  const situationId = new URL(request.url).searchParams.get("situationId");
  if (!situationId) return NextResponse.json({ok:false,error:"situationId is required"},{status:400});
  const jobs = await prisma.job.findMany({where:{situationId},orderBy:{createdAt:"desc"},take:100});
  return NextResponse.json({ok:true,jobs});
}
