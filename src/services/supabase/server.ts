import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SupabaseServer = ReturnType<typeof createServerClient<unknown>>;

let supabaseServerClient: SupabaseServer | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them to your env to enable Supabase.",
    );
  }

  const cookieStore = cookies();

  supabaseServerClient ??= createServerClient<unknown>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set(name, value, options) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });

  return supabaseServerClient;
}
