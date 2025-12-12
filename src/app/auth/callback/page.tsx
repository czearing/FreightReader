"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { showToast } from "@/components";
import { getSupabaseBrowserClient } from "@/services/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "done" | "error">("pending");

  useEffect(() => {
    const exchange = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Auth session error", sessionError);
        }
        if (data.session) {
          setStatus("done");
          showToast({
            title: "Signed in",
            description: "You’re now signed in.",
            tone: "success",
          });
          router.replace("/");
          return;
        }

        const errorDescription = searchParams.get("error_description");
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // Handle OAuth tokens returned in the URL hash (e.g., Google)
        if (typeof window !== "undefined") {
          const hashParams = new URLSearchParams(
            window.location.hash.replace(/^#/, ""),
          );
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const hashError = hashParams.get("error_description");
          const hashCode = hashParams.get("code");

          if (hashError) {
            throw new Error(hashError);
          }

          if (accessToken && refreshToken) {
            const { error: setError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setError) {
              throw setError;
            }
            setStatus("done");
            showToast({
              title: "Signed in",
              description: "You’re now signed in.",
              tone: "success",
            });
            return;
          } else if (hashCode) {
            const { error } = await supabase.auth.exchangeCodeForSession(
              hashCode,
            );
            if (error) {
              throw error;
            }
            setStatus("done");
            showToast({
              title: "Signed in",
              description: "You’re now signed in.",
              tone: "success",
            });
            router.replace("/");
            return;
          }
        }

        const code = searchParams.get("code");
        if (!code) {
          throw new Error("No auth code found in the callback URL.");
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          throw error;
        }
        setStatus("done");
        showToast({
          title: "Signed in",
          description: "You’re now signed in.",
          tone: "success",
        });
        router.replace("/");
      } catch (error) {
        console.error("Auth callback error", error);
        setStatus("error");
        showToast({
          title: "Sign-in failed",
          description:
            error instanceof Error
              ? error.message
              : "We couldn’t complete your sign-in.",
          tone: "error",
        });
      }
    };

    void exchange();
  }, [router, searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg-main)",
        color: "var(--text-primary)",
        padding: 24,
      }}
    >
      <div
        style={{
          padding: "24px",
          borderRadius: 12,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
          maxWidth: 360,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>
          {status === "pending"
            ? "Completing sign-in…"
            : status === "done"
              ? "Signed in! You can close this window."
              : "We couldn’t complete sign-in."}
        </p>
      </div>
    </div>
  );
}
