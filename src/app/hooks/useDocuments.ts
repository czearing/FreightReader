import { useCallback, useEffect, useMemo, useState } from "react";

import type { ExportFormat, FreightDocument, UserStats } from "@/types/freight";

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

const mockExtract = async (): Promise<FreightDocument["data"]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    shipper: "Acme Freight Hub",
    consignee: "Globex Warehouse",
    date: new Date().toISOString().split("T")[0],
    proNumber: Math.random().toString(36).slice(2, 10).toUpperCase(),
    totalWeight: `${Math.floor(Math.random() * 10000) + 1000} lbs`,
  };
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
          const extractedData = await mockExtract();
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? {
                    ...d,
                    status: "DONE",
                    data: extractedData,
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
                      "AI Extraction Failed. Ensure API Key is valid and image is clear.",
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

  const refresh = useCallback(() => {
    console.warn("Refresh triggered (mock)");
  }, []);

  const download = useCallback(
    (id: string, format: ExportFormat) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc?.data) {
        return;
      }

      if (format === "JSON") {
        const content = JSON.stringify(doc.data, null, 2);
        downloadFile(content, `${doc.name}.json`, "application/json");
      } else if (format === "CSV") {
        const headers = "Shipper,Consignee,Date,PRO Number,Weight\n";
        const row = `"${doc.data.shipper}","${doc.data.consignee}","${doc.data.date}","${doc.data.proNumber}","${doc.data.totalWeight}"`;
        downloadFile(headers + row, `${doc.name}.csv`, "text/csv");
      } else if (format === "QBOOKS") {
        const content = `!TRNS\tTRNSID\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO\nTRNS\t${doc.id}\t${doc.data.date}\tFreight Exp\t${doc.data.shipper}\t0.00\t${doc.data.proNumber}\t${doc.data.totalWeight}`;
        downloadFile(content, `${doc.name}.iif`, "text/plain");
      }
    },
    [documents],
  );

  const downloadAll = useCallback(
    (format: ExportFormat) => {
      const completedDocs = documents.filter(
        (d) => d.status === "DONE" && d.data,
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
        alert("Downloaded all files as a single JSON array.");
      } else if (format === "CSV") {
        const headers = "Filename,Shipper,Consignee,Date,PRO Number,Weight\n";
        const rows = completedDocs
          .map(
            (d) =>
              `"${d.name}","${d.data?.shipper}","${d.data?.consignee}","${d.data?.date}","${d.data?.proNumber}","${d.data?.totalWeight}"`,
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
    refresh,
    download,
    downloadAll,
  };
};
