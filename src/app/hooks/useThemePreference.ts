import { useEffect } from "react";

import type { ThemePreference } from "@/types/freight";

type ThemeMode = "light" | "dark";

const resolveTheme = (preference: ThemePreference): ThemeMode => {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
};

export const useThemePreference = (theme: ThemePreference) => {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (value: ThemeMode) => root.setAttribute("data-theme", value);

    const next = resolveTheme(theme);
    apply(next);

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) =>
      apply(event.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);
};
