import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const situation = await prisma.situation.findUnique({ where:{id:params.id}, include:{documents:true,events:true,actions:true,missingItems:true} });
  if (!situation) return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
  const nodes = [{id:"situation",type:"situation",label:situation.title}, ...situation.documents.map((d:any)=>({id:"document:"+d.id,type:"document",label:d.name})), ...situation.events.map((e:any)=>({id:"event:"+e.id,type:"event",label:e.title})), ...situation.actions.map((a:any)=>({id:"action:"+a.id,type:"action",label:a.title,status:a.status})), ...situation.missingItems.filter((m:any)=>!m.resolved).map((m:any)=>({id:"gap:"+m.id,type:"gap",label:m.label}))];
  const edges = [...situation.documents.map((d:any)=>({from:"situation",to:"document:"+d.id,label:"evidence"})), ...situation.events.map((e:any)=>({from:"situation",to:"event:"+e.id,label:"timeline"})), ...situation.actions.map((a:any)=>({from:"situation",to:"action:"+a.id,label:a.status})), ...situation.missingItems.filter((m:any)=>!m.resolved).map((m:any)=>({from:"situation",to:"gap:"+m.id,label:"needs"}))];
  return NextResponse.json({ok:true,graph:{nodes,edges}});
}
