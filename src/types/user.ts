import type { ExportFormat } from "./documents";

export interface UserStats {
  used: number;
  limit: number;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatarUrl: string | null;
}

export interface UserProfileRecord {
  user_id: string;
  name: string;
  plan: string;
  avatar_url: string | null;
}

export type ThemePreference = "light" | "dark" | "system";

export interface UserSettings {
  theme: ThemePreference;
  defaultExportFormat: ExportFormat;
  autoPin: boolean;
}

export interface UserSettingsRecord {
  user_id: string;
  theme: ThemePreference;
  default_export_format: ExportFormat;
  auto_pin: boolean;
}
