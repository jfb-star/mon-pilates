import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton"

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Chargement des campagnes…"
      rows={5}
      columns={7}
    />
  )
}
