import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/services/supabase/server";
import { LandingPage } from "./LandingPage";

export default async function HomePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
