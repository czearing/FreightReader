import type { UserProfile, UserStats } from "@/types/freight";

export interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: UserStats;
  onSave: (updatedUser: UserProfile) => void;
}
