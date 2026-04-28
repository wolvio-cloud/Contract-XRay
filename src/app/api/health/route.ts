import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

// No DB persist on health — avoids bootstrapping failure before Supabase is configured.
export async function GET(): Promise<NextResponse> {
  const correlationId = crypto.randomUUID();
  const logger = createLogger(correlationId);

  logger.info({
    span_id: "health.check",
    operation: "api.health.get",
    status: "success",
  });

  return NextResponse.json({
    ok: true,
    correlation_id: correlationId,
    ts: new Date().toISOString(),
    service: "contract-xray",
    version: "0.1.0",
  });
}
