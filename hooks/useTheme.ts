"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  window.localStorage.setItem("theme", theme);
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getServerSnapshot(): Theme {
  return "dark";
}

// Reactive theme state shared across every component that calls this hook —
// backed by a MutationObserver on <html data-theme>, not a separate copy of
// state, so a toggle anywhere (e.g. the navbar button) is reflected
// everywhere (e.g. the hero's dark-only 3D scene) without a context provider.
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, toggleTheme };
}
