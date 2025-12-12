import { createBrowserClient } from "@supabase/ssr";

type SupabaseBrowser = ReturnType<typeof createBrowserClient<unknown>>;

let supabaseBrowserClient: SupabaseBrowser | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for browser auth.",
    );
  }

  supabaseBrowserClient ??= createBrowserClient<unknown>(
    supabaseUrl,
    supabaseAnonKey,
  );

  return supabaseBrowserClient;
}
