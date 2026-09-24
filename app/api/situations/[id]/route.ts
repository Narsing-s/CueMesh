import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request,{params}:{params:{id:string}}){
 const situation=await prisma.situation.findUnique({where:{id:params.id},include:{documents:{select:{id:true,name:true,mimeType:true,sizeBytes:true,createdAt:true}},events:true,actions:true,insights:true,missingItems:true}});
 if(!situation)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
 const total=(situation.documents?.length||0)+(situation.events?.length||0)+(situation.actions?.length||0);
 const unresolved=(situation.missingItems||[]).filter((x:any)=>!x.resolved).length;
 const progress=Math.min(100,Math.max(0,Math.round(total*20-unresolved*10)));
 return NextResponse.json({ok:true,situation:{...situation,progress}});
}

export async function DELETE(_: Request,{params}:{params:{id:string}}){
 const existing=await prisma.situation.findUnique({where:{id:params.id},select:{id:true}});
 if(!existing)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
 await prisma.situation.delete({where:{id:params.id}});
 return NextResponse.json({ok:true,deletedId:params.id});
}
