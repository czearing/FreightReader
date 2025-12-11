import type { HistoryItem, JobStatus, UploadPayload } from "../types";

const mockHistory: HistoryItem[] = [
  {
    id: "job-demo-1",
    name: "BOL-West-Coast.pdf",
    status: "complete",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sizeKB: 420,
  },
  {
    id: "job-demo-2",
    name: "POD-39493.pdf",
    status: "processing",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sizeKB: 260,
  },
];

const jobStatuses: Record<string, JobStatus> = {
  "job-demo-1": {
    jobId: "job-demo-1",
    status: "complete",
    progress: 100,
    updatedAt: new Date().toISOString(),
  },
  "job-demo-2": {
    jobId: "job-demo-2",
    status: "processing",
    progress: 52,
    updatedAt: new Date().toISOString(),
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function registerJob({
  jobId,
  name,
  sizeKB,
  status = "queued",
  progress = 0,
  uploadedAt = new Date().toISOString(),
}: {
  jobId: string;
  name: string;
  sizeKB?: number;
  status?: HistoryItem["status"];
  progress?: number;
  uploadedAt?: string;
}) {
  const historyItem: HistoryItem = {
    id: jobId,
    name: name || "unnamed-upload.pdf",
    status,
    uploadedAt,
    sizeKB: sizeKB ?? 512,
  };

  mockHistory.unshift(historyItem);
  jobStatuses[jobId] = {
    jobId,
    status,
    progress,
    updatedAt: uploadedAt,
  };
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  await sleep(220);
  return mockHistory.map((item) => ({ ...item }));
}

export async function fetchJobStatus(jobId: string): Promise<JobStatus> {
  await sleep(180);
  const existing = jobStatuses[jobId];

  if (!existing) {
    throw new Error("Job not found");
  }

  const now = Date.now();
  const next = { ...existing };

  if (existing.status !== "complete" && existing.status !== "error") {
    next.progress = Math.min(100, existing.progress + Math.ceil(Math.random() * 20));
    next.status = next.progress >= 100 ? "complete" : "processing";
    next.updatedAt = new Date(now).toISOString();
    jobStatuses[jobId] = next;
  }

  return { ...next };
}

export async function createUpload(
  payload: UploadPayload,
): Promise<{ jobId: string }> {
  await sleep(200);

  const jobId = `job-${makeId()}`;
  const uploadedAt = new Date().toISOString();

  registerJob({
    jobId,
    name: payload.name,
    sizeKB: payload.sizeKB,
    status: "queued",
    progress: 0,
    uploadedAt,
  });

  return { jobId };
}
