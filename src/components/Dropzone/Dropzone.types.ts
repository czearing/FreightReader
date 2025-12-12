export interface DropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  className?: string;
  isBusy?: boolean;
}
