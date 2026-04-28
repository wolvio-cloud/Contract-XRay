import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/config";
import type { Database } from "@/types/database";
import type { PersistFn } from "@/lib/logger";

export function createServerSupabaseClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Returns a PersistFn that writes log entries to pipeline_logs.
 * Throws on Supabase error so safePersist in logger.ts can catch and swallow.
 */
export function createLogPersister(
  supabase: ReturnType<typeof createServerSupabaseClient>
): PersistFn {
  return async (entry) => {
    const { error } = await supabase.from("pipeline_logs").insert(entry);
    if (error) throw new Error(error.message);
  };
}

/** Convenience: create both client and persister in one call. */
export function createServerContext() {
  const supabase = createServerSupabaseClient();
  const persist = createLogPersister(supabase);
  return { supabase, persist };
}
