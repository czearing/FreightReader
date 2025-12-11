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
import { useUpload } from "../../../clientToServer/hooks";

export function Dropzone({ onJobCreated, className }: DropzoneProps) {
  const upload = useUpload();
  const [lastFileName, setLastFileName] = useState<string>();
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      setLastFileName(file.name);
      setStatus("uploading");

      upload.mutate(
        {
          name: file.name,
          sizeKB: Math.max(1, Math.round(file.size / 1024)),
          file,
        },
        {
          onSuccess: ({ jobId }) => {
            setStatus("done");
            onJobCreated?.(jobId);
            showToast({
              title: "Upload started",
              description: `Job ${jobId} is processing.`,
              tone: "success",
            });
          },
          onError: (error) => {
            setStatus("idle");
            const message =
              error instanceof Error ? error.message : "Unable to upload file.";
            showToast({
              title: "Upload failed",
              description: message,
              tone: "error",
            });
          },
        }
      );
    },
    [upload, onJobCreated]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  });

  const isLoading = upload.isPending || status === "uploading";

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
              : "Drop freight PDFs or click to browse"}
          </p>
          <p className={styles.subline}>
            We’ll request a signed URL, upload securely, then start parsing.
          </p>
        </div>
        <Button
          icon={isLoading ? <Loader2 size={16} /> : <Sparkles size={16} />}
          appearance="secondary"
          isLoading={isLoading}
        >
          {isLoading ? "Uploading…" : "Select file"}
        </Button>
      </div>
      {lastFileName && (
        <div className={styles.fileTag}>
          <FileText size={16} />
          <span>{lastFileName}</span>
        </div>
      )}
    </div>
  );
}
