import { fetchJobStatus } from "../mocks/mockApi";
import type { JobStatus } from "../types";

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  return fetchJobStatus(jobId);
}
