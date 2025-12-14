"use client";

import { useState } from "react";

import { HistoryPanel, Navbar, UploadPanel, showToast } from "@/components";
import type { UserProfile } from "@/types/user";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { saveUserProfile } from "@/services/account";
import { useRouter } from "next/navigation";
import { useDocuments } from "../hooks/useDocuments";
import { useThemePreference } from "../hooks/useThemePreference";
import styles from "./page.module.css";
import { useSettings } from "../providers/SettingsProvider";

interface DashboardClientProps {
  user: UserProfile;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const planLimit = 50;
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(user);
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
    update,
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

  const handleProfileSave = async (updated: UserProfile) => {
    setProfile(updated);
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();
      if (!sessionUser) {
        throw new Error("Not authenticated.");
      }
      const { error } = await saveUserProfile(sessionUser.id, updated);
      if (error) {
        throw error;
      }
      showToast({
        title: "Account updated",
        description: "Your profile was saved.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Unable to save account.",
        tone: "error",
      });
      // revert local state on failure
      setProfile(user);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error || "Unable to delete account.");
      }
      showToast({
        title: "Account deleted",
        description: "Your account has been removed.",
        tone: "success",
      });
      router.replace("/auth");
      router.refresh();
    } catch (error) {
      showToast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Unable to delete account.",
        tone: "error",
      });
    }
  };

  return (
    <div className={styles.App_container}>
      <Navbar
        user={profile}
        stats={stats}
        settings={userSettings}
        updateSettings={setUserSettings}
        onUpdateProfile={handleProfileSave}
        onDeleteAccount={handleDeleteAccount}
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
            onUpdate={update}
            onDownload={download}
            onDownloadAll={downloadAll}
            defaultExportFormat={userSettings.defaultExportFormat}
          />
        </div>
      </main>
    </div>
  );
}
