import { useMemo, useState } from "react";
import cx from "clsx";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  Eye,
  FileJson,
  FileText,
  Paperclip,
  RefreshCw,
  Search,
  Table as TableIcon,
  Trash2,
} from "lucide-react";

import styles from "./HistoryPanel.module.css";
import type { HistoryPanelProps } from "./HistoryPanel.types";
import { DocumentModal } from "../DocumentModal/DocumentModal";

const normalizeDate = (value: Date) =>
  value instanceof Date ? value : new Date(value);

export const HistoryPanel = ({
  documents,
  onRefresh,
  onDelete,
  onUpdate,
  onDownload,
  onDownloadAll,
  defaultExportFormat = "CSV",
}: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<
    HistoryPanelProps["documents"][number] | null
  >(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const mainExportFormat = defaultExportFormat;

  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredDocs = useMemo(() => {
    const filtered = documents.filter((doc) => {
      if (!normalizedQuery) {
        return true;
      }
      const nameMatch = doc.name.toLowerCase().includes(normalizedQuery);
      const shipperMatch = doc.data?.shipper.name
        ?.toLowerCase()
        .includes(normalizedQuery);
      const consigneeMatch = doc.data?.consignee.name
        ?.toLowerCase()
        .includes(normalizedQuery);
      const proMatch = doc.data?.references.pro
        ?.toLowerCase()
        .includes(normalizedQuery);
      return [nameMatch, shipperMatch, consigneeMatch, proMatch].some(Boolean);
    });

    return filtered.sort(
      (a, b) =>
        normalizeDate(b.uploadedAt).getTime() -
        normalizeDate(a.uploadedAt).getTime(),
    );
  }, [documents, normalizedQuery]);

  const readyDocs = useMemo(
    () =>
      documents.filter(
        (doc) => doc.status === "DONE" && doc.data?.readyForExport,
      ),
    [documents],
  );
  const completedDocsCount = readyDocs.length;

  const getStatusBadge = (
    status: HistoryPanelProps["documents"][number]["status"],
  ) => {
    switch (status) {
      case "DONE":
        return (
          <span
            className={cx(styles.HistoryPanel_badge, styles.HistoryPanel_badgeDone)}
          >
            Done
          </span>
        );
      case "PROCESSING":
        return (
          <span
            className={cx(
              styles.HistoryPanel_badge,
              styles.HistoryPanel_badgeProcessing,
            )}
          >
            Processing
          </span>
        );
      case "FAILED":
        return (
          <span
            className={cx(styles.HistoryPanel_badge, styles.HistoryPanel_badgeFailed)}
          >
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const handleDownloadAllClick = (format: "CSV" | "JSON" | "QBOOKS") => {
    onDownloadAll(format);
    setShowDownloadMenu(false);
  };

  return (
    <div className={styles.HistoryPanel_container}>
      <div className={styles.HistoryPanel_header}>
        <div>
          <h2 className={styles.HistoryPanel_headerTitle}>Recent Documents</h2>
          <p className={styles.HistoryPanel_headerSubtitle}>
            {filteredDocs.length} documents found
          </p>
        </div>

        <div className={styles.HistoryPanel_actionsArea}>
          <div className={styles.HistoryPanel_searchContainer}>
            <Search className={styles.HistoryPanel_searchIcon} aria-hidden />
            <input
              type="text"
              placeholder="Search filename or PRO..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={styles.HistoryPanel_searchInput}
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className={styles.HistoryPanel_refreshBtn}
            title="Refresh"
          >
            <RefreshCw size={16} aria-hidden />
          </button>

          <div className={styles.HistoryPanel_splitBtnContainer}>
            <div className={styles.HistoryPanel_splitBtnGroup}>
              <button
                type="button"
                disabled={completedDocsCount === 0}
                onClick={() => onDownloadAll(mainExportFormat)}
                className={styles.HistoryPanel_mainExportBtn}
              >
                Export {mainExportFormat === "QBOOKS" ? "QuickBooks" : mainExportFormat}
              </button>
              <button
                type="button"
                disabled={completedDocsCount === 0}
                onClick={() => setShowDownloadMenu((open) => !open)}
                className={styles.HistoryPanel_dropdownTriggerBtn}
                aria-expanded={showDownloadMenu}
              >
                <ChevronDown size={16} aria-hidden />
              </button>
            </div>

            {showDownloadMenu && (
              <>
                <div
                  className={styles.HistoryPanel_overlay}
                  onClick={() => setShowDownloadMenu(false)}
                />
                <div className={styles.HistoryPanel_dropdownMenu}>
                  <button
                    type="button"
                    onClick={() => handleDownloadAllClick("JSON")}
                    className={styles.HistoryPanel_dropdownItem}
                  >
                    <FileJson
                      size={16}
                      className={styles.HistoryPanel_inlineIcon}
                      aria-hidden
                    />{" "}
                    As JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadAllClick("QBOOKS")}
                    className={styles.HistoryPanel_dropdownItem}
                  >
                    <FileText
                      size={16}
                      className={styles.HistoryPanel_inlineIcon}
                      aria-hidden
                    />{" "}
                    As QuickBooks
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={cx(styles.HistoryPanel_contentArea, "custom-scrollbar")}
        role="region"
        aria-label="Processed documents"
      >
        {documents.length === 0 ? (
          <div className={styles.HistoryPanel_emptyState}>
            <div className={styles.HistoryPanel_emptyIconWrapper}>
              <TableIcon className={styles.HistoryPanel_emptyIcon} aria-hidden />
            </div>
            <h3 className={styles.HistoryPanel_emptyTitle}>
              No documents processed yet
            </h3>
            <p className={styles.HistoryPanel_emptyText}>
              Upload your first freight document on the left panel to get started.
            </p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className={styles.HistoryPanel_emptyState}>
            <Search
              className={cx(
                styles.HistoryPanel_emptyIcon,
                styles.HistoryPanel_emptyIconGap,
              )}
              aria-hidden
            />
            <p className={styles.HistoryPanel_emptyText}>
              No documents match your search.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.HistoryPanel_tableContainer}>
              <table className={styles.HistoryPanel_table}>
                <thead className={styles.HistoryPanel_thead}>
                  <tr>
                    <th className={styles.HistoryPanel_th}>File</th>
                    <th className={styles.HistoryPanel_th}>Status</th>
                    <th className={styles.HistoryPanel_th}>Extracted Route</th>
                    <th className={styles.HistoryPanel_th}>PRO #</th>
                    <th
                      className={cx(
                        styles.HistoryPanel_th,
                        styles.HistoryPanel_textRight,
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.HistoryPanel_tbody}>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td className={styles.HistoryPanel_td}>
                        <div className={styles.HistoryPanel_fileCell}>
                          <div className={styles.HistoryPanel_fileIconWrapper}>
                            <Paperclip
                              className={styles.HistoryPanel_inlineIcon}
                              aria-hidden
                            />
                          </div>
                          <div className={styles.HistoryPanel_fileInfo}>
                            <p
                              className={styles.HistoryPanel_fileName}
                              title={doc.name}
                            >
                              {doc.name}
                            </p>
                            <p className={styles.HistoryPanel_fileTime}>
                              {normalizeDate(doc.uploadedAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.HistoryPanel_td}>
                        <div className={styles.HistoryPanel_statusStack}>
                          {getStatusBadge(doc.status)}
                          {doc.status === "DONE" && doc.data && !doc.data.readyForExport && (
                            <span
                              className={cx(
                                styles.HistoryPanel_badge,
                                styles.HistoryPanel_badgeReview,
                              )}
                            >
                              Needs review
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={cx(styles.HistoryPanel_td, styles.HistoryPanel_muted)}>
                        {doc.status === "PROCESSING" ? (
                          <div
                            className={cx(
                              styles.HistoryPanel_shimmerBox,
                              "shimmer",
                            )}
                          />
                        ) : doc.status === "DONE" && doc.data ? (
                          <span
                            className={styles.HistoryPanel_routeCell}
                            title={`${doc.data.shipper.name ?? "Missing"} → ${doc.data.consignee.name ?? "Missing"}`}
                          >
                            {(doc.data.shipper.name ?? "Missing").split(" ")[0]} →{" "}
                            {(doc.data.consignee.name ?? "Missing").split(" ")[0]}
                          </span>
                        ) : (
                          <span
                            className={cx(
                              styles.HistoryPanel_mutedSubtle,
                              styles.HistoryPanel_italic,
                            )}
                          >
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td
                        className={cx(
                          styles.HistoryPanel_td,
                          styles.HistoryPanel_muted,
                          styles.HistoryPanel_mono,
                          styles.HistoryPanel_textXs,
                        )}
                      >
                        {doc.status === "PROCESSING" ? (
                          <div
                            className={cx(
                              styles.HistoryPanel_shimmerBoxSmall,
                              "shimmer",
                            )}
                          />
                        ) : (
                          doc.data?.references.pro ??
                          doc.data?.references.bol ??
                          doc.data?.references.po ??
                          "-"
                        )}
                      </td>
                      <td
                        className={cx(
                          styles.HistoryPanel_td,
                          styles.HistoryPanel_textRight,
                        )}
                      >
                        <div className={styles.HistoryPanel_rowActions}>
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className={cx(
                              styles.HistoryPanel_actionBtn,
                              styles.HistoryPanel_actionBtnView,
                            )}
                            title="View Details"
                          >
                            <Eye size={16} aria-hidden />
                          </button>
                          {doc.status === "DONE" && (
                            <button
                              type="button"
                              onClick={() => onDownload(doc.id, "CSV")}
                              disabled={!doc.data?.readyForExport}
                              className={cx(
                                styles.HistoryPanel_actionBtn,
                                styles.HistoryPanel_actionBtnDownload,
                              )}
                              title="Download CSV"
                            >
                              <Download size={16} aria-hidden />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDelete(doc.id)}
                            className={cx(
                              styles.HistoryPanel_actionBtn,
                              styles.HistoryPanel_actionBtnDelete,
                            )}
                            title="Delete"
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.HistoryPanel_mobileList}>
              {filteredDocs.map((doc) => (
                <div key={doc.id} className={styles.HistoryPanel_mobileCard}>
                  <div className={styles.HistoryPanel_cardHeader}>
                    <div className={styles.HistoryPanel_cardFile}>
                      <Paperclip
                        size={16}
                        className={styles.HistoryPanel_inlineIcon}
                        aria-hidden
                      />
                      <span className={styles.HistoryPanel_mobileFileName}>
                        {doc.name}
                      </span>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  {doc.status === "PROCESSING" ? (
                    <div style={{ marginBottom: 16 }}>
                      <div
                        className={cx(
                          styles.HistoryPanel_shimmerBox,
                          "shimmer",
                        )}
                        style={{ width: "75%", marginBottom: 8 }}
                      />
                      <div
                        className={cx(
                          styles.HistoryPanel_shimmerBox,
                          "shimmer",
                        )}
                        style={{ width: "50%" }}
                      />
                    </div>
                  ) : doc.status === "DONE" && doc.data ? (
                    <div className={styles.HistoryPanel_cardData}>
                      {!doc.data.readyForExport && (
                        <div className={styles.HistoryPanel_cardBadge}>
                          <AlertTriangle size={12} aria-hidden />
                          Needs review
                        </div>
                      )}
                      <p>
                        <span className={styles.HistoryPanel_cardLabel}>
                          Shipper:
                        </span>{" "}
                        {doc.data.shipper.name ?? "Missing"}
                      </p>
                      <p>
                        <span className={styles.HistoryPanel_cardLabel}>
                          Consignee:
                        </span>{" "}
                        {doc.data.consignee.name ?? "Missing"}
                      </p>
                      <p>
                        <span className={styles.HistoryPanel_cardLabel}>
                          PRO:
                        </span>{" "}
                        {doc.data.references.pro ??
                          doc.data.references.bol ??
                          doc.data.references.po ??
                          "-"}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={cx(
                        styles.HistoryPanel_errorText,
                        styles.HistoryPanel_textXs,
                      )}
                      style={{ marginBottom: 16 }}
                    >
                      <AlertTriangle size={14} aria-hidden />
                      Extraction Failed
                    </div>
                  )}

                  <div className={styles.HistoryPanel_cardFooter}>
                    <span className={styles.HistoryPanel_cardTime}>
                      {normalizeDate(doc.uploadedAt).toLocaleTimeString()}
                    </span>
                    <div className={styles.HistoryPanel_cardActions}>
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(doc)}
                        className={cx(
                          styles.HistoryPanel_cardBtn,
                          styles.HistoryPanel_cardBtnDetails,
                        )}
                      >
                        Details
                      </button>
                      {doc.status === "DONE" && (
                      <button
                        type="button"
                        onClick={() => onDownload(doc.id, "CSV")}
                        disabled={!doc.data.readyForExport}
                        className={cx(
                          styles.HistoryPanel_cardBtn,
                          styles.HistoryPanel_cardBtnDownload,
                        )}
                      >
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedDoc && (
        <DocumentModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={onDownload}
          onDelete={() => {
            onDelete(selectedDoc.id);
            setSelectedDoc(null);
          }}
          onUpdate={(data) => {
            if (data) {
              onUpdate(selectedDoc.id, () => data);
              setSelectedDoc((previous) =>
                previous && previous.id === selectedDoc.id
                  ? { ...previous, data }
                  : previous,
              );
            }
          }}
        />
      )}
    </div>
  );
};
