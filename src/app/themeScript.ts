export const themeInitScript = `
(() => {
  const storageKey = "user_settings";
  const defaultTheme = "system";
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : null;
    const pref = parsed?.theme ?? defaultTheme;
    const resolve = (value) => {
      if (value === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return value;
    };
    const theme = resolve(pref);
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
