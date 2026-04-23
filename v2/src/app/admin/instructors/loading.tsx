import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton"

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Chargement des coachs…"
      rows={4}
      columns={5}
    />
  )
}
