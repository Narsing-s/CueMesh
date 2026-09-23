import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request,{params}:{params:{id:string}}) {
  const replays=await prisma.situationReplay.findMany({where:{situationId:params.id},orderBy:{version:"desc"},take:50});
  return NextResponse.json({ok:true,replays});
}

export async function POST(_: Request,{params}:{params:{id:string}}) {
  const s=await prisma.situation.findUnique({where:{id:params.id},include:{documents:true,events:true,actions:true,insights:true,missingItems:true,entities:true}});
  if(!s)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
  const latest=await prisma.situationReplay.findFirst({where:{situationId:s.id},orderBy:{version:"desc"}});
  const replay=await prisma.situationReplay.create({data:{situationId:s.id,version:(latest?.version??0)+1,snapshot:s}});
  return NextResponse.json({ok:true,replay},{status:201});
}
