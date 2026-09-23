import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const situationId = new URL(request.url).searchParams.get("situationId");
  if (!situationId) return NextResponse.json({ok:false,error:"situationId is required"},{status:400});
  const notifications = await prisma.notification.findMany({where:{situationId},orderBy:{scheduledFor:"asc"}});
  return NextResponse.json({ok:true,notifications});
}

export async function POST(request: Request) {
  const body = await request.json().catch(()=>null);
  if (typeof body?.situationId !== "string" || typeof body?.title !== "string" || typeof body?.body !== "string")
    return NextResponse.json({ok:false,error:"situationId, title and body are required"},{status:400});
  const notification=await prisma.notification.create({data:{
    situationId:body.situationId,title:body.title.trim(),body:body.body.trim(),
    channel:typeof body.channel==="string"?body.channel:"in-app",
    userId:typeof body.userId==="string"?body.userId:undefined,
    scheduledFor:body.scheduledFor?new Date(body.scheduledFor):undefined
  }});
  return NextResponse.json({ok:true,notification},{status:201});
}