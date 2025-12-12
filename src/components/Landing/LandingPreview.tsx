import { CheckCircle, FileText, MoreHorizontal, UploadCloud } from "lucide-react";

import styles from "@/app/marketing/LandingPage.module.css";
import type { PreviewRow } from "./Landing.types";

interface LandingPreviewProps {
  rows: PreviewRow[];
  dots: string[];
}

export const LandingPreview = ({ rows, dots }: LandingPreviewProps) => (
  <section className={styles.Landing_heroImageWrapper}>
    <div className={styles.Landing_previewTransformWrapper}>
      <div className={styles.Landing_previewWindow}>
        <PreviewHeader dots={dots} />
        <div className={styles.Landing_previewBody}>
          <PreviewSidebar />
          <PreviewTable rows={rows} />
        </div>
      </div>

      <div className={styles.Landing_floatingCard}>
        <div className={styles.Landing_toastIconBox}>
          <CheckCircle width={16} height={16} />
        </div>
        <div className={styles.Landing_toastContent}>
          <p className={styles.Landing_toastTitle}>Extraction Complete</p>
          <p className={styles.Landing_toastSubtitle}>BOL-7392_Coyote.pdf</p>
        </div>
      </div>
    </div>
  </section>
);

const PreviewHeader = ({ dots }: { dots: string[] }) => (
  <div className={styles.Landing_previewHeader}>
    <div className={styles.Landing_previewControls}>
      {dots.map((color) => (
        <div
          key={color}
          className={styles.Landing_previewDot}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    <div className={styles.Landing_previewAddressBar}>
      app.freightreader.io/dashboard
    </div>
  </div>
);

const PreviewSidebar = () => (
  <div className={styles.Landing_previewSidebar}>
    <div className={styles.Landing_previewUploadBox}>
      <div className={styles.Landing_previewIconCircle}>
        <UploadCloud
          width={20}
          height={20}
          style={{ color: "var(--brand-solid)" }}
        />
      </div>
      <div className={styles.Landing_previewUploadText}>
        <span>Drop BOLs here</span>
        <span
          className={`${styles.Landing_textSecondary} ${styles.Landing_textXs}`}
        >
          PDF, PNG, JPG
        </span>
      </div>
    </div>

    <div className={styles.Landing_previewStats}>
      <div className={styles.Landing_previewStatItem}>
        <span
          className={`${styles.Landing_textSecondary} ${styles.Landing_textXs}`}
        >
          Monthly Usage
        </span>
        <div className={styles.Landing_previewProgress}>
          <div
            className={styles.Landing_previewProgressFill}
            style={{ width: "65%" }}
          />
        </div>
      </div>
    </div>
  </div>
);

const PreviewTable = ({ rows }: { rows: PreviewRow[] }) => (
  <div className={styles.Landing_previewMain}>
    <div className={styles.Landing_previewTableHeader}>
      <span>Recent Extractions</span>
      <MoreHorizontal width={16} height={16} />
    </div>

    {rows.map((row) => (
      <PreviewRowItem key={row.title} row={row} />
    ))}
  </div>
);

const PreviewRowItem = ({ row }: { row: PreviewRow }) => (
  <div className={styles.Landing_previewRow}>
    <div className={styles.Landing_previewFile}>
      <FileText
        width={16}
        height={16}
        className={styles.Landing_textBrand}
      />
      <div className={styles.Landing_flexCol}>
        <span
          className={`${styles.Landing_textPrimary} ${styles.Landing_fontMedium} ${styles.Landing_textXs}`}
        >
          {row.title}
        </span>
        <span
          className={`${styles.Landing_textTertiary} ${styles.Landing_textXxs}`}
        >
          {row.timestamp}
        </span>
      </div>
    </div>
    <div className={styles.Landing_previewData}>
      <span
        className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
      >
        SHPR:{" "}
        <strong className={styles.Landing_textPrimary}>{row.shipper}</strong>
      </span>
      <span
        className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
      >
        CNSG:{" "}
        <strong className={styles.Landing_textPrimary}>{row.consignee}</strong>
      </span>
    </div>
    <div className={styles.Landing_previewStatus}>
      <span className={`${styles.Landing_previewBadge} ${styles.success}`}>
        Done
      </span>
    </div>
  </div>
);
