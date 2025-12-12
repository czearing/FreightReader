"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/services/supabase/client";
import type { UserProfile } from "@/types/freight";

interface UseSupabaseSessionResult {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
}

export function useSupabaseSession(): UseSupabaseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const mapUser = (sess: Session | null): UserProfile | null => {
      if (!sess?.user) {
        return null;
      }
      const meta = sess.user.user_metadata ?? {};
      return {
        name: (meta.full_name as string | undefined) ?? sess.user.email ?? "User",
        email: sess.user.email ?? "",
        plan: "Free Plan",
        avatarUrl: (meta.avatar_url as string | undefined) ?? null,
      };
    };

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth session error", error);
      }
      setSession(data.session ?? null);
      setUser(mapUser(data.session ?? null));
      setLoading(false);
    };

    void init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(mapUser(nextSession));
      },
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
