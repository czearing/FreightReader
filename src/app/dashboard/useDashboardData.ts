"use client";

import { useEffect, useMemo, useState } from "react";

import { useHistory, useJobStatus } from "@/clientToServer/hooks";

export function useDashboardData() {
  const { data: history, isLoading: historyLoading } = useHistory();
  const [activeJobId, setActiveJobId] = useState<string | undefined>();
  const jobStatus = useJobStatus(activeJobId);

  useEffect(() => {
    if (!activeJobId && history?.length) {
      setActiveJobId(history[0].id);
    }
  }, [activeJobId, history]);

  const statusLabel = useMemo(() => {
    if (!jobStatus.data) {
      return "Idle";
    }
    if (jobStatus.data.status === "complete") {
      return "Done";
    }
    return `Processing ${jobStatus.data.progress}%`;
  }, [jobStatus.data]);

  return {
    history,
    historyLoading,
    activeJobId,
    setActiveJobId,
    jobStatus,
    statusLabel,
  };
}
