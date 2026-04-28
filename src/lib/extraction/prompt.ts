// TODO(phase-2): Prompt builder
// - Traverses ContractExtractionSchema recursively using z.ZodObject._def
// - Extracts .description from every field to build JSON schema instructions
// - Constructs system prompt: domain context + TracedField rules + confidence calibration
// - Includes 2-shot examples (one O&M clause, one Supply clause)
// - Schema and prompt never drift — Zod is the single source of truth
export {};
