export interface UploadPanelProps {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
  canUpload: boolean;
}
