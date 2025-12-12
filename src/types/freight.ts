export type DocumentStatus = "PROCESSING" | "DONE" | "FAILED";

export interface ExtractedData {
  shipper: string;
  consignee: string;
  date: string;
  proNumber: string;
  totalWeight: string;
}

export interface FreightDocument {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: DocumentStatus;
  data?: ExtractedData;
  failureReason?: string;
  previewUrl?: string;
  pinned?: boolean;
}

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

export type ExportFormat = "CSV" | "JSON" | "QBOOKS";

export type ThemePreference = "light" | "dark" | "system";

export interface UserSettings {
  theme: ThemePreference;
  defaultExportFormat: ExportFormat;
  autoPin: boolean;
}
