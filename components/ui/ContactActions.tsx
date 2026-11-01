"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useEmailHref } from "@/hooks/useEmailHref";
import { socials } from "@/data/portfolio";

// Email link that picks mailto: on touch devices and Gmail compose on
// desktop (see hooks/useEmailHref for why).
export function EmailLink({ className, children }: { className?: string; children: ReactNode }) {
  const emailHref = useEmailHref();
  return (
    <a {...emailHref} className={className}>
      {children}
    </a>
  );
}

export function CopyEmailButton({ className = "btn btn-secondary" }: { className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(socials.emailAddress);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  }

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {state === "copied" ? (
          <Check size={16} aria-hidden="true" className="text-teal" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email address copied to clipboard."
          : state === "failed"
            ? `Copy failed. The address is ${socials.emailAddress}.`
            : ""}
      </span>
    </>
  );
}

const noopSubscribe = () => () => {};

// Hydrates with the server's (build-time) year, then shows the visitor's
// current year — so a static build never displays a stale year.
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => buildYear);
  return <>{year}</>;
}
