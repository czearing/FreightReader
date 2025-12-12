"use client";

import { useState } from "react";

import { Button, Input, showToast } from "@/components";
import { getSupabaseBrowserClient } from "@/services/supabase/client";

const redirectPath = "/auth/callback";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      showToast({ title: "Enter an email", tone: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const emailRedirectTo = `${origin}${redirectPath}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });
      if (error) {
        throw error;
      }
      showToast({
        title: "Check your email",
        description: "Click the magic link we sent to sign in.",
        tone: "success",
      });
    } catch (error) {
      console.error("Magic link error", error);
      showToast({
        title: "Sign-in failed",
        description: "Unable to send magic link. Try again.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogle(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}${redirectPath}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google sign-in error", error);
      showToast({
        title: "Google sign-in failed",
        description: "Unable to start Google sign-in. Try again.",
        tone: "error",
      });
      setIsGoogle(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg-main)",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "24px",
          borderRadius: 12,
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border-default)",
          display: "grid",
          gap: "12px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
          }}
        >
          We’ll send a magic link to your email.
        </p>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" appearance="primary" isLoading={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send magic link"}
        </Button>
        <Button
          type="button"
          appearance="secondary"
          isLoading={isGoogle}
          onClick={handleGoogle}
        >
          {isGoogle ? "Redirecting…" : "Continue with Google"}
        </Button>
      </form>
    </div>
  );
}
