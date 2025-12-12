export type JobStage = "queued" | "processing" | "done" | "failed";

export type HistoryStatus = "processing" | "done" | "failed";

export interface HistoryItem {
  id: string;
  name: string;
  status: HistoryStatus;
  uploadedAt: string;
  sizeKB: number;
  shipper?: string;
  consignee?: string;
  proNumber?: string;
  pinned?: boolean;
  errorMessage?: string;
  temp?: boolean;
}

export interface UploadPayload {
  name: string;
  sizeKB?: number;
  file?: File | Blob;
}

export interface JobStatus {
  jobId: string;
  status: JobStage;
  progress: number;
  updatedAt: string;
}
