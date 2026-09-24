import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const situationId = form?.get("situationId");

  if (!(file instanceof File)) return NextResponse.json({ error: "A file is required." }, { status: 400 });
  if (typeof situationId !== "string" || !situationId) return NextResponse.json({ error: "situationId is required." }, { status: 400 });
  if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File must be between 1 byte and 10 MB." }, { status: 413 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Unsupported document type. Use PDF, DOCX, TXT, PNG or JPG." }, { status: 415 });

  const situation = await prisma.situation.findUnique({ where: { id: situationId }, select: { id: true } });
  if (!situation) return NextResponse.json({ error: "Situation not found." }, { status: 404 });

  // Database-free mode: retain the uploaded bytes in the process-local store.
  // The file disappears when the server instance restarts.
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const contentBase64 = Buffer.from(binary, "binary").toString("base64");

  const document = await prisma.document.create({
    data: {
      situationId,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      storage: "memory",
      contentBase64,
      createdAt: new Date()
    },
    select: { id: true, name: true, mimeType: true, sizeBytes: true, createdAt: true }
  });

  await prisma.event.create({
    data: {
      situationId,
      title: "Document uploaded",
      description: file.name,
      occurredAt: new Date()
    }
  });

  return NextResponse.json({ ok: true, accepted: true, status: "stored", document }, { status: 201 });
}

export async function GET(request: Request) {
  const situationId = new URL(request.url).searchParams.get("situationId");
  if (!situationId) return NextResponse.json({ error: "situationId is required" }, { status: 400 });
  const documents = await prisma.document.findMany({
    where: { situationId },
    select: { id: true, name: true, mimeType: true, sizeBytes: true, createdAt: true }
  });
  return NextResponse.json({ ok: true, documents });
}
