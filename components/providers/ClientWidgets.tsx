"use client";

// Groups the purely client-side interaction chrome (command palette, AI
// chat) behind next/dynamic with ssr disabled — none of it is needed for
// first paint or SEO, so it stays out of the server HTML and loads after
// the page's essential content.

import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), { ssr: false });
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <CommandPalette />
      <AIAssistant />
    </>
  );
}
