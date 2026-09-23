import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const situation = await prisma.situation.findUnique({
    where:{id:params.id},
    include:{entities:{include:{entity:{include:{outgoing:true,incoming:true}}}},documents:{include:{citations:true}}}
  });
  if (!situation) return NextResponse.json({ok:false,error:"Situation not found"},{status:404});
  return NextResponse.json({ok:true, graph:{entities:situation.entities, citations:situation.documents.flatMap(d=>d.citations)}});
}