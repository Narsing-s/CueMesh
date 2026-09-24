import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function createsCycle(actionId: string, dependsOnActionId: string): Promise<boolean> {
  const seen = new Set<string>();
  let current: string | undefined = dependsOnActionId;
  while (current) {
    if (current === actionId) return true;
    if (seen.has(current)) return true;
    seen.add(current);
    const edge: { dependsOnActionId: string } | null = await prisma.actionDependency.findFirst({
      where: { actionId: current },
      select: { dependsOnActionId: true }
    });
    current = edge?.dependsOnActionId;
  }
  return false;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const actionId = body?.actionId;
  const dependsOnActionId = body?.dependsOnActionId;
  if (typeof actionId !== "string" || typeof dependsOnActionId !== "string" || actionId === dependsOnActionId)
    return NextResponse.json({ ok: false, error: "Valid distinct actionId and dependsOnActionId are required" }, { status: 400 });
  if (await createsCycle(actionId, dependsOnActionId))
    return NextResponse.json({ ok: false, error: "Dependency would create a cycle" }, { status: 409 });
  const dependency = await prisma.actionDependency.create({ data: { actionId, dependsOnActionId } });
  return NextResponse.json({ ok: true, dependency }, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.actionId !== "string" || typeof body?.dependsOnActionId !== "string")
    return NextResponse.json({ ok: false, error: "actionId and dependsOnActionId are required" }, { status: 400 });
  await prisma.actionDependency.delete({
    where: { actionId_dependsOnActionId: { actionId: body.actionId, dependsOnActionId: body.dependsOnActionId } }
  }).catch(() => null);
  return NextResponse.json({ ok: true });
}
