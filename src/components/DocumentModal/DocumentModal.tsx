/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import cx from "clsx";
import {
  AlertTriangle,
  Box,
  Calendar,
  Download,
  FileText,
  Hash,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { Input } from "@/components/Input/Input";
import { revalidateExtraction } from "@/services/extraction/normalize";
import type {
  DocumentType,
  ExtractedData,
  ValidationIssue,
} from "@/types/documents";
import styles from "./DocumentModal.module.css";
import type { DocumentModalProps } from "./DocumentModal.types";

const DOCUMENT_TYPES: DocumentType[] = ["BOL", "POD", "RATE_CONFIRMATION", "UNKNOWN"];

const toNullableText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const toNullableNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const issueForField = (issues: ValidationIssue[], field: string, severity: "error" | "warning") =>
  issues.find((issue) => issue.field === field && issue.severity === severity)?.message;

type FieldKey =
  | "documentType"
  | "shipper.name"
  | "shipper.address"
  | "consignee.name"
  | "consignee.address"
  | "billTo.name"
  | "billTo.address"
  | "references.bol"
  | "references.pro"
  | "references.po"
  | "dates.pickup"
  | "dates.delivery"
  | "quantity"
  | "pieces"
  | "weightLbs"
  | "handwrittenNotes";

export const DocumentModal = ({
  document,
  onClose,
  onDownload,
  onDelete,
  onUpdate,
}: DocumentModalProps) => {
  const isProcessing = document.status === "PROCESSING";
  const isFailed = document.status === "FAILED";
  const isDone = document.status === "DONE";

  const [draft, setDraft] = useState<ExtractedData | null>(document.data ?? null);

  useEffect(() => {
    setDraft(document.data ?? null);
  }, [document.data, document.id]);

  const issues = useMemo(() => draft?.issues ?? [], [draft?.issues]);
  const blockingIssues = issues.filter((issue) => issue.severity === "error");
  const warningIssues = issues.filter((issue) => issue.severity === "warning");

  const handleChange = (field: FieldKey, value: string) => {
    if (!draft) {
      return;
    }

    const partial: Partial<ExtractedData> = {};
    switch (field) {
      case "documentType":
        partial.documentType = value as DocumentType;
        break;
      case "shipper.name":
        partial.shipper = { ...draft.shipper, name: toNullableText(value) };
        break;
      case "shipper.address":
        partial.shipper = { ...draft.shipper, address: toNullableText(value) };
        break;
      case "consignee.name":
        partial.consignee = { ...draft.consignee, name: toNullableText(value) };
        break;
      case "consignee.address":
        partial.consignee = { ...draft.consignee, address: toNullableText(value) };
        break;
      case "billTo.name":
        partial.billTo = {
          ...(draft.billTo ?? { name: null, address: null }),
          name: toNullableText(value),
        };
        break;
      case "billTo.address":
        partial.billTo = {
          ...(draft.billTo ?? { name: null, address: null }),
          address: toNullableText(value),
        };
        break;
      case "references.bol":
        partial.references = { ...draft.references, bol: toNullableText(value) };
        break;
      case "references.pro":
        partial.references = { ...draft.references, pro: toNullableText(value) };
        break;
      case "references.po":
        partial.references = { ...draft.references, po: toNullableText(value) };
        break;
      case "dates.pickup":
        partial.dates = { ...draft.dates, pickup: toNullableText(value) };
        break;
      case "dates.delivery":
        partial.dates = { ...draft.dates, delivery: toNullableText(value) };
        break;
      case "quantity":
        partial.quantity = toNullableNumber(value);
        break;
      case "pieces":
        partial.pieces = toNullableNumber(value);
        break;
      case "weightLbs":
        partial.weightLbs = toNullableNumber(value);
        break;
      case "handwrittenNotes":
        partial.handwrittenNotes = toNullableText(value);
        break;
      default:
        break;
    }

    const next = revalidateExtraction(draft, partial);
    setDraft(next);
    onUpdate(next);
  };

  const exportDisabled = !draft?.readyForExport;

  return (
    <div className={styles.DocumentModal_backdrop} aria-modal role="dialog">
      <div className={styles.DocumentModal_overlay} onClick={onClose} />

      <div className={styles.DocumentModal_modal}>
        <div className={styles.DocumentModal_header}>
          <div className={styles.DocumentModal_headerContent}>
            <div className={styles.DocumentModal_iconBox}>
              <FileText size={20} aria-hidden />
            </div>
            <div>
              <h3 className={styles.DocumentModal_fileName}>{document.name}</h3>
              <p className={styles.DocumentModal_fileMeta}>
                Processed {new Date(document.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.DocumentModal_closeBtn}
            aria-label="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className={styles.DocumentModal_body}>
          {document.previewUrl && (
            <div className={styles.DocumentModal_previewContainer}>
              <img
                src={document.previewUrl}
                alt="Document Preview"
                className={styles.DocumentModal_previewImage}
              />
              <div className={styles.DocumentModal_previewOverlay}>
                <p className={styles.DocumentModal_previewLabel}>Preview</p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className={styles.DocumentModal_loadingState}>
              <div className={styles.DocumentModal_spinner} />
              <p className={styles.DocumentModal_loadingTitle}>
                Analyzing Document...
              </p>
              <p className={styles.DocumentModal_loadingSubtitle}>
                Our AI is extracting shipment details.
              </p>
            </div>
          )}

          {isFailed && (
            <div className={styles.DocumentModal_failedState}>
              <p className={styles.DocumentModal_failedTitle}>
                Extraction Failed
              </p>
              <p>
                {document.failureReason ??
                  "We couldn't parse the details from this file. Please ensure it is a clear image or PDF."}
              </p>
            </div>
          )}

          {isDone && draft && (
            <div className={styles.DocumentModal_form}>
              {issues.length > 0 && (
                <div className={styles.DocumentModal_issuePanel}>
                  <div className={styles.DocumentModal_issueHeader}>
                    <AlertTriangle
                      size={16}
                      className={styles.DocumentModal_issueIcon}
                      aria-hidden
                    />
                    <div>
                      <p className={styles.DocumentModal_issueTitle}>
                        {blockingIssues.length > 0 ? "Review required" : "Needs attention"}
                      </p>
                      <p className={styles.DocumentModal_issueSubtitle}>
                        Resolve missing fields and flags before exporting.
                      </p>
                    </div>
                  </div>
                  <ul className={styles.DocumentModal_issueList}>
                    {issues.map((issue) => (
                      <li key={`${issue.field}-${issue.reason}-${issue.severity}`}>
                        <span
                          className={cx(
                            styles.DocumentModal_issueBadge,
                            issue.severity === "error"
                              ? styles.DocumentModal_issueBadgeError
                              : styles.DocumentModal_issueBadgeWarn,
                          )}
                        >
                          {issue.severity === "error" ? "Required" : "Flag"}
                        </span>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.DocumentModal_grid}>
                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <FileText size={12} aria-hidden /> Document Type
                  </p>
                  <div className={styles.DocumentModal_fieldInputs}>
                    <label className={styles.DocumentModal_selectWrapper}>
                      <span className={styles.DocumentModal_selectLabel}>Type</span>
                      <select
                        className={cx(
                          styles.DocumentModal_select,
                          issueForField(issues, "documentType", "error") &&
                            styles.DocumentModal_selectError,
                        )}
                        value={draft.documentType}
                        onChange={(event) =>
                          handleChange("documentType", event.target.value)
                        }
                      >
                        {DOCUMENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type === "UNKNOWN" ? "Unknown" : type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className={styles.DocumentModal_refGrid}>
                      <Input
                        label="PRO Number"
                        value={draft.references.pro ?? ""}
                        onChange={(event) =>
                          handleChange("references.pro", event.target.value)
                        }
                        error={issueForField(issues, "references", "error")}
                        hint={issueForField(issues, "references.pro", "warning")}
                      />
                      <Input
                        label="BOL Number"
                        value={draft.references.bol ?? ""}
                        onChange={(event) =>
                          handleChange("references.bol", event.target.value)
                        }
                        hint={issueForField(issues, "references.bol", "warning")}
                      />
                      <Input
                        label="PO Number"
                        value={draft.references.po ?? ""}
                        onChange={(event) =>
                          handleChange("references.po", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <Truck size={12} aria-hidden /> Shipper
                  </p>
                  <div className={styles.DocumentModal_fieldInputs}>
                    <Input
                      label="Name"
                      value={draft.shipper.name ?? ""}
                      onChange={(event) =>
                        handleChange("shipper.name", event.target.value)
                      }
                      error={issueForField(issues, "shipper.name", "error")}
                      hint={issueForField(issues, "shipper.address", "warning")}
                    />
                    <Input
                      label="Address"
                      value={draft.shipper.address ?? ""}
                      onChange={(event) =>
                        handleChange("shipper.address", event.target.value)
                      }
                      error={issueForField(issues, "shipper.address", "error")}
                      hint={issueForField(issues, "shipper.address", "warning")}
                    />
                  </div>
                </div>

                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <Truck size={12} aria-hidden /> Consignee
                  </p>
                  <div className={styles.DocumentModal_fieldInputs}>
                    <Input
                      label="Name"
                      value={draft.consignee.name ?? ""}
                      onChange={(event) =>
                        handleChange("consignee.name", event.target.value)
                      }
                      error={issueForField(issues, "consignee.name", "error")}
                      hint={issueForField(issues, "consignee.address", "warning")}
                    />
                    <Input
                      label="Address"
                      value={draft.consignee.address ?? ""}
                      onChange={(event) =>
                        handleChange("consignee.address", event.target.value)
                      }
                      error={issueForField(issues, "consignee.address", "error")}
                      hint={issueForField(issues, "consignee.address", "warning")}
                    />
                  </div>
                </div>

                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <Hash size={12} aria-hidden /> Bill To (optional)
                  </p>
                  <div className={styles.DocumentModal_fieldInputs}>
                    <Input
                      label="Name"
                      value={draft.billTo?.name ?? ""}
                      onChange={(event) =>
                        handleChange("billTo.name", event.target.value)
                      }
                    />
                    <Input
                      label="Address"
                      value={draft.billTo?.address ?? ""}
                      onChange={(event) =>
                        handleChange("billTo.address", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <Calendar size={12} aria-hidden /> Dates
                  </p>
                  <div className={styles.DocumentModal_fieldInputs}>
                    <Input
                      label="Pickup Date"
                      type="date"
                      value={draft.dates.pickup ?? ""}
                      onChange={(event) =>
                        handleChange("dates.pickup", event.target.value)
                      }
                    />
                    <Input
                      label="Delivery Date"
                      type="date"
                      value={draft.dates.delivery ?? ""}
                      onChange={(event) =>
                        handleChange("dates.delivery", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.DocumentModal_fieldBox}>
                  <p className={styles.DocumentModal_fieldLabel}>
                    <Box size={12} aria-hidden /> Freight Details
                  </p>
                  <div className={styles.DocumentModal_refGrid}>
                    <Input
                      label="Quantity"
                      type="number"
                      value={draft.quantity ?? ""}
                      onChange={(event) => handleChange("quantity", event.target.value)}
                    />
                    <Input
                      label="Pieces"
                      type="number"
                      value={draft.pieces ?? ""}
                      onChange={(event) => handleChange("pieces", event.target.value)}
                    />
                    <Input
                      label="Weight (lbs)"
                      type="number"
                      value={draft.weightLbs ?? ""}
                      onChange={(event) => handleChange("weightLbs", event.target.value)}
                      error={issueForField(issues, "weightLbs", "error")}
                      hint={issueForField(issues, "weightLbs", "warning")}
                    />
                  </div>
                </div>

                <div
                  className={cx(
                    styles.DocumentModal_fieldBox,
                    styles.DocumentModal_fullWidth,
                  )}
                >
                  <p className={styles.DocumentModal_fieldLabel}>
                    <FileText size={12} aria-hidden /> Handwritten Notes
                  </p>
                  <textarea
                    className={styles.DocumentModal_textarea}
                    placeholder="Captured notes, signatures, delivery exceptions..."
                    value={draft.handwrittenNotes ?? ""}
                    onChange={(event) =>
                      handleChange("handwrittenNotes", event.target.value)
                    }
                  />
                </div>
              </div>

              {!exportDisabled && warningIssues.length === 0 && (
                <div className={styles.DocumentModal_readyBanner}>
                  Ready for export. All required fields are validated.
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.DocumentModal_footer}>
          <button
            type="button"
            onClick={onDelete}
            className={styles.DocumentModal_deleteBtn}
          >
            <Trash2 size={16} aria-hidden /> Delete
          </button>

          {isDone && (
            <div className={styles.DocumentModal_footerActions}>
              <button
                type="button"
                onClick={() => onDownload(document.id, "JSON")}
                className={styles.DocumentModal_rawBtn}
                disabled={exportDisabled}
              >
                Raw JSON
              </button>
              <button
                type="button"
                onClick={() => onDownload(document.id, "CSV")}
                className={styles.DocumentModal_downloadBtn}
                disabled={exportDisabled}
              >
                <Download size={16} aria-hidden /> Download CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
