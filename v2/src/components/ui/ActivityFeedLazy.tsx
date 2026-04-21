"use client";

import dynamic from "next/dynamic";

export const ActivityFeed = dynamic(
  () => import("./ActivityFeed").then((mod) => mod.ActivityFeed),
  { ssr: false }
);
