import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton"

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Chargement des templates…"
      rows={5}
      columns={5}
    />
  )
}
