"use client";

import { HistoryPanel, Navbar, UploadPanel } from "@/components";
import type { UserProfile } from "@/types/freight";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { useDocuments } from "./hooks/useDocuments";
import { useThemePreference } from "./hooks/useThemePreference";
import styles from "./page.module.css";
import { useSettings } from "./providers/SettingsProvider";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  user: UserProfile;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const planLimit = 50;
  const router = useRouter();
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

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/auth");
    router.refresh();
  };

  return (
    <div className={styles.App_container}>
      <Navbar
        user={user}
        stats={stats}
        settings={userSettings}
        updateSettings={setUserSettings}
        onUpdateProfile={() => {}}
        onSignOut={handleSignOut}
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
