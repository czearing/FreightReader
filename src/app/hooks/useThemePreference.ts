import { useEffect } from "react";

import type { ThemePreference } from "@/types/freight";

type ThemeMode = "light" | "dark";

export const useThemePreference = (theme: ThemePreference) => {
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (value: ThemeMode) => {
      root.setAttribute("data-theme", value);
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const listener = (event: MediaQueryListEvent) => {
        applyTheme(event.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    applyTheme(theme);
  }, [theme]);
};
