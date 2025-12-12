import type { HistoryItem, JobStatus, UploadPayload } from "../types";

const mockHistory: HistoryItem[] = [
  {
    id: "job-demo-1",
    name: "BOL-West-Coast.pdf",
    status: "done",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sizeKB: 420,
    shipper: "Walmart DC",
    consignee: "Target DC",
    proNumber: "BOL1234",
    pinned: true,
  },
  {
    id: "job-demo-2",
    name: "POD-39493.pdf",
    status: "processing",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sizeKB: 260,
    shipper: "Maersk Seattle",
    consignee: "Fresh Market Boise",
    proNumber: "POD39493",
  },
];

const jobStatuses: Record<string, JobStatus> = {
  "job-demo-1": {
    jobId: "job-demo-1",
    status: "done",
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

const advanceJob = (jobId: string) => {
  const existing = jobStatuses[jobId];
  if (!existing) return null;

  const now = Date.now();
  const next = { ...existing };

  if (existing.status !== "done" && existing.status !== "failed") {
    next.progress = Math.min(100, existing.progress + Math.ceil(Math.random() * 20));
    next.status = next.progress >= 100 ? "done" : "processing";
    next.updatedAt = new Date(now).toISOString();
    jobStatuses[jobId] = next;
  }

  return next;
};

export function registerJob({
  jobId,
  name,
  sizeKB,
  status = "queued",
  progress = 0,
  uploadedAt = new Date().toISOString(),
  shipper,
  consignee,
  proNumber,
  pinned,
  errorMessage,
}: {
  jobId: string;
  name: string;
  sizeKB?: number;
  status?: HistoryItem["status"] | JobStatus["status"];
  progress?: number;
  uploadedAt?: string;
  shipper?: string;
  consignee?: string;
  proNumber?: string;
  pinned?: boolean;
  errorMessage?: string;
}) {
  const historyItem: HistoryItem = {
    id: jobId,
    name: name || "unnamed-upload.pdf",
    status: status === "queued" ? "processing" : (status as HistoryItem["status"]),
    uploadedAt,
    sizeKB: sizeKB ?? 512,
    shipper,
    consignee,
    proNumber,
    pinned,
    errorMessage,
  };

  mockHistory.unshift(historyItem);
  jobStatuses[jobId] = {
    jobId,
    status: status === "queued" ? "processing" : status,
    progress,
    updatedAt: uploadedAt,
  };
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  await sleep(220);
  const withStatus = mockHistory.map((item) => {
    const status = advanceJob(item.id);
    if (status) {
      item.status = status.status as HistoryItem["status"];
    }
    return { ...item };
  });
  return withStatus;
}

export async function fetchJobStatus(jobId: string): Promise<JobStatus> {
  await sleep(180);
  const status = advanceJob(jobId);

  if (!status) {
    throw new Error("Job not found");
  }

  return { ...status };
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
