import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pipeline Logs",
};

export default function AdminLogsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Pipeline Logs</h1>
          <p className="mt-1 text-sm text-muted">
            Real-time structured observability — Phase 4 build target
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-xs font-mono text-muted uppercase tracking-widest">
            Log stream viewer — Phase 4 build target
          </p>
        </div>
      </div>
    </main>
  );
}
