import { createUpload } from "../mocks/mockApi";
import type { UploadPayload } from "../types";

export async function postUpload(payload: UploadPayload) {
  return createUpload(payload);
}
