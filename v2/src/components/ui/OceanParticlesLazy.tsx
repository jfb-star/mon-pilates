"use client";

import dynamic from "next/dynamic";

export const OceanParticles = dynamic(
  () => import("./OceanParticles").then((mod) => mod.OceanParticles),
  { ssr: false }
);
