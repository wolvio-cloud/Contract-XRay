-- ============================================================
-- Contract X-Ray — initial schema
-- Run via: supabase db push  (or Supabase dashboard SQL editor)
-- ============================================================

-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('OM','Service','Supply','Admin','Other')),
  title TEXT,
  pdf_storage_path TEXT NOT NULL,
  raw_text TEXT,
  page_count INT,
  extraction JSONB,
  extraction_status TEXT DEFAULT 'pending'
    CHECK (extraction_status IN ('pending','processing','completed','failed')),
  extraction_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contracts_status ON contracts(extraction_status);
CREATE INDEX idx_contracts_extraction ON contracts USING GIN (extraction);

-- Pipeline logs (persisted for the /admin/logs observer view)
CREATE TABLE pipeline_logs (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  correlation_id TEXT NOT NULL,
  span_id TEXT,
  level TEXT NOT NULL,
  operation TEXT NOT NULL,
  contract_id TEXT,
  duration_ms INT,
  input_tokens INT,
  output_tokens INT,
  cost_usd NUMERIC(10,6),
  status TEXT,
  metadata JSONB,
  error TEXT
);

CREATE INDEX idx_logs_correlation ON pipeline_logs(correlation_id);
CREATE INDEX idx_logs_ts ON pipeline_logs(ts DESC);
CREATE INDEX idx_logs_operation ON pipeline_logs(operation);

-- RLS enabled; single-user demo — service role has full access
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role all access" ON contracts
  FOR ALL TO service_role USING (true);

CREATE POLICY "service role all access" ON pipeline_logs
  FOR ALL TO service_role USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
