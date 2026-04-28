export interface Database {
  public: {
    Tables: {
      contracts: {
        Row: {
          id: string;
          contract_id: string;
          contract_type: "OM" | "Service" | "Supply" | "Admin" | "Other";
          title: string | null;
          pdf_storage_path: string;
          raw_text: string | null;
          page_count: number | null;
          extraction: Record<string, unknown> | null;
          extraction_status: "pending" | "processing" | "completed" | "failed";
          extraction_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          contract_type: "OM" | "Service" | "Supply" | "Admin" | "Other";
          title?: string | null;
          pdf_storage_path: string;
          raw_text?: string | null;
          page_count?: number | null;
          extraction?: Record<string, unknown> | null;
          extraction_status?: "pending" | "processing" | "completed" | "failed";
          extraction_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string;
          contract_type?: "OM" | "Service" | "Supply" | "Admin" | "Other";
          title?: string | null;
          pdf_storage_path?: string;
          raw_text?: string | null;
          page_count?: number | null;
          extraction?: Record<string, unknown> | null;
          extraction_status?: "pending" | "processing" | "completed" | "failed";
          extraction_error?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      pipeline_logs: {
        Row: {
          id: number;
          ts: string;
          correlation_id: string;
          span_id: string | null;
          level: string;
          operation: string;
          contract_id: string | null;
          duration_ms: number | null;
          input_tokens: number | null;
          output_tokens: number | null;
          cost_usd: number | null;
          status: string | null;
          metadata: Record<string, unknown> | null;
          error: string | null;
        };
        Insert: {
          id?: number;
          ts?: string;
          correlation_id: string;
          span_id?: string | null;
          level: string;
          operation: string;
          contract_id?: string | null;
          duration_ms?: number | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          cost_usd?: number | null;
          status?: string | null;
          metadata?: Record<string, unknown> | null;
          error?: string | null;
        };
        Update: {
          ts?: string;
          correlation_id?: string;
          span_id?: string | null;
          level?: string;
          operation?: string;
          contract_id?: string | null;
          duration_ms?: number | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          cost_usd?: number | null;
          status?: string | null;
          metadata?: Record<string, unknown> | null;
          error?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
