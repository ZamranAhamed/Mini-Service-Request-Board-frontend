"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

const themeKey = "theme";
const themeChangeEvent = "themechange";

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeKey);
  } catch {
    return null;
  }
};

const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = getStoredTheme();

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = theme === "dark";
  const root = document.documentElement;

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = isDark ? "dark" : "light";
};

const subscribeToThemeChanges = (callback) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);
  mediaQuery.addEventListener("change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
    mediaQuery.removeEventListener("change", callback);
  };
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getPreferredTheme,
    () => "light"
  );

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    localStorage.setItem(themeKey, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
    >
      {isDark ? "Day Mode" : "Night Mode"}
    </button>
  );
}
