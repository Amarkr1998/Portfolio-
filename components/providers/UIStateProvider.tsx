"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRecruiterViewMode, useSetRecruiterViewMode } from "@/hooks/useViewMode";

type UIState = {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  toggleCommandPalette: () => void;
  aiChatOpen: boolean;
  setAiChatOpen: (v: boolean) => void;
  // true = Recruiter View (a fast, information-first page mode) replaces
  // the default cinematic portfolio. Persisted to sessionStorage (see
  // hooks/useViewMode) so it survives a reload within the same tab session.
  recruiterViewOpen: boolean;
  setRecruiterViewOpen: (v: boolean) => void;
};

const UIStateContext = createContext<UIState | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const recruiterViewOpen = useRecruiterViewMode();
  const setRecruiterViewOpen = useSetRecruiterViewMode();

  const toggleCommandPalette = useCallback(() => {
    setCommandPaletteOpen((v) => !v);
  }, []);

  return (
    <UIStateContext.Provider
      value={{
        commandPaletteOpen,
        setCommandPaletteOpen,
        toggleCommandPalette,
        aiChatOpen,
        setAiChatOpen,
        recruiterViewOpen,
        setRecruiterViewOpen,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within UIStateProvider");
  return ctx;
}
