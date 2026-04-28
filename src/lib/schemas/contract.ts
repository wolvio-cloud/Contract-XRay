import { z } from "zod";

// ---------------------------------------------------------------------------
// Core trace pattern — every commercial field carries provenance
// ---------------------------------------------------------------------------

export function tracedField<T extends z.ZodTypeAny>(valueSchema: T) {
  return z.object({
    value: valueSchema,
    source_clause: z
      .string()
      .max(500)
      .describe(
        "Verbatim quote from the PDF (max 50 words) that directly supports this value"
      ),
    page_number: z
      .number()
      .int()
      .positive()
      .describe("1-indexed page number where the source_clause appears"),
    bbox: z
      .tuple([z.number(), z.number(), z.number(), z.number()])
      .optional()
      .describe(
        "[x0, y0, x1, y1] bounding box — populated server-side after bbox matching, not by Claude"
      ),
    confidence: z
      .enum(["high", "medium", "low"])
      .describe(
        "high = explicitly stated in contract text; medium = inferred from clear context; low = estimated or ambiguous"
      ),
    extracted_at: z
      .string()
      .datetime()
      .describe("ISO 8601 timestamp when this field was extracted"),
  });
}

export type TracedField<T> = {
  value: T;
  source_clause: string;
  page_number: number;
  bbox?: [number, number, number, number];
  confidence: "high" | "medium" | "low";
  extracted_at: string;
};

// ---------------------------------------------------------------------------
// Contract Metadata
// ---------------------------------------------------------------------------

const ContractMetadataSchema = z.object({
  contract_id: tracedField(z.string()).describe(
    "Contract reference number or identifier as printed on the document"
  ),
  contract_type: tracedField(
    z.enum(["OM", "Service", "Supply", "Admin", "Other"])
  ).describe(
    "Classification: OM = Operations & Maintenance, Service, Supply (equipment/materials), Admin, or Other"
  ),
  title: tracedField(z.string()).describe(
    "Full formal title of the contract as it appears on the cover or header"
  ),
  governing_law: tracedField(z.string()).describe(
    "Jurisdiction and governing law — e.g. 'English law', 'German law', 'Danish law'"
  ),
  parties: z.object({
    supplier: tracedField(z.string()).describe(
      "Full legal name of the supplying / service provider party"
    ),
    customer: tracedField(z.string()).describe(
      "Full legal name of the customer / buyer / offtaker party"
    ),
  }),
  execution_date: tracedField(z.string()).describe(
    "Date the contract was signed or executed — ISO 8601 (YYYY-MM-DD) if determinable, otherwise describe"
  ),
  commencement_date: tracedField(z.string()).describe(
    "Date services or supply obligations begin — ISO 8601 preferred"
  ),
  expiry_date: tracedField(z.string()).describe(
    "Date the contract term ends — ISO 8601 preferred"
  ),
  term_years: tracedField(z.number()).describe(
    "Duration of the contract in years — use decimal for partial years, e.g. 2.5 for 30 months"
  ),
});

// ---------------------------------------------------------------------------
// Commercial Terms
// ---------------------------------------------------------------------------

const CommercialTermsSchema = z.object({
  total_contract_value: tracedField(z.string()).describe(
    "Total contract value (TCV) in original currency — include currency symbol, e.g. €4,200,000 or USD 8,500,000"
  ),
  currency: tracedField(z.string()).describe(
    "ISO 4217 currency code — EUR, USD, GBP, DKK, SEK, NOK, etc."
  ),
  annual_fee: tracedField(z.string())
    .nullable()
    .describe(
      "Annual service or maintenance fee if separately stated — include currency symbol. Null if not applicable."
    ),
  unit_rates: z
    .array(
      z.object({
        description: tracedField(z.string()).describe(
          "What this rate covers — e.g. 'per turbine per year', 'per technician hour'"
        ),
        rate: tracedField(z.string()).describe(
          "Rate amount with unit — e.g. €1,500/turbine/year or €250/hour"
        ),
      })
    )
    .describe("All itemised rate schedule entries found in the contract"),
  price_adjustment_mechanism: tracedField(z.string())
    .nullable()
    .describe(
      "Any contractual price review or adjustment mechanism — e.g. 'annual CPI review', 'price fixed for 5 years'. Null if none."
    ),
});

// ---------------------------------------------------------------------------
// Payment Terms
// ---------------------------------------------------------------------------

