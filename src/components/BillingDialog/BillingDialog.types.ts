import type { UserProfile, UserStats } from "@/types/freight";

export interface BillingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: UserStats;
}
