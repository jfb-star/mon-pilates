"use client";

import dynamic from "next/dynamic";

// Lazy-loaded: heavy interactive quiz rendered far below the fold on the home page.
// ssr:false keeps the JS out of the initial hydration payload; the skeleton preserves height to avoid CLS.
export const CourseQuiz = dynamic(
  () => import("./CourseQuiz").then((mod) => mod.CourseQuiz),
  {
    ssr: false,
    loading: () => <div className="min-h-[360px]" aria-hidden="true" />,
  }
);
