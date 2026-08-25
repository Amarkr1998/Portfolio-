"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type UIState = {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  toggleCommandPalette: () => void;
  aiChatOpen: boolean;
  setAiChatOpen: (v: boolean) => void;
};

const UIStateContext = createContext<UIState | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

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
