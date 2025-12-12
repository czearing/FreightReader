import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/services/supabase/server";

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const serviceRoleKey = process.env.SUPABASE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: "Service role key is not configured." },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Delete related rows; rely on foreign keys/cascade if configured.
    await adminClient.from("user_settings").delete().eq("user_id", user.id);
    await adminClient.from("user_profiles").delete().eq("user_id", user.id);

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id
    );
    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to delete account.",
      },
      { status: 500 }
    );
  }
}
