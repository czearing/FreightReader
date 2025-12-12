"use client";

import { useState } from "react";

import { HistoryPanel, Navbar, UploadPanel } from "@/components";
import {
  type UserProfile,
  type UserSettings,
} from "@/types/freight";
import { useDocuments } from "./hooks/useDocuments";
import { useThemePreference } from "./hooks/useThemePreference";
import styles from "./page.module.css";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultExportFormat: "CSV",
  autoPin: false,
};

const INITIAL_USER: UserProfile = {
  name: "Alex Johnson",
  email: "alex@freightco.com",
  plan: "Pro Plan",
  avatarUrl: null,
};

export default function Page() {
  const planLimit = 50;
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }
    const saved = window.localStorage.getItem("user_settings");
    if (!saved) {
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(saved) as UserSettings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

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

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    console.warn("Profile updated (mock):", updatedUser);
  };

  return (
    <div className={styles.App_container}>
      <Navbar
        user={userProfile}
        stats={stats}
        settings={userSettings}
        updateSettings={handleUpdateSettings}
        onUpdateProfile={handleUpdateProfile}
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
          />
        </div>
      </main>
    </div>
  );
}
