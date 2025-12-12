"use client";

import { HistoryPanel, Navbar, UploadPanel } from "@/components";
import { useAuthGuard } from "./hooks/useAuthGuard";
import { useDocuments } from "./hooks/useDocuments";
import { useThemePreference } from "./hooks/useThemePreference";
import styles from "./page.module.css";
import { useSettings } from "./providers/SettingsProvider";

export default function Page() {
  const planLimit = 50;
  const { session, user: userProfile } = useAuthGuard();
  const { settings: userSettings, updateSettings: setUserSettings } =
    useSettings();

  useThemePreference(userSettings.theme);

  const {
    documents,
    stats,
    processingCount,
    canUpload,
    upload,
    remove,
    refresh,
    download,
    downloadAll,
  } = useDocuments(planLimit, userSettings.autoPin);

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user_settings", JSON.stringify(newSettings));
    }
    console.warn("Settings saved (mock):", newSettings);
  };

  if (!session || !userProfile) {
    return null;
  }

  return (
    <div className={styles.App_container}>
      <Navbar
        user={userProfile}
        stats={stats}
        settings={userSettings}
        updateSettings={handleUpdateSettings}
        onUpdateProfile={() => {}}
      />

      <main className={styles.App_main}>
        <div className={styles.App_leftColumn}>
          <UploadPanel
            onUpload={upload}
            isProcessing={processingCount > 0}
            canUpload={canUpload}
          />
        </div>

        <div className={styles.App_rightColumn}>
          <HistoryPanel
            documents={documents}
            onRefresh={refresh}
            onDelete={remove}
            onDownload={download}
            onDownloadAll={downloadAll}
            defaultExportFormat={userSettings.defaultExportFormat}
          />
        </div>
      </main>
    </div>
  );
}
