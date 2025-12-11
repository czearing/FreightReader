import { fetchHistory } from "../mocks/mockApi";
import type { HistoryItem } from "../types";

export async function getHistory(): Promise<HistoryItem[]> {
  return fetchHistory();
}
