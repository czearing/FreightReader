/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Calendar,
  Download,
  FileText,
  Hash,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import styles from "./DocumentModal.module.css";
import type { DocumentModalProps } from "./DocumentModal.types";

export const DocumentModal = ({
  document,
  onClose,
  onDownload,
  onDelete,
}: DocumentModalProps) => {
  const isProcessing = document.status === "PROCESSING";
  const isFailed = document.status === "FAILED";
  const isDone = document.status === "DONE";

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

          {isDone && document.data && (
            <div className={styles.DocumentModal_grid}>
              <div className={styles.DocumentModal_fieldBox}>
                <p className={styles.DocumentModal_fieldLabel}>
                  <Truck size={12} aria-hidden /> Shipper
                </p>
                <p className={styles.DocumentModal_fieldValue}>
                  {document.data.shipper}
                </p>
              </div>

              <div className={styles.DocumentModal_fieldBox}>
                <p className={styles.DocumentModal_fieldLabel}>
                  <Truck
                    size={12}
                    className={styles.DocumentModal_iconSmall}
                    aria-hidden
                  />{" "}
                  Consignee
                </p>
                <p className={styles.DocumentModal_fieldValue}>
                  {document.data.consignee}
                </p>
              </div>

              <div className={styles.DocumentModal_fieldBox}>
                <p className={styles.DocumentModal_fieldLabel}>
                  <Calendar size={12} aria-hidden /> Date
                </p>
                <p className={styles.DocumentModal_fieldValue}>
                  {document.data.date}
                </p>
              </div>

              <div className={styles.DocumentModal_fieldBox}>
                <p className={styles.DocumentModal_fieldLabel}>
                  <Hash size={12} aria-hidden /> PRO Number
                </p>
                <p
                  className={`${styles.DocumentModal_fieldValue} ${styles.DocumentModal_mono}`}
                >
                  {document.data.proNumber}
                </p>
              </div>

              <div
                className={`${styles.DocumentModal_fieldBox} ${styles.DocumentModal_fullWidth}`}
              >
                <p className={styles.DocumentModal_fieldLabel}>
                  <Box size={12} aria-hidden /> Total Weight
                </p>
                <p className={styles.DocumentModal_fieldValue}>
                  {document.data.totalWeight}
                </p>
              </div>
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
              >
                Raw JSON
              </button>
              <button
                type="button"
                onClick={() => onDownload(document.id, "CSV")}
                className={styles.DocumentModal_downloadBtn}
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
