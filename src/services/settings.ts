import { getSupabaseBrowserClient } from "./supabase/client";
import type { UserSettings } from "@/types/freight";

export const saveUserSettings = async (
  userId: string,
  settings: UserSettings,
) => {
  const supabase = getSupabaseBrowserClient();
  return supabase
    .from("user_settings")
    .upsert(
      {
        user_id: userId,
        theme: settings.theme,
        default_export_format: settings.defaultExportFormat,
        auto_pin: settings.autoPin,
      },
      { onConflict: "user_id" },
    );
};
