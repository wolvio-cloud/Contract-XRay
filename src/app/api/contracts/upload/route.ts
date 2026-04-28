import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types";

export const runtime = "nodejs";

// TODO(phase-3): Multipart PDF upload → Supabase Storage → contracts row (status=pending)
export async function POST(): Promise<NextResponse<ApiErrorResponse>> {
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
