import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Reports configured capabilities without exposing secret values. */
export async function GET() {
  const production = process.env.NODE_ENV === "production";
  const capabilities = {
    authenticationConfigured: Boolean(process.env.AUTH_SECRET),
    durableDatabaseConfigured: Boolean(process.env.DATABASE_URL),
    objectStorageConfigured: Boolean(process.env.OBJECT_STORAGE_BUCKET && process.env.OBJECT_STORAGE_REGION),
    aiProviderConfigured: Boolean(process.env.AI_PROVIDER_API_KEY),
    sharedRateLimitConfigured: Boolean(process.env.RATE_LIMIT_REDIS_URL),
  };
  const missingProductionControls = production
    ? Object.entries(capabilities).filter(([, configured]) => !configured).map(([name]) => name)
    : [];

  return NextResponse.json({
    ok: true,
    service: "cuemesh-api",
    status: missingProductionControls.length ? "degraded" : "ready",
    mode: production ? "production" : "development",
    capabilities,
    missingProductionControls,
    timestamp: new Date().toISOString(),
  });
}
