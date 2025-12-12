import { useQuery } from "@tanstack/react-query";

import { getJobStatus } from "../queries/jobStatus";
import type { JobStatus } from "../types";

export function useJobStatus(jobId?: string | null) {
  return useQuery<JobStatus, Error>({
    queryKey: ["jobStatus", jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error("Job ID is required");
      }
      return getJobStatus(jobId);
    },
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "done" || status === "failed" ? false : 1500;
    },
  });
}
