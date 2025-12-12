"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { UserSettings } from "@/types/freight";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultExportFormat: "CSV",
  autoPin: false,
};

interface SettingsContextValue {
  settings: UserSettings;
  updateSettings: (next: UserSettings) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

const storageKey = "user_settings";

const loadSettings = (): UserSettings => {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(saved) as UserSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (next: UserSettings) => setSettings(next);

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
