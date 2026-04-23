"use client";

import dynamic from "next/dynamic";

// Lazy-loaded: below-the-fold mood-based booking UI on the home page.
// ssr:false keeps the bundle out of the critical path; skeleton preserves height to avoid CLS.
export const MoodBooking = dynamic(
  () => import("./MoodBooking").then((mod) => mod.MoodBooking),
  {
    ssr: false,
    loading: () => <div className="min-h-[320px]" aria-hidden="true" />,
  }
);
