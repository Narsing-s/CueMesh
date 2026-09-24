import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.CUEMESH_CRON_SECRET;
  if (secret && request.headers.get("x-cuemesh-cron") !== secret)
    return NextResponse.json({ ok:false, error:"Unauthorized scheduler request" }, { status:401 });

  const now = new Date();
  const pending = await prisma.notification.findMany({ where:{status:"PENDING"}, orderBy:{scheduledFor:"asc"} });
  const due = pending.filter((n:any)=>!n.scheduledFor || new Date(n.scheduledFor).getTime() <= now.getTime());
  const delivered:any[] = [];
  for (const n of due) {
    delivered.push(await prisma.notification.update({where:{id:n.id},data:{status:"DELIVERED",deliveredAt:now}}));
  }
  return NextResponse.json({ok:true,processed:delivered.length,notifications:delivered});
}
