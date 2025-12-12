export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/services/supabase/server";
import { DashboardClient } from "./DashboardClient";

export default async function Page() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const meta = session.user.user_metadata ?? {};
  const user = {
    name:
      (meta.full_name as string | undefined) ??
      session.user.email ??
      "User",
    email: session.user.email ?? "",
    plan: "Free Plan",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
  };

  return <DashboardClient user={user} />;
}
