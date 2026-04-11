import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planning des cours",
  description:
    "Consultez le planning hebdomadaire de Mon Pilates. Filtrez par type de cours, instructrice ou niveau et réservez en ligne.",
};

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
