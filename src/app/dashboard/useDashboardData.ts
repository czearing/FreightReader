"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useHistory } from "@/clientToServer/hooks/useHistory";
import type { HistoryItem } from "@/clientToServer/types";
import { showToast } from "@/components";

const HISTORY_KEY = ["history"];
const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const dedupeById = (items: HistoryItem[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

export function useDashboardData() {
  const queryClient = useQueryClient();
  const historyQuery = useHistory();
  const [search, setSearch] = useState("");
  const [optimistic, setOptimistic] = useState<HistoryItem[]>([]);

  const refreshHistory = historyQuery.refetch;

  const updateHistoryCache = useCallback(
    (updater: (current: HistoryItem[]) => HistoryItem[]) => {
      queryClient.setQueryData<HistoryItem[]>(HISTORY_KEY, (current) => {
        const snapshot = Array.isArray(current) ? [...current] : [];
        return dedupeById(updater(snapshot));
      });
    },
    [queryClient],
  );

  const updateOptimistic = useCallback(
    (updater: (current: HistoryItem[]) => HistoryItem[]) => {
      setOptimistic((prev) => dedupeById(updater([...prev])));
    },
    [],
  );

  const addOptimisticUploads = useCallback(
    (files: File[]) => {
      if (!files.length) {
        return { acceptedFiles: [] as File[], rows: [] as HistoryItem[] };
      }

      if (files.length > MAX_FILES) {
        showToast({
          title: "Upload limit",
          description: "Max 10 files per batch.",
          tone: "warning",
        });
      }

      const acceptedFiles = files.slice(0, MAX_FILES).filter((file) => {
        if (file.size > MAX_FILE_BYTES) {
          showToast({
            title: "File too large",
            description: `${file.name} exceeds 10 MB and was skipped.`,
            tone: "error",
          });
          return false;
        }
        return true;
      });

      const rows: HistoryItem[] = acceptedFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        status: "processing",
        uploadedAt: new Date().toISOString(),
        sizeKB: Math.max(1, Math.round(file.size / 1024)),
        temp: true,
      }));

      if (rows.length) {
        updateOptimistic((prev) => [...rows, ...prev]);
      }

      return { acceptedFiles, rows };
    },
    [updateOptimistic],
  );

  const replaceTempWithReal = useCallback(
    (tempId: string, next: HistoryItem) => {
      updateOptimistic((prev) => prev.filter((item) => item.id !== tempId));
      updateHistoryCache((prev) => [next, ...prev.filter((item) => item.id !== tempId)]);
    },
    [updateHistoryCache, updateOptimistic],
  );

  const markFailed = useCallback(
    (tempId: string, errorMessage: string) => {
      updateOptimistic((prev) =>
        prev.map((item) =>
          item.id === tempId ? { ...item, status: "failed", errorMessage } : item,
        ),
      );
    },
    [updateOptimistic],
  );

  const togglePin = useCallback(
    (id: string) => {
      const flipPin = (item: HistoryItem) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item;

      updateOptimistic((prev) => prev.map(flipPin));
      updateHistoryCache((prev) => prev.map(flipPin));
    },
    [updateHistoryCache, updateOptimistic],
  );

  const deleteDocument = useCallback(
    (id: string) => {
      updateOptimistic((prev) => prev.filter((item) => item.id !== id));
      updateHistoryCache((prev) => prev.filter((item) => item.id !== id));
      showToast({ title: "Deleted", description: "Document removed from history." });
    },
    [updateHistoryCache, updateOptimistic],
  );

  const { filteredHistory, sortedHistory } = useMemo(() => {
    const combined = [...optimistic, ...(historyQuery.data ?? [])];
    const map = new Map<string, HistoryItem>();

    combined.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    const sorted = Array.from(map.values()).sort((a, b) => {
      const pinSort = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
      if (pinSort !== 0) return pinSort;

      const aDate = new Date(a.uploadedAt).getTime();
      const bDate = new Date(b.uploadedAt).getTime();
      return bDate - aDate;
    });

    const filtered = search.trim()
      ? sorted.filter((item) => {
          const term = search.trim().toLowerCase();
          return (
            item.name.toLowerCase().includes(term) ||
            (item.proNumber && item.proNumber.toLowerCase().includes(term)) ||
            (item.shipper && item.shipper.toLowerCase().includes(term)) ||
            (item.consignee && item.consignee.toLowerCase().includes(term))
          );
        })
      : sorted;

    return {
      filteredHistory: filtered,
      sortedHistory: sorted,
    };
  }, [historyQuery.data, optimistic, search]);

  const completedDocs = useMemo(
    () => sortedHistory.filter((item) => item.status === "done"),
    [sortedHistory],
  );

  const usage = {
    used: sortedHistory.length,
    limit: 50,
  };

  return {
    historyQuery,
    documents: filteredHistory,
    allDocuments: sortedHistory,
    completedDocs,
    search,
    setSearch,
    addOptimisticUploads,
    replaceTempWithReal,
    markFailed,
    togglePin,
    deleteDocument,
    refreshHistory,
    usage,
  };
}
