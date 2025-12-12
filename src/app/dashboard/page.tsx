"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  Ghost,
  Paperclip,
  Pin,
  PinOff,
  RefreshCcw,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Dropzone,
  Input,
  showToast,
} from "@/components";
import { useUpload } from "@/clientToServer/hooks";
import type { HistoryItem } from "@/clientToServer/types";
import type { ExportFormat } from "@/lib/formatters";

import { useDashboardData } from "./useDashboardData";
import { useDownloads } from "./useDownloads";
import styles from "./page.module.css";

const statusCopy: Record<HistoryItem["status"], string> = {
  processing: "Processing",
  done: "Done",
  failed: "Failed",
};

const statusTone: Record<HistoryItem["status"], string> = {
  processing: styles.statusProcessing,
  done: styles.statusDone,
  failed: styles.statusFailed,
};

const formatAgo = (iso: string) => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return iso;
  }
};

const summaryText = (doc: HistoryItem) => {
  if (doc.shipper && doc.consignee) {
    return `${doc.shipper} → ${doc.consignee}`;
  }
  return "No preview available";
};

export default function DashboardPage() {
  const upload = useUpload();
  const {
    documents,
    allDocuments,
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
    historyQuery,
  } = useDashboardData();
  const downloads = useDownloads(allDocuments);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [lastExportFormat, setLastExportFormat] = useState<ExportFormat>("csv");
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("lastExportFormat") as ExportFormat | null;
      if (cached) {
        setLastExportFormat(cached);
      }
    } catch {
      // ignore
    }
  }, []);

  const isUploading = pendingUploads > 0 || upload.isPending;

  const handleFilesSelected = (files: File[]) => {
    const { acceptedFiles, rows } = addOptimisticUploads(files);

    rows.forEach((row, index) => {
      const file = acceptedFiles[index];
      if (!file) return;
      setPendingUploads((count) => count + 1);
      upload.mutate(
        {
          name: file.name,
          sizeKB: Math.max(1, Math.round(file.size / 1024)),
          file,
        },
        {
          onSuccess: ({ jobId }) => {
            replaceTempWithReal(row.id, {
              ...row,
              id: jobId,
              status: "processing",
              temp: false,
              uploadedAt: new Date().toISOString(),
            });
            showToast({
              title: "Upload started",
              description: `Job ${jobId} is processing.`,
              tone: "success",
            });
          },
          onError: (error) => {
            const message =
              error instanceof Error ? error.message : "Unable to upload file.";
            markFailed(row.id, message);
            showToast({
              title: "Upload failed",
              description: message,
              tone: "error",
            });
          },
          onSettled: () => {
            setPendingUploads((count) => Math.max(0, count - 1));
          },
        },
      );
    });
  };

  const onDownloadAll = (format: ExportFormat) => {
    setLastExportFormat(format);
    void downloads.downloadAll(format);
  };

  const onDownloadSingle = (doc: HistoryItem, format: ExportFormat) => {
    setLastExportFormat(format);
    downloads.downloadSingle(doc, format);
  };

  const emptyState = allDocuments.length === 0 && !historyQuery.isFetching;

  const heroSummary = useMemo(
    () => ({
      processing: allDocuments.filter((doc) => doc.status === "processing").length,
      failed: allDocuments.filter((doc) => doc.status === "failed").length,
    }),
    [allDocuments],
  );

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.logo}>FreightReader.io</div>
        <div className={styles.navActions}>
          <div className={styles.usageBadge}>
            <span className={styles.usagePlan}>Free</span>
            <span className={styles.usageCopy}>
              {usage.used} / {usage.limit} Docs Used
            </span>
          </div>
          <Button appearance="primary" icon={<UploadCloud size={16} />}>
            Upgrade Plan
          </Button>
          <Dropdown>
            <DropdownTrigger asChild>
              <button className={styles.avatarButton} aria-label="User menu">
                <span>FR</span>
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem>Account</DropdownItem>
              <DropdownItem tone="danger">Logout</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.summaryStrip}>
          <div className={styles.summaryItem}>
            <CheckCircle2 size={18} />
            <span>{completedDocs.length} done</span>
          </div>
          <div className={styles.summaryItem}>
            <UploadCloud size={18} />
            <span>{heroSummary.processing} processing</span>
          </div>
          <div className={styles.summaryItem}>
            <XCircle size={18} />
            <span>{heroSummary.failed} failed</span>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Upload Freight Documents</h2>
                <p className={styles.panelSub}>
                  Drop multiple BOLs, PODs, or Rate Confirmations (PDF or image).
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className={styles.linkButton}>Supported formats</button>
                </DialogTrigger>
                <DialogContent title="Supported document types">
                  <ul className={styles.supportedList}>
                    <li>Bills of Lading (BOL)</li>
                    <li>Proof of Delivery (POD)</li>
                    <li>Rate Confirmations</li>
                    <li>PDF, PNG, JPG, JPEG, WEBP up to 10 MB</li>
                    <li>Max 10 files per batch</li>
                  </ul>
                  <DialogFooter>
                    <DialogTrigger asChild>
                      <Button appearance="secondary">Close</Button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Dropzone onFilesSelected={handleFilesSelected} isBusy={isUploading} />
            <div className={styles.noteBox}>
              <UploadCloud size={16} />
              <span>No need to re-upload — reuse your parsed docs from history.</span>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <h2 className={styles.panelTitle}>Recent Documents</h2>
              </div>
              <div className={styles.actionsRow}>
                <Button
                  appearance="ghost"
                  icon={<RefreshCcw size={16} />}
                  onClick={() => refreshHistory()}
                  isLoading={historyQuery.isRefetching}
                >
                  Refresh
                </Button>

                <div className={styles.splitDownload}>
                  <Button
                    appearance="secondary"
                    icon={<Download size={16} />}
                    disabled={!downloads.hasCompletedDocs || downloads.isPreparing}
                    onClick={() => onDownloadAll(lastExportFormat)}
                  >
                    Download All
                  </Button>
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Button
                        appearance="ghost"
                        icon={<ChevronDown size={14} />}
                        disabled={!downloads.hasCompletedDocs || downloads.isPreparing}
                        aria-label="Choose export format"
                      />
                    </DropdownTrigger>
                    <DropdownContent align="end">
                      <DropdownItem onSelect={() => onDownloadAll("csv")}>
                        As CSV (.zip)
                      </DropdownItem>
                      <DropdownItem onSelect={() => onDownloadAll("json")}>
                        As JSON (.zip)
                      </DropdownItem>
                      <DropdownItem onSelect={() => onDownloadAll("quickbooks")}>
                        As QuickBooks (.zip)
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>
                <div className={styles.searchField}>
                  <Input
                    placeholder="Search filename or PRO #"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leadingIcon={<Search size={16} />}
                  />
                </div>
              </div>
            </div>

            {emptyState ? (
              <div className={styles.emptyState}>
                <Ghost size={32} />
                <p className={styles.emptyTitle}>No documents processed yet.</p>
                <p className={styles.emptySub}>
                  Upload your first file on the left to get started.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <div className={styles.tableHead}>
                    <span>File</span>
                    <span>Status</span>
                    <span>Extracted Fields</span>
                    <span>Uploaded</span>
                    <span>Actions</span>
                  </div>
                  <div>
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={styles.tableRow}
                        data-state={doc.status}
                      >
                        <div className={styles.cellFile}>
                          <Paperclip size={16} />
                          <span className={styles.filename}>{doc.name}</span>
                        </div>
                        <div className={styles.cellStatus}>
                          <span className={statusTone[doc.status]}>
                            {statusCopy[doc.status]}
                          </span>
                          {doc.status === "processing" && (
                            <span className={styles.shimmer} aria-hidden />
                          )}
                          {doc.status === "failed" && doc.errorMessage && (
                            <span className={styles.errorHint}>{doc.errorMessage}</span>
                          )}
                        </div>
                        <div className={styles.cellSummary}>{summaryText(doc)}</div>
                        <div className={styles.cellUploaded}>{formatAgo(doc.uploadedAt)}</div>
                        <div className={styles.cellActions}>
                          <Dropdown>
                            <DropdownTrigger asChild>
                              <Button appearance="ghost" icon={<Download size={14} />}>
                                Download as…
                              </Button>
                            </DropdownTrigger>
                            <DropdownContent align="end">
                              <DropdownItem onSelect={() => onDownloadSingle(doc, "csv")}>
                                CSV
                              </DropdownItem>
                              <DropdownItem onSelect={() => onDownloadSingle(doc, "json")}>
                                JSON
                              </DropdownItem>
                              <DropdownItem
                                onSelect={() => onDownloadSingle(doc, "quickbooks")}
                              >
                                QuickBooks
                              </DropdownItem>
                            </DropdownContent>
                          </Dropdown>
                          <Button appearance="ghost" onClick={() => setSelected(doc)}>
                            View details
                          </Button>
                          <button
                            className={styles.iconButton}
                            aria-label={doc.pinned ? "Unpin" : "Pin"}
                            onClick={() => togglePin(doc.id)}
                          >
                            {doc.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                          </button>
                          <button
                            className={styles.iconButton}
                            aria-label="Delete"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.cardList}>
                  {documents.map((doc) => (
                    <div key={`card-${doc.id}`} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cellFile}>
                          <Paperclip size={16} />
                          <span className={styles.filename}>{doc.name}</span>
                        </div>
                        <div className={styles.cellStatus}>
                          <span className={statusTone[doc.status]}>
                            {statusCopy[doc.status]}
                          </span>
                        </div>
                      </div>
                      <p className={styles.cardLine}>Status: {statusCopy[doc.status]}</p>
                      <p className={styles.cardLine}>Shipper: {doc.shipper ?? "—"}</p>
                      <p className={styles.cardLine}>
                        Consignee: {doc.consignee ?? "—"}
                      </p>
                      <p className={styles.cardLine}>Uploaded: {formatAgo(doc.uploadedAt)}</p>
                      <div className={styles.cardActions}>
                        <Dropdown>
                          <DropdownTrigger asChild>
                            <Button appearance="secondary" icon={<Download size={14} />}>
                              Download
                            </Button>
                          </DropdownTrigger>
                          <DropdownContent align="end">
                            <DropdownItem onSelect={() => onDownloadSingle(doc, "csv")}>
                              CSV
                            </DropdownItem>
                            <DropdownItem onSelect={() => onDownloadSingle(doc, "json")}>
                              JSON
                            </DropdownItem>
                            <DropdownItem
                              onSelect={() => onDownloadSingle(doc, "quickbooks")}
                            >
                              QuickBooks
                            </DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                        <Button appearance="ghost" onClick={() => setSelected(doc)}>
                          Details
                        </Button>
                        <button
                          className={styles.iconButton}
                          aria-label={doc.pinned ? "Unpin" : "Pin"}
                          onClick={() => togglePin(doc.id)}
                        >
                          {doc.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent
          title={selected?.name ?? "Document"}
          description={
            selected
              ? `Status: ${statusCopy[selected.status]}`
              : undefined
          }
        >
          {selected && (
            <div className={styles.detailBody}>
              <div className={styles.detailRow}>
                <span>Shipper</span>
                <strong>{selected.shipper ?? "—"}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Consignee</span>
                <strong>{selected.consignee ?? "—"}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>PRO #</span>
                <strong>{selected.proNumber ?? "—"}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Uploaded</span>
                <strong>{formatAgo(selected.uploadedAt)}</strong>
              </div>
              {selected.errorMessage && (
                <div className={styles.errorBanner}>
                  <XCircle size={16} />
                  <span>{selected.errorMessage}</span>
                </div>
              )}

              <div className={styles.detailActions}>
                <Dropdown>
                  <DropdownTrigger asChild>
                    <Button appearance="secondary" icon={<Download size={14} />}>
                      Download as…
                    </Button>
                  </DropdownTrigger>
                  <DropdownContent align="end">
                    <DropdownItem onSelect={() => onDownloadSingle(selected, "csv")}>
                      CSV
                    </DropdownItem>
                    <DropdownItem onSelect={() => onDownloadSingle(selected, "json")}>
                      JSON
                    </DropdownItem>
                    <DropdownItem
                      onSelect={() => onDownloadSingle(selected, "quickbooks")}
                    >
                      QuickBooks
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
                <Button
                  appearance="ghost"
                  icon={selected.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                  onClick={() => togglePin(selected.id)}
                >
                  {selected.pinned ? "Unpin" : "Pin"}
                </Button>
                <Button
                  appearance="ghost"
                  icon={<Trash2 size={14} />}
                  onClick={() => {
                    deleteDocument(selected.id);
                    setSelected(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogTrigger asChild>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
