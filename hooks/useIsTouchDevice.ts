"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const coarse = window.matchMedia("(pointer: coarse)");
  const noHover = window.matchMedia("(hover: none)");
  coarse.addEventListener("change", callback);
  noHover.addEventListener("change", callback);
  return () => {
    coarse.removeEventListener("change", callback);
    noHover.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function getServerSnapshot() {
  return true;
}

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
