import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const playbooks=await prisma.playbook.findMany({include:{steps:{orderBy:{position:"asc"}}},orderBy:{createdAt:"desc"}});
  return NextResponse.json({ok:true,playbooks});
}
export async function POST(request: Request) {
  const body=await request.json().catch(()=>null);
  const name=typeof body?.name==="string"?body.name.trim():"";
  if(!name||name.length>160)return NextResponse.json({ok:false,error:"name is required and must be <= 160 characters"},{status:400});
  const steps=Array.isArray(body.steps)?body.steps:[];
  const playbook=await prisma.playbook.create({data:{name,description:typeof body.description==="string"?body.description.trim():undefined,steps:{create:steps.slice(0,100).map((s:any,i:number)=>({position:i+1,title:String(s.title||"").trim(),description:typeof s.description==="string"?s.description.trim():undefined})).filter((s:any)=>s.title)}} ,include:{steps:true}});
  return NextResponse.json({ok:true,playbook},{status:201});
}