import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postUpload } from "../mutations/upload";

const historyKey = ["history"];

export function useUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postUpload,
    onSuccess: ({ jobId }) => {
      void queryClient.invalidateQueries({ queryKey: historyKey });
      void queryClient.invalidateQueries({ queryKey: ["jobStatus", jobId] });
    },
  });
}
