import { NextResponse } from "next/server";

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

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }
  if (typeof situationId !== "string" || !situationId) {
    return NextResponse.json({ error: "situationId is required." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File must be between 1 byte and 10 MB." }, { status: 413 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported document type." }, { status: 415 });
  }

  return NextResponse.json({
    accepted: true,
    status: "queued",
    message: "Validated successfully. Persistent object storage and extraction workers are the next ingestion layer.",
    file: { name: file.name, type: file.type, size: file.size },
    situationId
  }, { status: 202 });
}