const PaymentTermsSchema = z.object({
  payment_schedule: tracedField(z.string()).describe(
    "When and how payments are made — e.g. 'quarterly in arrears', 'monthly on the 1st of each month'"
  ),
  payment_due_days: tracedField(z.number())
    .nullable()
    .describe(
      "Calendar days after invoice for payment to be due — e.g. 30. Null if not stated."
    ),
  late_payment_interest: tracedField(z.string())
    .nullable()
    .describe(
      "Interest rate or mechanism for overdue payments — e.g. 'EURIBOR + 2% per annum'. Null if not stated."
    ),
  invoicing_procedure: tracedField(z.string())
    .nullable()
    .describe(
      "How and to whom invoices must be submitted — e.g. 'electronic invoice to AP department'. Null if not described."
    ),
});

// ---------------------------------------------------------------------------
// Performance Obligations
// ---------------------------------------------------------------------------

const PerformanceObligationsSchema = z.object({
  availability_guarantee: tracedField(z.number())
    .nullable()
    .describe(
      "Guaranteed turbine or asset availability as a percentage 0–100. Numeric only — e.g. 97.0 for 97%. Null if no guarantee."
    ),
  response_time_hours: tracedField(z.number())
    .nullable()
    .describe(
      "Maximum response time in hours for fault attendance — e.g. 4.0 for 4-hour response. Null if not stated."
    ),
  resolution_time_hours: tracedField(z.number())
    .nullable()
    .describe(
      "Maximum fault repair or resolution time in hours. Null if not stated."
    ),
  planned_maintenance_windows: tracedField(z.string())
    .nullable()
    .describe(
      "Scheduled maintenance windows or blackout periods — describe the window rules. Null if not specified."
    ),
  reporting_obligations: tracedField(z.string())
    .nullable()
    .describe(
      "Required performance reports and their frequency — e.g. 'monthly availability report'. Null if none."
    ),
});

// ---------------------------------------------------------------------------
// Liquidated Damages
// ---------------------------------------------------------------------------

const LiquidatedDamageSchema = z.object({
  trigger: tracedField(z.string()).describe(
    "The condition that triggers this LD — e.g. 'availability falls below 95% in any rolling 12-month period'"
  ),
  rate: tracedField(z.string()).describe(
    "Penalty rate per unit of breach — e.g. '€5,000 per percentage point below guaranteed availability'"
  ),
  cap: tracedField(z.string())
    .nullable()
    .describe(
      "Maximum aggregate LD liability cap — e.g. '15% of annual contract value'. Null if uncapped."
    ),
});

// ---------------------------------------------------------------------------
// Escalation
// ---------------------------------------------------------------------------

const EscalationSchema = z.object({
  index: tracedField(z.string()).describe(
    "Price escalation index referenced — e.g. 'EU HICP (all items)', 'German CPI', 'UK RPI'"
  ),
  frequency: tracedField(z.string()).describe(
    "How often escalation is applied — e.g. 'annually on contract anniversary', 'every 3 years'"
  ),
  base_year: tracedField(z.string())
    .nullable()
    .describe(
      "Base year or date for index calculation — e.g. '2024'. Null if not specified."
    ),
  cap_percentage: tracedField(z.number())
    .nullable()
    .describe(
      "Maximum escalation percentage per period — e.g. 3.0 for a 3% cap. Null if uncapped."
    ),
  floor_percentage: tracedField(z.number())
    .nullable()
    .describe(
      "Minimum escalation percentage per period — e.g. 0.0. Null if no floor."
    ),
});

// ---------------------------------------------------------------------------
// Warranty
// ---------------------------------------------------------------------------

const WarrantySchema = z.object({
  duration_months: tracedField(z.number()).describe(
    "Warranty period in months — e.g. 24 for a 2-year warranty"
  ),
  scope: tracedField(z.string()).describe(
    "What is covered — e.g. 'parts and labour for defects in materials or workmanship'"
  ),
  exclusions: tracedField(z.string())
    .nullable()
    .describe(
      "Key warranty exclusions — e.g. 'consumables, damage from extreme weather events'. Null if no exclusions stated."
    ),
  notification_period_days: tracedField(z.number())
    .nullable()
    .describe(
      "Days within which defects must be notified to trigger warranty. Null if not specified."
    ),
});

