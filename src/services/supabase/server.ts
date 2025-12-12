import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type SupabaseServerClient = SupabaseClient;

export async function getSupabaseServerClient(): Promise<SupabaseServerClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLIC_KEY for server auth."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // noop in read-only context
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({
            name,
            value: "",
            expires: new Date(0),
            ...options,
          });
        } catch {
          // noop in read-only context
        }
      },
    },
  });
}
