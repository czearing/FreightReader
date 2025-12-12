"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { HistoryPanel, Navbar, UploadPanel, Button } from "@/components";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { type UserProfile, type UserSettings } from "@/types/freight";
import { useDocuments } from "./hooks/useDocuments";
import { useThemePreference } from "./hooks/useThemePreference";
import styles from "./page.module.css";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultExportFormat: "CSV",
  autoPin: false,
};

export default function Page() {
  const planLimit = 50;
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to load session", error);
      }
      setSession(data.session ?? null);
      setSessionLoaded(true);
      if (data.session?.user) {
        setUserProfile((prev) => ({
          name:
            prev?.name ??
            (data.session?.user.user_metadata.full_name ??
              data.session?.user.email ??
              "User"),
          email: data.session.user.email ?? "",
          plan: "Free Plan",
          avatarUrl: null,
        }));
      }
    };

    void loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user) {
          setUserProfile({
            name:
              nextSession.user.user_metadata.full_name ??
              nextSession.user.email ??
              "User",
            email: nextSession.user.email ?? "",
            plan: "Free Plan",
            avatarUrl: null,
          });
        } else {
          setUserProfile(null);
        }
      },
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

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

  if (!sessionLoaded) {
    return null;
  }

  if (!session || !userProfile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg-main)",
          color: "var(--text-primary)",
          padding: 24,
        }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 12,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-md)",
            textAlign: "center",
            maxWidth: 380,
          }}
        >
          <h2 style={{ margin: "0 0 8px 0" }}>Welcome</h2>
          <p style={{ margin: "0 0 16px 0", color: "var(--text-secondary)" }}>
            Sign in to access your dashboard.
          </p>
          <Button
            appearance="primary"
            onClick={() => {
              window.location.href = "/auth";
            }}
          >
            Go to sign-in
          </Button>
        </div>
      </div>
    );
  }

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
            defaultExportFormat={userSettings.defaultExportFormat}
          />
        </div>
      </main>
    </div>
  );
}
