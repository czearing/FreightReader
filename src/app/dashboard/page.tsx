"use client";

import { Download, ListChecks } from "lucide-react";

import { Button, showToast } from "@/components/ui";
import { Dropzone } from "@/components/ui/Dropzone/Dropzone";
import { HistoryList } from "./components/HistoryList";
import { StatusCard } from "./components/StatusCard";
import styles from "./Dashboard.module.css";
import { useDashboardData } from "./useDashboardData";

export default function DashboardPage() {
  const {
    history,
    historyLoading,
    activeJobId,
    setActiveJobId,
    jobStatus,
    statusLabel,
  } = useDashboardData();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.headerMeta}>
            <ListChecks size={16} color="#38bdf8" />
            Core broker workflow
          </p>
          <h1 className={styles.title}>Upload + parse shell</h1>
        </div>
        <Button
          appearance="secondary"
          icon={<Download size={16} />}
          onClick={() =>
            showToast({
              title: "CSV export coming soon",
              description: "Hook this button to your reporting endpoint.",
              tone: "info",
            })
          }
        >
          Download CSV
        </Button>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.statusTextSecondary}>Step 1</p>
              <h2 style={{ margin: "0.1rem 0 0", fontSize: "1.3rem" }}>
                Drop freight documents
              </h2>
            </div>
            <span className={styles.pill}>Live</span>
          </div>
          <Dropzone onJobCreated={(jobId) => setActiveJobId(jobId)} />
          <StatusCard
            statusLabel={statusLabel}
            jobId={activeJobId}
            isComplete={jobStatus.data?.status === "complete"}
            onRefresh={() => jobStatus.refetch()}
          />
        </div>

        <div
          className={styles.card}
          style={{ gap: "0.75rem", alignContent: "start" }}
        >
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.statusTextSecondary}>Step 2</p>
              <h2 style={{ margin: "0.1rem 0 0", fontSize: "1.2rem" }}>
                History
              </h2>
            </div>
            <span
              style={{
                fontSize: "0.9rem",
                color: "rgba(229, 231, 235, 0.75)",
              }}
            >
              {historyLoading ? "Loading…" : `${history?.length ?? 0} files`}
            </span>
          </div>
          <HistoryList
            history={history}
            activeJobId={activeJobId}
            onSelect={(id) => setActiveJobId(id)}
            isLoading={historyLoading}
          />
        </div>
      </section>
    </main>
  );
}
