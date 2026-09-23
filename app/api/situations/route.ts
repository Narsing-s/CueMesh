import { NextResponse } from "next/server";

type Situation = {
  id: string;
  title: string;
  status: "Active" | "Archived";
  progress: number;
  createdAt: string;
};

const situations: Situation[] = [];

export async function GET() {
  return NextResponse.json({ situations });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const situation: Situation = {
    id: crypto.randomUUID(),
    title,
    status: "Active",
    progress: 0,
    createdAt: new Date().toISOString()
  };

  situations.unshift(situation);
  return NextResponse.json({ situation }, { status: 201 });
}