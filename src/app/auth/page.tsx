import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/services/supabase/server";
import { AuthClient } from "./AuthClient";

export default async function AuthPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <AuthClient />;
}
