import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton"

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Chargement des types de cours…"
      rows={5}
      columns={7}
    />
  )
}
