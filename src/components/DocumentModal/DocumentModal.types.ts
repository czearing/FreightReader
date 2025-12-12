import type { ExportFormat, FreightDocument } from "@/types/freight";

export interface DocumentModalProps {
  document: FreightDocument;
  onClose: () => void;
  onDownload: (id: string, format: ExportFormat) => void;
  onDelete: () => void;
}
