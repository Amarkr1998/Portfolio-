"use client";

// Groups the purely client-side interaction chrome (cursor, command palette,
// AI chat) behind next/dynamic with ssr disabled — none of it is needed for
// first paint or SEO, so it's kept out of the initial server-rendered HTML
// and main-thread JS. Recruiter View itself is rendered by PortfolioShell,
// conditionally in place of the cinematic section stack — not here — since
// it's a full page-mode swap, not an overlay widget.

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), { ssr: false });
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <CustomCursor />
      <CommandPalette />
      <AIAssistant />
    </>
  );
}
