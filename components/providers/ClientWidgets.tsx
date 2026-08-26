"use client";

// Groups the purely client-side interaction chrome (cursor, command palette,
// AI chat, recruiter view) behind next/dynamic with ssr disabled — none of
// it is needed for first paint or SEO, so it's kept out of the initial
// server-rendered HTML and main-thread JS.

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), { ssr: false });
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });
const RecruiterView = dynamic(() => import("@/components/RecruiterView"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <CustomCursor />
      <CommandPalette />
      <RecruiterView />
      <AIAssistant />
    </>
  );
}
