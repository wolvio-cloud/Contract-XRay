import "server-only";
import pino from "pino";

export interface PipelineLogInsert {
  correlation_id: string;
  level: string;
  operation: string;
  span_id?: string | null;
  contract_id?: string | null;
  duration_ms?: number | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  cost_usd?: number | null;
  status?: string | null;
  error?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type PersistFn = (entry: PipelineLogInsert) => Promise<void>;

export interface SpanLog {
  span_id?: string;
  operation: string;
  contract_id?: string;
  duration_ms?: number;
  input_tokens?: number;
  output_tokens?: number;
  cost_usd?: number;
  status?: "success" | "failed" | "pending";
  error?: string;
  metadata?: Record<string, unknown>;
}

const pinoInstance = pino({
  level: process.env["LOG_LEVEL"] ?? "info",
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function createLogger(correlationId: string, persist?: PersistFn) {
  function emit(level: "info" | "warn" | "error", fields: SpanLog): void {
    pinoInstance[level]({ correlation_id: correlationId, ...fields });
    if (persist) {
      void safePersist(persist, level, correlationId, fields);
    }
  }

  return {
    info: (fields: SpanLog) => emit("info", fields),
    warn: (fields: SpanLog) => emit("warn", fields),
    error: (fields: SpanLog) => emit("error", fields),
  };
}

export type Logger = ReturnType<typeof createLogger>;

async function safePersist(
  persist: PersistFn,
  level: string,
  correlationId: string,
  fields: SpanLog
): Promise<void> {
  try {
    await persist({
      correlation_id: correlationId,
      level,
      operation: fields.operation,
      span_id: fields.span_id ?? null,
      contract_id: fields.contract_id ?? null,
      duration_ms: fields.duration_ms ?? null,
      input_tokens: fields.input_tokens ?? null,
      output_tokens: fields.output_tokens ?? null,
      cost_usd: fields.cost_usd ?? null,
      status: fields.status ?? null,
      error: fields.error ?? null,
      metadata: fields.metadata ?? null,
    });
  } catch {
    // Persistence must never throw — pipeline continues regardless
    pinoInstance.warn({
      correlation_id: correlationId,
      operation: "logger.persist.failed",
    });
  }
}
