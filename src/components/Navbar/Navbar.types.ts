import type { UserProfile, UserSettings, UserStats } from "@/types/freight";

export interface NavbarProps {
  user: UserProfile;
  stats: UserStats;
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  onUpdateProfile: (user: UserProfile) => void;
  onSignOut: () => void;
}
