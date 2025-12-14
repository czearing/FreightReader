import type { UserProfile, UserStats } from "@/types/user";

export interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: UserStats;
  onSave: (updatedUser: UserProfile) => Promise<void>;
  onDelete: () => Promise<void>;
}
