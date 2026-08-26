"use client";

import { useSyncExternalStore, useCallback } from "react";

const VIEW_MODE_KEY = "viewMode";

// sessionStorage has no same-tab change event (the native "storage" event
// only fires in *other* tabs), so a manual pub-sub notifies this tab's own
// subscribers after a local write — mirrors useReducedMotion/useIsTouchDevice's
// useSyncExternalStore pattern, just with a hand-rolled source instead of a
// MediaQueryList.
let listeners: (() => void)[] = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  try {
    return sessionStorage.getItem(VIEW_MODE_KEY) === "recruiter";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function setRecruiterViewMode(recruiter: boolean) {
  try {
    sessionStorage.setItem(VIEW_MODE_KEY, recruiter ? "recruiter" : "portfolio");
  } catch {
    // Best-effort persistence only (e.g. private browsing) — switching
    // still works for the rest of this tab's life via the listener below.
  }
  listeners.forEach((l) => l());
}

// true = Recruiter View is active. Defaults to the cinematic portfolio on
// the server and on first client render (matching SSR output, so there's
// no hydration mismatch), then reflects sessionStorage immediately after.
export function useRecruiterViewMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSetRecruiterViewMode(): (v: boolean) => void {
  return useCallback((v: boolean) => setRecruiterViewMode(v), []);
}
