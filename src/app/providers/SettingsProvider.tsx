"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { showToast } from "@/components";
import { saveUserSettings } from "@/services/settings";
import type { UserSettings } from "@/types/freight";

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultExportFormat: "CSV",
  autoPin: false,
};

interface SettingsContextValue {
  settings: UserSettings;
  updateSettings: (next: UserSettings) => void;
}

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: UserSettings;
  userId?: string;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

const storageKey = "user_settings";

const loadSettings = (fallback?: UserSettings): UserSettings => {
  if (typeof window === "undefined") {
    return fallback ?? DEFAULT_SETTINGS;
  }
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return fallback ?? DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(saved) as UserSettings;
  } catch {
    return fallback ?? DEFAULT_SETTINGS;
  }
};

const persistSettings = async (userId: string, next: UserSettings) => {
  try {
    const { error } = await saveUserSettings(userId, next);
    if (error) {
      console.error("Save settings error", error);
      showToast({
        title: "Settings not saved",
        description: error.message ?? "We couldn’t save your preferences.",
        tone: "error",
      });
      return;
    }
    showToast({
      title: "Settings saved",
      description: "Your preferences are up to date.",
      tone: "success",
    });
  } catch (err) {
    console.error("Save settings error", err);
    showToast({
      title: "Settings not saved",
      description:
        err instanceof Error
          ? err.message
          : "We couldn’t save your preferences. Try again.",
      tone: "error",
    });
  }
};

export function SettingsProvider({
  children,
  initialSettings,
  userId,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadSettings(initialSettings),
  );
  const hasSyncedRemote = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  // Clear any pending save on unmount.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // On first client render, if we have user + server settings and local differs,
  // push the local state to Supabase to keep devices in sync.
  useEffect(() => {
    if (hasSyncedRemote.current || !userId || !initialSettings) return;
    const isDifferent =
      settings.theme !== initialSettings.theme ||
      settings.defaultExportFormat !== initialSettings.defaultExportFormat ||
      settings.autoPin !== initialSettings.autoPin;
    if (!isDifferent) {
      hasSyncedRemote.current = true;
      return;
    }
    hasSyncedRemote.current = true;
    void persistSettings(userId, settings);
  }, [initialSettings, settings, userId]);

  const updateSettings = (next: UserSettings) => {
    if (
      next.theme === settings.theme &&
      next.defaultExportFormat === settings.defaultExportFormat &&
      next.autoPin === settings.autoPin
    ) {
      return;
    }
    setSettings(next);
    if (!userId) {
      return;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      void persistSettings(userId, next);
    }, 400);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
