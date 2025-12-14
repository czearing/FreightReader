import type {
  DocumentType,
  ExtractedData,
  RawPageExtraction,
  ValidationIssue,
} from "@/types/documents";

export const STATE_PATTERN = /\b[A-Z]{2}\b/;
export const REFERENCE_PATTERN = /^[A-Z0-9-]{3,}$/;

export const toNullOrString = (value: string | null | undefined) => {
  const trimmed = (value ?? "").trim();
  return trimmed.length ? trimmed : null;
};

export const toUpperId = (value: string | null | undefined) => {
  const normalized = toNullOrString(value);
  return normalized ? normalized.replace(/[^A-Z0-9-]/gi, "").toUpperCase() : null;
};

export const toIsoDate = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  }

  const input = String(value).trim();
  if (!input) {
    return null;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

export const toNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return null;
  }
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

export const normalizeDocumentType = (
  value: DocumentType | null | undefined,
): DocumentType => {
  if (value === "BOL" || value === "POD" || value === "RATE_CONFIRMATION") {
    return value;
  }
  return "UNKNOWN";
};

export const pickPrimaryPage = (pages: RawPageExtraction[]): RawPageExtraction | null => {
  if (!pages.length) return null;
  return (
    pages.find((page) => page.document_type && page.document_type !== "UNKNOWN") ?? pages[0]
  );
};

export const buildAddressIssue = (address: string | null, field: string) => {
  const issues: ValidationIssue[] = [];
  if (address && !STATE_PATTERN.test(address)) {
    issues.push({
      field,
      severity: "warning",
      reason: "format",
      message: "Address is missing a recognizable state or city.",
    });
  }
  return issues;
};

export const toSyntheticPage = (data: ExtractedData): RawPageExtraction => ({
  page: 1,
  document_type: data.documentType,
  shipper_name: data.shipper.name,
  shipper_address: data.shipper.address,
  consignee_name: data.consignee.name,
  consignee_address: data.consignee.address,
  bill_to_name: data.billTo?.name ?? null,
  bill_to_address: data.billTo?.address ?? null,
  bol_number: data.references.bol,
  pro_number: data.references.pro,
  po_number: data.references.po,
  pickup_date: data.dates.pickup,
  delivery_date: data.dates.delivery,
  total_weight_lbs: data.weightLbs,
  quantity: data.quantity,
  pieces: data.pieces,
  handwritten_notes: data.handwrittenNotes,
});
