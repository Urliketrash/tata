"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Fire-and-forget: don't block rendering
    const trackVisit = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer || "",
          }),
        });
      } catch {
        // Silently fail — visitor tracking should never break the site
      }
    };

    trackVisit();
  }, []);

  return null; // Invisible component
}
