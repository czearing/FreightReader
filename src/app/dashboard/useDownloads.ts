"use client";

import { useCallback, useMemo, useState } from "react";
import JSZip from "jszip";

import type { HistoryItem } from "@/clientToServer/types";
import { showToast } from "@/components";
import {
  formatDocument,
  formatFileName,
  formatZipName,
  type ExportFormat,
} from "@/lib/formatters";

const formatToExtension: Record<ExportFormat, string> = {
  csv: "csv",
  json: "json",
  quickbooks: "iif",
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function useDownloads(documents: HistoryItem[]) {
  const [isPreparing, setIsPreparing] = useState(false);

  const completedDocs = useMemo(
    () => documents.filter((doc) => doc.status === "done"),
    [documents]
  );

  const downloadSingle = useCallback(
    (doc: HistoryItem, format: ExportFormat) => {
      if (doc.status !== "done") {
        showToast({
          title: "Still processing",
          description: "Wait for this document to finish before downloading.",
          tone: "warning",
        });
        return;
      }
      const ext = formatToExtension[format];
      const payload = formatDocument(doc, format);
      const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
      triggerDownload(blob, formatFileName(doc, ext));
      try {
        localStorage.setItem("lastExportFormat", format);
      } catch {
        // ignore storage errors
      }
    },
    []
  );

  const downloadAll = useCallback(
    async (format: ExportFormat) => {
      if (!completedDocs.length) {
        showToast({
          title: "Nothing to export",
          description: "Only completed documents can be downloaded.",
          tone: "warning",
        });
        return;
      }

      const skipped = documents.length - completedDocs.length;
      showToast({
        title: "Preparing ZIP",
        description: `Preparing ZIP (${completedDocs.length} files)…`,
      });

      setIsPreparing(true);
      try {
        const zip = new JSZip();
        completedDocs.forEach((doc) => {
          const ext = formatToExtension[format];
          zip.file(formatFileName(doc, ext), formatDocument(doc, format));
        });
        const blob = await zip.generateAsync({ type: "blob" });
        triggerDownload(blob, formatZipName());
        try {
          localStorage.setItem("lastExportFormat", format);
        } catch {
          // ignore storage errors
        }

        if (skipped > 0) {
          showToast({
            title: "Partial export",
            description: `${completedDocs.length} of ${documents.length} exported.`,
            tone: "warning",
          });
        }
      } catch (error) {
        showToast({
          title: "Export failed",
          description:
            error instanceof Error
              ? error.message
              : "Unable to prepare ZIP file.",
          tone: "error",
        });
      } finally {
        setIsPreparing(false);
      }
    },
    [completedDocs, documents]
  );

  return {
    downloadSingle,
    downloadAll,
    isPreparing,
    hasCompletedDocs: completedDocs.length > 0,
  };
}
