import { apiClient } from "../apiClient";
import { createUpload, registerJob } from "../mocks/mockApi";
import type { UploadPayload } from "../types";

import { getSupabaseBrowserClient } from "../../lib/supabase/client";

export async function postUpload(payload: UploadPayload) {
  if (!payload.file) {
    // Fallback mock path for demo buttons without a real file.
    return createUpload(payload);
  }

  const supabase = getSupabaseBrowserClient();

  const uploadUrlResponse = await apiClient.post<{
    bucket: string;
    path: string;
    token: string;
  }>("/api/upload-url", {
    path: `incoming/${payload.name ?? `upload-${Date.now()}`}`,
  });

  const { error: uploadError } = await supabase.storage
    .from(uploadUrlResponse.bucket)
    .uploadToSignedUrl(uploadUrlResponse.path, uploadUrlResponse.token, payload.file);

  if (uploadError) {
    throw uploadError;
  }

  const startParseResponse = await apiClient.post<{ jobId: string }>(
    "/api/start-parse",
    {
      path: uploadUrlResponse.path,
      bucket: uploadUrlResponse.bucket,
      name: payload.name,
    },
  );

  registerJob({
    jobId: startParseResponse.jobId,
    name: payload.name ?? "upload",
    sizeKB: payload.sizeKB,
    status: "processing",
    progress: 15,
  });

  return startParseResponse;
}
