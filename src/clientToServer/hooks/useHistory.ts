import { useQuery } from "@tanstack/react-query";

import { getHistory } from "../queries/history";

const historyKey = ["history"];

export function useHistory() {
  return useQuery({
    queryKey: historyKey,
    queryFn: getHistory,
    staleTime: 60 * 1000,
    refetchInterval: 2500,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
  });
}
