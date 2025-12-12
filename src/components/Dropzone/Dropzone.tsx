"use client";

import { useCallback, useState } from "react";
import cx from "clsx";
import {
  CheckCircle2,
  CloudUpload,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

import styles from "./Dropzone.module.css";
import type { DropzoneProps } from "./Dropzone.types";

import { Button, showToast } from "..";

export function Dropzone({ onFilesSelected, className, isBusy }: DropzoneProps) {
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setRecentFiles(acceptedFiles.slice(0, 3).map((file) => file.name));
      setStatus("uploading");
      onFilesSelected?.(acceptedFiles);
      setTimeout(() => setStatus("done"), 320);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
    disabled: isBusy,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    onDropRejected: (rejections) => {
      const hasTooMany = rejections.some((rej) =>
        rej.errors.some((error) => error.code === "too-many-files"),
      );
      const hasLarge = rejections.some((rej) =>
        rej.errors.some((error) => error.code === "file-too-large"),
      );

      if (hasTooMany) {
        showToast({
          title: "Upload limit",
          description: "Max 10 files per batch.",
          tone: "warning",
        });
      }
      if (hasLarge) {
        showToast({
          title: "File too large",
          description: "Each file must be under 10 MB.",
          tone: "error",
        });
      }
    },
  });

  const isLoading = isBusy || status === "uploading";

  return (
    <div
      {...getRootProps()}
      className={cx(styles.dropzone, className)}
      data-drag-active={isDragActive ? "true" : "false"}
    >
      <input {...getInputProps()} />
      <div className={styles.row}>
        <div className={styles.iconWrap} data-state={status}>
          {isLoading ? (
            <Loader2 size={22} className={styles.spinner} />
          ) : status === "done" ? (
            <CheckCircle2 size={22} />
          ) : (
            <CloudUpload size={22} />
          )}
        </div>
        <div className={styles.copy}>
          <p className={styles.headline}>
            {isDragActive
              ? "Drop to upload"
              : "Drag & drop up to 10 files, or click to select."}
          </p>
          <p className={styles.subline}>
            Drop multiple BOLs, PODs, or Rate Confirmations (PDF or image).
          </p>
        </div>
        <Button
          icon={isLoading ? <Loader2 size={16} /> : <Sparkles size={16} />}
          appearance="secondary"
          isLoading={isLoading}
        >
          {isLoading ? "Uploading…" : "Select files"}
        </Button>
      </div>
      {recentFiles.length > 0 && (
        <div className={styles.fileTag}>
          <FileText size={16} />
          <span>{recentFiles.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
