import { useEffect, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import type { ExportFormat, ThemePreference } from "@/types/freight";
import styles from "./PreferencesDialog.module.css";
import type { PreferencesDialogProps } from "./PreferencesDialog.types";

export const PreferencesDialog = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: PreferencesDialogProps) => {
  const [formData, setFormData] = useState(currentSettings);

  useEffect(() => {
    if (isOpen) {
      setFormData(currentSettings);
    }
  }, [currentSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleSave();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className={styles.PreferencesDialog_backdrop}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      aria-modal
      role="dialog"
    >
      <div className={styles.PreferencesDialog_overlay} onClick={onClose} />

      <div className={styles.PreferencesDialog_modal}>
        <div className={styles.PreferencesDialog_header}>
          <h2 className={styles.PreferencesDialog_title}>Preferences</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.PreferencesDialog_closeBtn}
            title="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className={styles.PreferencesDialog_body}>
          <div className={styles.PreferencesDialog_section}>
            <label htmlFor="theme" className={styles.PreferencesDialog_label}>
              Theme
            </label>
            <select
              id="theme"
              value={formData.theme}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  theme: event.target.value as ThemePreference,
                })
              }
              className={styles.PreferencesDialog_select}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className={styles.PreferencesDialog_section}>
            <label
              htmlFor="exportFormat"
              className={styles.PreferencesDialog_label}
            >
              Default Export Format
            </label>
            <select
              id="exportFormat"
              value={formData.defaultExportFormat}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  defaultExportFormat: event.target.value as ExportFormat,
                })
              }
              className={styles.PreferencesDialog_select}
            >
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
              <option value="QBOOKS">QuickBooks IIF</option>
            </select>
          </div>

          <div className={styles.PreferencesDialog_toggleRow}>
            <div>
              <div className={styles.PreferencesDialog_toggleLabel}>
                Auto-Pin parsed documents
              </div>
              <div className={styles.PreferencesDialog_toggleDesc}>
                Automatically pin documents after successful extraction.
              </div>
            </div>
            <label className={styles.PreferencesDialog_switch}>
              <input
                type="checkbox"
                checked={formData.autoPin}
                onChange={(event) =>
                  setFormData({ ...formData, autoPin: event.target.checked })
                }
                className={styles.PreferencesDialog_switchInput}
              />
              <span className={styles.PreferencesDialog_slider} />
            </label>
          </div>
        </div>

        <div className={styles.PreferencesDialog_footer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.PreferencesDialog_cancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.PreferencesDialog_saveBtn}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
