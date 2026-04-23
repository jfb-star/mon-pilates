import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton"

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Chargement de l'administration…"
      rows={6}
      columns={6}
      withStats
    />
  )
}
