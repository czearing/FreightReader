import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseBrowser = SupabaseClient;

let supabaseBrowserClient: SupabaseBrowser | null = null;

export function getSupabaseBrowserClient(): SupabaseBrowser {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for browser auth.",
    );
  }

  supabaseBrowserClient ??= createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );

  return supabaseBrowserClient;
}
