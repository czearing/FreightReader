import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/services/supabase/server";
import type {
  ThemePreference,
  UserProfileRecord,
  UserSettings,
  UserSettingsRecord,
} from "@/types/user";
import { DashboardClient } from "./DashboardClient";
import {
  DEFAULT_SETTINGS,
  SettingsProvider,
} from "../providers/SettingsProvider";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  const { data: settingsRow } = await supabase
    .from("user_settings")
    .select("theme, default_export_format, auto_pin")
    .eq("user_id", user.id)
    .maybeSingle<UserSettingsRecord>();

  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("name, plan, avatar_url")
    .eq("user_id", user.id)
    .maybeSingle<UserProfileRecord>();

  const meta = user.user_metadata ?? {};
  const appUser = {
    name:
      profileRow?.name ??
      (meta.full_name as string | undefined) ??
      user.email ??
      "User",
    email: user.email ?? "",
    plan: profileRow?.plan ?? "Free Plan",
    avatarUrl:
      profileRow?.avatar_url ??
      (meta.avatar_url as string | undefined) ??
      null,
  };

  const userSettings: UserSettings = settingsRow
    ? {
        theme: settingsRow.theme,
        defaultExportFormat: settingsRow.default_export_format,
        autoPin: settingsRow.auto_pin,
      }
    : DEFAULT_SETTINGS;

  return (
    <SettingsProvider initialSettings={userSettings} userId={user.id}>
      <DashboardClient user={appUser} />
    </SettingsProvider>
  );
}
