import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types";

export const runtime = "nodejs";

// TODO(phase-3): Fetch contract row + extraction by ID
export async function GET(): Promise<NextResponse<ApiErrorResponse>> {
  return NextResponse.json(
    {
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Phase 3 build target",
        correlation_id: crypto.randomUUID(),
      },
    },
    { status: 501 }
  );
}
