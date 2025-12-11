"use client";

import { CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components";
import styles from "../Dashboard.module.css";

interface StatusCardProps {
  statusLabel: string;
  jobId?: string;
  isComplete?: boolean;
  onRefresh: () => void;
}

export function StatusCard({
  statusLabel,
  jobId,
  isComplete,
  onRefresh,
}: StatusCardProps) {
  return (
    <div className={styles.statusCard}>
      {isComplete ? (
        <CheckCircle2 size={18} color="#34d399" />
      ) : (
        <Clock3 size={18} color="#fbbf24" />
      )}
      <div style={{ flex: 1 }}>
        <p className={styles.statusTextPrimary}>{statusLabel}</p>
        <p className={styles.statusTextSecondary}>
          {jobId ? `Job ID: ${jobId}` : "Select a job to see status"}
        </p>
      </div>
      <Button appearance="ghost" onClick={onRefresh} disabled={!jobId}>
        Refresh
      </Button>
    </div>
  );
}
