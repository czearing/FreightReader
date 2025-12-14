import type { UserProfile, UserStats } from "@/types/user";

export interface BillingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: UserStats;
}
