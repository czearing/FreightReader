import type { UserProfile, UserSettings, UserStats } from "@/types/user";

export interface NavbarProps {
  user: UserProfile;
  stats: UserStats;
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  onUpdateProfile: (user: UserProfile) => void;
  onDeleteAccount: () => void;
  onSignOut: () => void;
}
