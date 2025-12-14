import type {
  ExportFormat,
  ExtractedData,
  FreightDocument,
} from "@/types/documents";

export interface DocumentModalProps {
  document: FreightDocument;
  onClose: () => void;
  onDownload: (id: string, format: ExportFormat) => void;
  onDelete: () => void;
  onUpdate: (data: ExtractedData) => void;
}
