import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract Detail",
};

interface PageProps {
  params: { id: string };
}

export default function ContractDetailPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Contract X-Ray</h1>
          <p className="mt-1 font-mono text-xs text-muted">
            {params.id}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[80vh]">
          {/* Left pane: PDF viewer */}
          <div className="rounded-lg border border-border bg-surface p-8 flex items-center justify-center">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">
              PDF viewer — Phase 4 build target
            </p>
          </div>

          {/* Right pane: extraction data */}
          <div className="rounded-lg border border-border bg-surface p-8 flex items-center justify-center">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">
              X-Ray extraction pane — Phase 4 build target
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
