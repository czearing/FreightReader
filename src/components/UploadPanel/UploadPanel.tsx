import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import cx from "clsx";
import { FileType, UploadCloud } from "lucide-react";

import styles from "./UploadPanel.module.css";
import type { UploadPanelProps } from "./UploadPanel.types";

export const UploadPanel = ({
  onUpload,
  isProcessing,
  canUpload,
}: UploadPanelProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDisabled = isProcessing || !canUpload;

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (isDisabled) {
        return;
      }
      setIsDragActive(true);
    },
    [isDisabled],
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      if (isDisabled) {
        return;
      }

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(event.dataTransfer.files ?? []);
        const validFiles = droppedFiles.filter(
          (file) => file.size <= 10 * 1024 * 1024,
        );

        if (validFiles.length < droppedFiles.length) {
          alert("Some files were rejected because they exceed 10MB.");
        }

        onUpload(validFiles);
      }
    },
    [isDisabled, onUpload],
  );

  const handleClick = () => {
    if (isDisabled) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === "Enter" || event.key === " ") && !isDisabled) {
      event.preventDefault();
      handleClick();
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onUpload(Array.from(event.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const dropzoneClassName = cx(
    styles.UploadPanel_dropzone,
    isDragActive && styles.UploadPanel_dropzoneActive,
    isDisabled && styles.UploadPanel_dropzoneDisabled,
  );

  const iconWrapperClassName = cx(
    styles.UploadPanel_iconWrapper,
    isDragActive && styles.UploadPanel_iconWrapperActive,
  );

  return (
    <div className={styles.UploadPanel_container}>
      <div className={styles.UploadPanel_header}>
        <h2 className={styles.UploadPanel_title}>Upload Freight Documents</h2>
        <p className={styles.UploadPanel_subtitle}>
          Drop multiple BOLs, PODs, or Rate Confirmations (PDF or image).
        </p>
      </div>

      <div
        className={dropzoneClassName}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-disabled={isDisabled}
        onKeyDown={handleKeyDown}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={isDisabled}
          style={{ display: "none" }}
        />

        <div className={iconWrapperClassName}>
          <UploadCloud className={styles.UploadPanel_uploadIcon} aria-hidden />
        </div>

        <p className={styles.UploadPanel_dropText}>
          Drag &amp; drop files or click to select
        </p>
        <p className={styles.UploadPanel_limitText}>
          Up to 10 files per batch (max 10MB each)
        </p>
      </div>

      <div className={styles.UploadPanel_footer}>
        <button
          type="button"
          onClick={() => setShowFormats((open) => !open)}
          className={styles.UploadPanel_formatsBtn}
        >
          <FileType className={styles.UploadPanel_formatsIcon} aria-hidden />
          Supported Formats
        </button>

        {showFormats && (
          <div className={styles.UploadPanel_formatsList}>
            <p className={styles.UploadPanel_formatsTitle}>We support:</p>
            <ul className={styles.UploadPanel_list}>
              <li>PDF Documents (Native or Scanned)</li>
              <li>Images (JPG, PNG)</li>
              <li>Bill of Lading (BOL)</li>
              <li>Proof of Delivery (POD)</li>
              <li>Rate Confirmations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
