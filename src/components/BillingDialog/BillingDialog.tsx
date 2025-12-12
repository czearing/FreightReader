import { ExternalLink, X } from "lucide-react";

import styles from "./BillingDialog.module.css";
import type { BillingDialogProps } from "./BillingDialog.types";

export const BillingDialog = ({
  isOpen,
  onClose,
  user,
  stats,
}: BillingDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const usagePercent = Math.min(100, (stats.used / stats.limit) * 100);
  const isFree = user.plan.toLowerCase().includes("free");
  const price = isFree ? "$0/month" : "$49/month";
  const renewalDate = "Jan 11, 2026";
  const resetDate = "Jan 1, 2026";

  return (
    <div className={styles.BillingDialog_backdrop} aria-modal role="dialog">
      <div className={styles.BillingDialog_overlay} onClick={onClose} />

      <div className={styles.BillingDialog_modal}>
        <div className={styles.BillingDialog_header}>
          <h2 className={styles.BillingDialog_title}>Billing &amp; Plan</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.BillingDialog_closeBtn}
            title="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className={styles.BillingDialog_body}>
          <div className={styles.BillingDialog_section}>
            <div className={styles.BillingDialog_sectionHeader}>
              Current Plan
            </div>
            <div className={styles.BillingDialog_planDetails}>
              <div>
                You&apos;re on the <strong>{user.plan}</strong>.
              </div>
              <div>
                {price} • Renews {renewalDate}
              </div>
            </div>
            <button
              type="button"
              className={styles.BillingDialog_portalLink}
              onClick={() =>
                alert("Redirecting to LemonSqueezy Portal (demo placeholder).")
              }
            >
              Manage Billing Portal
              <ExternalLink
                size={12}
                className={styles.BillingDialog_iconInline}
                aria-hidden
              />
            </button>
          </div>

          <div className={styles.BillingDialog_section}>
            <div className={styles.BillingDialog_sectionHeader}>
              Usage Overview
            </div>

            <div className={styles.BillingDialog_usageText}>
              Documents processed: <strong>{stats.used}</strong> / {stats.limit}{" "}
              this month
            </div>

            <div className={styles.BillingDialog_progressBarBg}>
              <div
                className={styles.BillingDialog_progressBarFill}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <div className={styles.BillingDialog_resetText}>
              Next reset: {resetDate}
            </div>
          </div>

          <div className={styles.BillingDialog_section} style={{ marginTop: 8 }}>
            <div className={styles.BillingDialog_sectionHeader}>
              Upgrade or Change Plan
            </div>
            <button
              type="button"
              className={styles.BillingDialog_upgradeBtn}
              onClick={() => alert("Opening Upgrade Flow (demo placeholder).")}
            >
              {isFree ? "Upgrade to 5000 Docs / mo ($199)" : "Change Plan"}
            </button>
          </div>
        </div>

        <div className={styles.BillingDialog_footer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.BillingDialog_footerCloseBtn}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
