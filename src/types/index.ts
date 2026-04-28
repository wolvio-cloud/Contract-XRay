export type ContractType = "OM" | "Service" | "Supply" | "Admin" | "Other";
export type ExtractionStatus = "pending" | "processing" | "completed" | "failed";
export type Confidence = "high" | "medium" | "low";
export type Severity = "high" | "medium" | "low";

export interface ApiError {
  code: string;
  message: string;
  correlation_id: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
