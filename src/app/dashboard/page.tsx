import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/services/supabase/server";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  const meta = user.user_metadata ?? {};
  const appUser = {
    name: (meta.full_name as string | undefined) ?? user.email ?? "User",
    email: user.email ?? "",
    plan: "Free Plan",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
  };

  return <DashboardClient user={appUser} />;
}
