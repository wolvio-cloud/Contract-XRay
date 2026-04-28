// TODO(phase-2): Extraction pipeline orchestrator
// Steps (in order):
//   1. Fetch PDF blob from Supabase Storage
//   2. Parse PDF → { pages: [{ page_number, text, spans: [{ text, bbox }] }] }
//   3. Build extraction prompt from Zod schema descriptions
//   4. Call Claude with retry + timeout
//   5. Zod-validate the response — fail loud on schema mismatch
//   6. Bbox-match every source_clause against PDF spans (fuzzy alignment)
//   7. Persist extraction JSONB to contracts.extraction
//   8. Update extraction_status, log every step with span_id
export {};
