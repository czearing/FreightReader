import type {
  ExportFormat,
  FreightDocument,
  ExtractedData,
} from "@/types/documents";

export interface HistoryPanelProps {
  documents: FreightDocument[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updater: (data: ExtractedData) => ExtractedData) => void;
  onDownload: (id: string, format: ExportFormat) => void;
  onDownloadAll: (format: ExportFormat) => void;
  defaultExportFormat?: ExportFormat;
}
