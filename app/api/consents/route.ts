import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request:Request){
  const situationId=new URL(request.url).searchParams.get("situationId");
  if(!situationId)return NextResponse.json({ok:false,error:"situationId is required"},{status:400});
  const consents=await prisma.consent.findMany({where:{situationId},orderBy:{createdAt:"desc"}});
  return NextResponse.json({ok:true,consents});
}

export async function POST(request:Request){
  const b=await request.json().catch(()=>null);
  if(typeof b?.situationId!=="string"||typeof b?.userId!=="string"||typeof b?.purpose!=="string"||typeof b?.granted!=="boolean")
    return NextResponse.json({ok:false,error:"situationId, userId, purpose and granted are required"},{status:400});
  const consent=await prisma.consent.upsert({
    where:{situationId_userId_purpose:{situationId:b.situationId,userId:b.userId,purpose:b.purpose}},
    create:{situationId:b.situationId,userId:b.userId,purpose:b.purpose,granted:b.granted,grantedAt:b.granted?new Date():undefined},
    update:{granted:b.granted,grantedAt:b.granted?new Date():undefined,revokedAt:b.granted?null:new Date()}
  });
  return NextResponse.json({ok:true,consent},{status:201});
}
