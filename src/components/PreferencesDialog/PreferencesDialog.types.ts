import type { ExportFormat } from "@/types/documents";
import type { ThemePreference, UserSettings } from "@/types/user";

export interface PreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export type ThemeOption = ThemePreference;

export type ExportOption = ExportFormat;
