export type DocumentStatus = "PROCESSING" | "DONE" | "FAILED";

export type DocumentType = "BOL" | "POD" | "RATE_CONFIRMATION" | "UNKNOWN";

export interface PartyDetails {
  name: string | null;
  address: string | null;
  city?: string | null;
  state?: string | null;
}

export interface ReferenceNumbers {
  bol: string | null;
  pro: string | null;
  po: string | null;
}

export interface FreightDates {
  pickup: string | null;
  delivery: string | null;
}

export interface RawPageExtraction {
  page: number;
  document_type: DocumentType;
  shipper_name: string | null;
  shipper_address: string | null;
  consignee_name: string | null;
  consignee_address: string | null;
  bill_to_name: string | null;
  bill_to_address: string | null;
  bol_number: string | null;
  pro_number: string | null;
  po_number: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  total_weight_lbs: number | string | null;
  quantity: number | string | null;
  pieces: number | string | null;
  handwritten_notes: string | null;
}

export type IssueSeverity = "warning" | "error";

export interface ValidationIssue {
  field: string;
  severity: IssueSeverity;
  reason: "missing" | "format" | "sanity";
  message: string;
}

export interface ExtractedData {
  documentType: DocumentType;
  shipper: PartyDetails;
  consignee: PartyDetails;
  billTo: PartyDetails | null;
  references: ReferenceNumbers;
  dates: FreightDates;
  weightLbs: number | null;
  quantity: number | null;
  pieces: number | null;
  handwrittenNotes: string | null;
  issues: ValidationIssue[];
  readyForExport: boolean;
  rawPages: RawPageExtraction[];
}

export interface FreightDocument {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: DocumentStatus;
  data?: ExtractedData;
  failureReason?: string;
  previewUrl?: string;
  pinned?: boolean;
}

export type ExportFormat = "CSV" | "JSON" | "QBOOKS";
