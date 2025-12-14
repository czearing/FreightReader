import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  ExportFormat,
  ExtractedData,
  FreightDocument,
} from "@/types/documents";
import type { UserStats } from "@/types/user";
import { extractDocument } from "@/services/extraction/process";

const createTempId = () =>
  `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const useDocuments = (limit: number, autoPin: boolean) => {
  const [documents, setDocuments] = useState<FreightDocument[]>([]);
  const [stats, setStats] = useState<UserStats>({ used: 0, limit });
  const [processingCount, setProcessingCount] = useState(0);

  useEffect(() => {
    setStats((prev) => ({ ...prev, used: documents.length, limit }));
  }, [documents.length, limit]);

  const upload = useCallback(
    async (files: File[]) => {
      if (documents.length + files.length > limit) {
        alert("You have reached your free plan limit.");
        return;
      }

      const newDocs: FreightDocument[] = files.map((file) => ({
        id: createTempId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: "PROCESSING",
        previewUrl: URL.createObjectURL(file),
        pinned: false,
      }));

      setDocuments((prev) => [...newDocs, ...prev]);
      setProcessingCount((prev) => prev + newDocs.length);

      const processDocs = newDocs.map(async (doc) => {
        try {
          if (!doc.file) {
            throw new Error("File payload missing.");
          }
          const extractedData = await extractDocument(doc.file);
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? {
                    ...d,
                    status: "DONE",
                    data: extractedData,
                    failureReason: undefined,
                    pinned: autoPin,
                  }
                : d,
            ),
          );
        } catch (error) {
          console.error("Extraction failed", error);
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? {
                    ...d,
                    status: "FAILED",
                    failureReason:
                      error instanceof Error
                        ? error.message
                        : "AI Extraction Failed. Ensure API Key is valid and image is clear.",
                  }
                : d,
            ),
          );
        } finally {
          setProcessingCount((prev) => Math.max(0, prev - 1));
        }
      });

      await Promise.all(processDocs);
    },
    [autoPin, documents.length, limit],
  );

  const remove = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const update = useCallback((id: string, updater: (data: ExtractedData) => ExtractedData) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id && doc.data
          ? {
              ...doc,
              data: updater(doc.data),
              status: "DONE",
            }
          : doc,
      ),
    );
  }, []);

  const refresh = useCallback(() => {
    console.warn("Refresh triggered (mock)");
  }, []);

  const download = useCallback(
    (id: string, format: ExportFormat) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc?.data) {
        return;
      }

      if (!doc.data.readyForExport) {
        alert("Please resolve required fields before exporting.");
        return;
      }

      if (format === "JSON") {
        const content = JSON.stringify(doc.data, null, 2);
        downloadFile(content, `${doc.name}.json`, "application/json");
      } else if (format === "CSV") {
        const headers =
          "Document Type,Shipper,Shipper Address,Consignee,Consignee Address,BOL,PRO,PO,Pickup Date,Delivery Date,Quantity,Pieces,Weight (lbs),Handwritten Notes\n";
        const row = [
          doc.data.documentType,
          doc.data.shipper.name ?? "",
          doc.data.shipper.address ?? "",
          doc.data.consignee.name ?? "",
          doc.data.consignee.address ?? "",
          doc.data.references.bol ?? "",
          doc.data.references.pro ?? "",
          doc.data.references.po ?? "",
          doc.data.dates.pickup ?? "",
          doc.data.dates.delivery ?? "",
          doc.data.quantity ?? "",
          doc.data.pieces ?? "",
          doc.data.weightLbs ?? "",
          doc.data.handwrittenNotes ?? "",
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",");

        downloadFile(headers + row, `${doc.name}.csv`, "text/csv");
      } else if (format === "QBOOKS") {
        const content = `!TRNS\tTRNSID\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO\nTRNS\t${doc.id}\t${doc.data.dates.pickup ?? ""}\tFreight Exp\t${doc.data.shipper.name ?? ""}\t0.00\t${doc.data.references.pro ?? doc.data.references.bol ?? ""}\tWeight: ${doc.data.weightLbs ?? "n/a"} lbs`;
        downloadFile(content, `${doc.name}.iif`, "text/plain");
      }
    },
    [documents],
  );

  const downloadAll = useCallback(
    (format: ExportFormat) => {
      const completedDocs = documents.filter(
        (d) => d.status === "DONE" && d.data && d.data.readyForExport,
      );
      if (completedDocs.length === 0) {
        return;
      }

      if (format === "JSON") {
        const allData = completedDocs.map((d) => ({
          filename: d.name,
          ...d.data,
        }));
        downloadFile(
          JSON.stringify(allData, null, 2),
          `freight-export-${new Date().toISOString().split("T")[0]}.json`,
          "application/json",
        );
        alert("Downloaded all exportable files as a single JSON array.");
      } else if (format === "CSV") {
        const headers =
          "Filename,Document Type,Shipper,Shipper Address,Consignee,Consignee Address,BOL,PRO,PO,Pickup Date,Delivery Date,Quantity,Pieces,Weight (lbs),Handwritten Notes\n";
        const rows = completedDocs
          .map(
            (d) =>
              `"${d.name}","${d.data?.documentType ?? ""}","${d.data?.shipper.name ?? ""}","${d.data?.shipper.address ?? ""}","${d.data?.consignee.name ?? ""}","${d.data?.consignee.address ?? ""}","${d.data?.references.bol ?? ""}","${d.data?.references.pro ?? ""}","${d.data?.references.po ?? ""}","${d.data?.dates.pickup ?? ""}","${d.data?.dates.delivery ?? ""}","${d.data?.quantity ?? ""}","${d.data?.pieces ?? ""}","${d.data?.weightLbs ?? ""}","${d.data?.handwrittenNotes ?? ""}"`,
          )
          .join("\n");
        downloadFile(
          headers + rows,
          `freight-export-${new Date().toISOString().split("T")[0]}.csv`,
          "text/csv",
        );
      } else {
        alert("Bulk export for QuickBooks is not supported in this demo version.");
      }
    },
    [documents],
  );

  const canUpload = useMemo(
    () => stats.used < stats.limit && processingCount === 0,
    [processingCount, stats.limit, stats.used],
  );

  return {
    documents,
    stats,
    processingCount,
    canUpload,
    upload,
    remove,
    update,
    refresh,
    download,
    downloadAll,
  };
};
