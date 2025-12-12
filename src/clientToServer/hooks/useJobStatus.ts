import { useQuery } from "@tanstack/react-query";

import { getJobStatus } from "../queries/jobStatus";

export function useJobStatus(jobId?: string | null) {
  return useQuery({
    queryKey: ["jobStatus", jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error("Job ID is required");
      }
      return getJobStatus(jobId);
    },
    enabled: Boolean(jobId),
    refetchInterval: (data) =>
      data?.status === "done" || data?.status === "failed" ? false : 1500,
  });
}