// ---------------------------------------------------------------------------
// Termination
// ---------------------------------------------------------------------------

const TerminationSchema = z.object({
  termination_for_convenience: tracedField(z.boolean()).describe(
    "true if either party may terminate for convenience without cause; false if only for-cause termination is permitted"
  ),
  notice_period_days: tracedField(z.number()).describe(
    "Required notice period in calendar days for termination — e.g. 90 for 3 months notice"
  ),
  termination_fee: tracedField(z.string())
    .nullable()
    .describe(
      "Fee payable on termination for convenience — e.g. '6 months fees'. Null if no fee applies."
    ),
  termination_for_cause_triggers: tracedField(z.string()).describe(
    "Events constituting grounds for termination for cause — summarise the key triggers"
  ),
});

// ---------------------------------------------------------------------------
// Key Dates
// ---------------------------------------------------------------------------

const KeyDateSchema = z.object({
  label: tracedField(z.string()).describe(
    "Human-readable label — e.g. 'First Renewal Option', 'Performance Review Date', 'Price Escalation Date'"
  ),
  date: tracedField(z.string()).describe(
    "ISO 8601 date (YYYY-MM-DD) if determinable, otherwise descriptive — e.g. '6 months before expiry'"
  ),
  obligation: tracedField(z.string()).describe(
    "What action or obligation is triggered on this date"
  ),
});

// ---------------------------------------------------------------------------
// Risk Flags
// ---------------------------------------------------------------------------

const RiskFlagSchema = z.object({
  id: z
    .string()
    .describe("Short unique identifier — format RF-001, RF-002, etc."),
  severity: z
    .enum(["high", "medium", "low"])
    .describe(
      "high = immediate material commercial impact; medium = significant but manageable; low = minor or informational"
    ),
  category: z
    .string()
    .describe(
      "Risk category — one of: Financial, Operational, Legal, Commercial, Compliance"
    ),
  description: tracedField(z.string()).describe(
    "Plain-language description of the risk and why it is flagged — be specific, reference clause numbers where possible"
  ),
  recommendation: z
    .string()
    .describe(
      "Actionable mitigation or negotiation recommendation — specific and commercially focused"
    ),
});

// ---------------------------------------------------------------------------
// Root extraction schema
// ---------------------------------------------------------------------------

export const ContractExtractionSchema = z.object({
  metadata: ContractMetadataSchema,
  commercial_terms: CommercialTermsSchema,
  payment_terms: PaymentTermsSchema,
  performance_obligations: PerformanceObligationsSchema,
  liquidated_damages: z
    .array(LiquidatedDamageSchema)
    .describe(
      "All liquidated damage and penalty clauses — extract each trigger/rate pair as a separate entry"
    ),
  escalation: EscalationSchema.nullable().describe(
    "Price escalation mechanism — null if no escalation clause exists in the contract"
  ),
  warranty: WarrantySchema.nullable().describe(
    "Warranty provisions — null if no warranty clause exists or is not applicable"
  ),
  termination: TerminationSchema,
  key_dates: z
    .array(KeyDateSchema)
    .describe(
      "All commercially significant dates and milestones, in chronological order"
    ),
  risk_flags: z
    .array(RiskFlagSchema)
    .describe(
      "Commercial risk flags sorted by severity descending — include a minimum of 3 flags"
    ),
  extraction_meta: z.object({
    model: z.string(),
    extracted_at: z.string().datetime(),
    duration_ms: z.number(),
    input_tokens: z.number(),
    output_tokens: z.number(),
    cost_usd: z.number(),
  }),
});

export type ContractExtraction = z.infer<typeof ContractExtractionSchema>;
export type ContractMetadata = z.infer<typeof ContractMetadataSchema>;
export type CommercialTerms = z.infer<typeof CommercialTermsSchema>;
export type PaymentTerms = z.infer<typeof PaymentTermsSchema>;
export type PerformanceObligations = z.infer<
  typeof PerformanceObligationsSchema
>;
export type LiquidatedDamage = z.infer<typeof LiquidatedDamageSchema>;
export type Escalation = z.infer<typeof EscalationSchema>;
export type Warranty = z.infer<typeof WarrantySchema>;
export type Termination = z.infer<typeof TerminationSchema>;
export type KeyDate = z.infer<typeof KeyDateSchema>;
export type RiskFlag = z.infer<typeof RiskFlagSchema>;
