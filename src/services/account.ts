import { getSupabaseBrowserClient } from "@/services/supabase/client";
import type { UserProfile } from "@/types/user";

export const saveUserProfile = async (userId: string, profile: UserProfile) => {
  const supabase = getSupabaseBrowserClient();
  return supabase.from("user_profiles").upsert(
    {
      user_id: userId,
      name: profile.name,
      plan: profile.plan,
      avatar_url: profile.avatarUrl,
    },
    { onConflict: "user_id" },
  );
};
