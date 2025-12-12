import { useEffect, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import styles from "./AccountDialog.module.css";
import type { AccountDialogProps } from "./AccountDialog.types";

export const AccountDialog = ({
  isOpen,
  onClose,
  user,
  stats,
  onSave,
  onDelete,
}: AccountDialogProps) => {
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
    }
  }, [isOpen, user.name]);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave({ ...user, name });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleSave();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  const usagePercent = Math.min(100, (stats.used / stats.limit) * 100);

  return (
    <div
      className={styles.AccountDialog_backdrop}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      aria-modal
      role="dialog"
    >
      <div className={styles.AccountDialog_overlay} onClick={onClose} />

      <div className={styles.AccountDialog_modal}>
        <div className={styles.AccountDialog_header}>
          <h2 className={styles.AccountDialog_title}>Account Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.AccountDialog_closeBtn}
            title="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className={styles.AccountDialog_body}>
          <div className={styles.AccountDialog_section}>
            <div className={styles.AccountDialog_sectionHeader}>Profile</div>
            <div>
              <label className={styles.AccountDialog_label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={styles.AccountDialog_input}
              />
            </div>
            <div>
              <label className={styles.AccountDialog_label}>Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className={`${styles.AccountDialog_input} ${styles.AccountDialog_inputDisabled}`}
                title="Email cannot be changed in this demo"
              />
            </div>
          </div>

          <div className={styles.AccountDialog_section}>
            <div className={styles.AccountDialog_sectionHeader}>
              Plan &amp; Usage
            </div>

            <div className={styles.AccountDialog_infoRow}>
              <span className={styles.AccountDialog_planName}>{user.plan}</span>
              <span className={styles.AccountDialog_manageLink}>
                Manage Plan →
              </span>
            </div>

            <div className={styles.AccountDialog_usageText}>
              Documents Used: <strong>{stats.used}</strong> / {stats.limit} this
              month
            </div>

            <div className={styles.AccountDialog_progressBarBg}>
              <div
                className={styles.AccountDialog_progressBarFill}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          <div className={styles.AccountDialog_dangerZone}>
            <div
              className={styles.AccountDialog_sectionHeader}
              style={{ color: "var(--status-error-text)" }}
            >
              Danger Zone
            </div>
            <button
              type="button"
              className={styles.AccountDialog_deleteBtn}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete My Account"}
            </button>
          </div>
        </div>

        <div className={styles.AccountDialog_footer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.AccountDialog_cancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.AccountDialog_saveBtn}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
