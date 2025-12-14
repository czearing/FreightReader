import type { ExtractedData, RawPageExtraction } from "@/types/documents";
import {
  REFERENCE_PATTERN,
  buildAddressIssue,
  normalizeDocumentType,
  pickPrimaryPage,
  toIsoDate,
  toNullOrString,
  toNumber,
  toSyntheticPage,
  toUpperId,
} from "./utils";

export const normalizeExtraction = (rawPages: RawPageExtraction[]): ExtractedData => {
  const primary = pickPrimaryPage(rawPages);
  const issues: ExtractedData["issues"] = [];
  const REQUIRED_FIELDS: Array<{ key: string; label: string }> = [
    { key: "documentType", label: "Document type" },
    { key: "shipper.name", label: "Shipper name" },
    { key: "consignee.name", label: "Consignee name" },
  ];
  const REQUIRED_REFERENCES: Array<
    { key: keyof ExtractedData["references"]; label: string }
  > = [
    { key: "pro", label: "PRO / tracking" },
    { key: "bol", label: "BOL number" },
    { key: "po", label: "PO number" },
  ];

  const documentType = normalizeDocumentType(primary?.document_type ?? null);

  const shipperName = toNullOrString(primary?.shipper_name);
  const consigneeName = toNullOrString(primary?.consignee_name);
  const billToName = toNullOrString(primary?.bill_to_name);

  const references = {
    bol: toUpperId(primary?.bol_number),
    pro: toUpperId(primary?.pro_number),
    po: toUpperId(primary?.po_number),
  };

  const dates = {
    pickup: toIsoDate(primary?.pickup_date),
    delivery: toIsoDate(primary?.delivery_date),
  };

  const weightLbs = toNumber(primary?.total_weight_lbs);
  const quantity = toNumber(primary?.quantity);
  const pieces = toNumber(primary?.pieces);

  const shipperAddress = toNullOrString(primary?.shipper_address);
  const consigneeAddress = toNullOrString(primary?.consignee_address);
  const billToAddress = toNullOrString(primary?.bill_to_address);

  const normalized: ExtractedData = {
    documentType,
    shipper: {
      name: shipperName,
      address: shipperAddress,
    },
    consignee: {
      name: consigneeName,
      address: consigneeAddress,
    },
    billTo: billToName
      ? {
          name: billToName,
          address: billToAddress,
        }
      : null,
    references,
    dates,
    weightLbs,
    quantity,
    pieces,
    handwrittenNotes: toNullOrString(primary?.handwritten_notes),
    issues,
    readyForExport: false,
    rawPages: rawPages.map((page, index) => ({
      ...page,
      page: page.page ?? index + 1,
    })),
  };

  for (const field of REQUIRED_FIELDS) {
    const value =
      field.key === "documentType"
        ? normalized.documentType !== "UNKNOWN"
        : field.key === "shipper.name"
          ? normalized.shipper.name
          : normalized.consignee.name;

    if (!value) {
      issues.push({
        field: field.key,
        severity: "error",
        reason: "missing",
        message: `${field.label} is required.`,
      });
    }
  }

  const hasReference = REQUIRED_REFERENCES.some(({ key }) => normalized.references[key]);
  if (!hasReference) {
    issues.push({
      field: "references",
      severity: "error",
      reason: "missing",
      message: "At least one reference number (BOL/PRO/PO) is required.",
    });
  }

  for (const ref of REQUIRED_REFERENCES) {
    const value = normalized.references[ref.key];
    if (value && !REFERENCE_PATTERN.test(value)) {
      issues.push({
        field: `references.${ref.key}`,
        severity: "warning",
        reason: "format",
        message: `${ref.label} format looks unusual.`,
      });
    }
  }

  if (quantity && quantity > 1 && weightLbs !== null && weightLbs < 50) {
    issues.push({
      field: "weightLbs",
      severity: "warning",
      reason: "sanity",
      message: "Quantity is greater than 1 but weight is under 50 lbs.",
    });
  }

  issues.push(
    ...buildAddressIssue(shipperAddress, "shipper.address"),
    ...buildAddressIssue(consigneeAddress, "consignee.address"),
  );

  normalized.readyForExport = !issues.some((issue) => issue.severity === "error");

  return normalized;
};

export const revalidateExtraction = (
  current: ExtractedData,
  overrides: Partial<ExtractedData>,
) => {
  const merged: ExtractedData = {
    ...current,
    ...overrides,
    shipper: { ...current.shipper, ...(overrides.shipper ?? {}) },
    consignee: { ...current.consignee, ...(overrides.consignee ?? {}) },
    billTo: current.billTo
      ? { ...current.billTo, ...(overrides.billTo ?? {}) }
      : overrides.billTo ?? null,
    references: { ...current.references, ...(overrides.references ?? {}) },
    dates: { ...current.dates, ...(overrides.dates ?? {}) },
    rawPages: current.rawPages,
    issues: current.issues,
    readyForExport: current.readyForExport,
  };

  return normalizeExtraction([toSyntheticPage(merged)]);
};
