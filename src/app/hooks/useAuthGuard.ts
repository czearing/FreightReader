"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../providers/AuthProvider";

export const useAuthGuard = (redirectPath = "/auth") => {
  const router = useRouter();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace(redirectPath);
    }
  }, [loading, session, router, redirectPath]);

  return { session, user, loading };
};
