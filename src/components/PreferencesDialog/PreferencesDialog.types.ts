import type {
  ExportFormat,
  ThemePreference,
  UserSettings,
} from "@/types/freight";

export interface PreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export type ThemeOption = ThemePreference;

export type ExportOption = ExportFormat;
