export const dynamic = "force-dynamic";

import { getSupabaseServerClient } from "@/services/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { LandingPage } from "./LandingPage";

export default async function Page() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return <LandingPage />;
  }

  const meta = user.user_metadata ?? {};
  const appUser = {
    name:
      (meta.full_name as string | undefined) ?? user.email ?? "User",
    email: user.email ?? "",
    plan: "Free Plan",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
  };

  return <DashboardClient user={appUser} />;
}
