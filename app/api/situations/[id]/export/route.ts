import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request,{params}:{params:{id:string}}){
  const situation=await prisma.situation.findUnique({where:{id:params.id},include:{members:true,documents:true,events:true,actions:{include:{evidence:true,dependencies:true,dependents:true}},insights:true,missingItems:true,entities:{include:{entity:true}},notifications:true,replays:true}});
  if(!situation)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
  return NextResponse.json({ok:true,exportedAt:new Date().toISOString(),situation});
}
