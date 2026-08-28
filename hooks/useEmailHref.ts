"use client";

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { socials } from "@/data/portfolio";

// Two different problems on two different platforms: on desktop, mailto:
// depends on a registered mail client that's commonly unconfigured, so
// clicking does nothing — Gmail's own compose URL fixes that. On mobile,
// that same compose URL doesn't reliably hand off to the Gmail app the way
// mailto: does, breaking what already worked there. So: mailto: on touch
// devices, Gmail's compose URL everywhere else.
export function useEmailHref(): { href: string; target?: "_blank"; rel?: "noopener noreferrer" } {
  const isTouch = useIsTouchDevice();
  return isTouch
    ? { href: socials.email }
    : { href: socials.emailCompose, target: "_blank", rel: "noopener noreferrer" };
}
