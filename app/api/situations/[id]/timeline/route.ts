import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [events, documents, actions, notifications, audit] = await Promise.all([
    prisma.event.findMany({ where: { situationId: params.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.document.findMany({ where: { situationId: params.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.action.findMany({ where: { situationId: params.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.notification.findMany({ where: { situationId: params.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.auditEvent.findMany({ where: { entityId: params.id }, orderBy: { createdAt: "desc" }, take: 100 })
  ]);
  const timeline = [
    ...events.map((x:any) => ({ type: "event", at: x.createdAt, data: x })),
    ...documents.map((x:any) => ({ type: "document", at: x.createdAt, data: x })),
    ...actions.map((x:any) => ({ type: "action", at: x.createdAt, data: x })),
    ...notifications.map((x:any) => ({ type: "notification", at: x.createdAt, data: x })),
    ...audit.map((x:any) => ({ type: "audit", at: x.createdAt, data: x }))
  ].sort((a,b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return NextResponse.json({ ok: true, timeline });
}
