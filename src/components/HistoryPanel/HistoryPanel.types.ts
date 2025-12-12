import type { ExportFormat, FreightDocument } from "@/types/freight";

export interface HistoryPanelProps {
  documents: FreightDocument[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onDownload: (id: string, format: ExportFormat) => void;
  onDownloadAll: (format: ExportFormat) => void;
  defaultExportFormat?: ExportFormat;
}
