import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (typeof body?.resolved !== "boolean")
    return NextResponse.json({ ok: false, error: "resolved must be boolean" }, { status: 400 });
  const item = await prisma.missingItem.update({
    where: { id: params.id },
    data: { resolved: body.resolved }
  }).catch(() => null);
  if (!item) return NextResponse.json({ ok: false, error: "Missing item not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}
