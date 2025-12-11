export type JobStage = "queued" | "processing" | "complete" | "error";

export interface HistoryItem {
  id: string;
  name: string;
  status: JobStage;
  uploadedAt: string;
  sizeKB: number;
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
