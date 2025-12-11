"use client";

import cx from "clsx";

import type { HistoryItem } from "@/clientToServer/types";
import { formatDateTime, formatStatus } from "@/clientToServer/utils/format";
import styles from "../Dashboard.module.css";

interface HistoryListProps {
  history?: HistoryItem[];
  activeJobId?: string;
  onSelect: (jobId: string) => void;
  isLoading?: boolean;
}

export function HistoryList({
  history,
  activeJobId,
  onSelect,
  isLoading,
}: HistoryListProps) {
  if (isLoading) {
    return <p className={styles.emptyState}>Loading history…</p>;
  }

  if (!history?.length) {
    return (
      <p className={styles.emptyState}>Drop a file to seed history.</p>
    );
  }

  return (
    <div className={styles.historyList}>
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cx(
            styles.historyItem,
            activeJobId === item.id && styles.historyItemActive,
          )}
        >
          <div className={styles.historyMeta}>
            <p className={styles.historyName}>{item.name}</p>
            <p className={styles.historyDate}>{formatDateTime(item.uploadedAt)}</p>
          </div>
          <span
            className={cx(
              styles.statusBadge,
              item.status === "complete"
                ? styles.statusBadgeComplete
                : styles.statusBadgeProcessing,
            )}
          >
            {formatStatus(item.status)}
          </span>
        </button>
      ))}
    </div>
  );
}
