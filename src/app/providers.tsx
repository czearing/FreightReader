"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "./providers/AuthProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import { queryClient } from "../clients/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>{children}</AuthProvider>
      </SettingsProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ duration: 4500 }}
      />
    </QueryClientProvider>
  );
}
