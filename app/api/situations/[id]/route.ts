import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request,{params}:{params:{id:string}}){
 const situation=await prisma.situation.findUnique({where:{id:params.id},include:{documents:true,events:true,actions:true,insights:true,missingItems:true}});
 if(!situation)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
 return NextResponse.json({ok:true,situation});
}

export async function DELETE(_: Request,{params}:{params:{id:string}}){
 const existing=await prisma.situation.findUnique({where:{id:params.id},select:{id:true}});
 if(!existing)return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
 await prisma.situation.delete({where:{id:params.id}});
 return NextResponse.json({ok:true,deletedId:params.id});
}
