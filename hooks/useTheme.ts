"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

// Runs inline in <head> before first paint (see app/layout.tsx): a stored
// manual choice wins, otherwise the system preference — and while no manual
// choice exists, later system changes are followed live.
export const themeInitScript = `(function(){try{var d=document.documentElement,k='${THEME_STORAGE_KEY}',m=window.matchMedia('(prefers-color-scheme: light)'),s=localStorage.getItem(k);d.setAttribute('data-theme',s==='light'||s==='dark'?s:(m.matches?'light':'dark'));m.addEventListener('change',function(e){try{if(!localStorage.getItem(k))d.setAttribute('data-theme',e.matches?'light':'dark')}catch(_){}})}catch(e){}})();`;

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the switch still applies.
  }
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getServerSnapshot(): Theme {
  return "dark";
}

// Reactive theme state backed by a MutationObserver on <html data-theme>,
// so a toggle anywhere is reflected everywhere without a context provider.
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(() => applyTheme(readTheme() === "dark" ? "light" : "dark"), []);

  return { theme, setTheme, toggleTheme };
}
