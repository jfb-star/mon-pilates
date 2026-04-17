import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { calculateLoyalty } from "@/lib/loyalty"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 })
  }

  try {
    const loyalty = await calculateLoyalty(session.user.id)
    return NextResponse.json(loyalty)
  } catch (err) {
    console.error("[loyalty] Error calculating loyalty:", err)
    return NextResponse.json(
      { error: "Erreur lors du calcul de la fid\u00e9lit\u00e9" },
      { status: 500 }
    )
  }
}
