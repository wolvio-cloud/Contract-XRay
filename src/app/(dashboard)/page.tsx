import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">
            Contract X-Ray
          </h1>
          <p className="mt-1 text-sm text-muted">
            Renewable energy contract intelligence — Wolvio D-EDGE platform
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-xs font-mono text-muted uppercase tracking-widest">
            Portfolio dashboard — Phase 4 build target
          </p>
          <p className="mt-2 text-sm text-muted">
            Upload zone, contract cards, and sample seed will appear here.
          </p>
        </div>
      </div>
    </main>
  );
}
