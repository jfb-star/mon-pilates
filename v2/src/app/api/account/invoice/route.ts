import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"

function getPaymentDescription(type: string, metadata?: string | null): string {
  const meta = metadata ? (() => { try { return JSON.parse(metadata) } catch { return {} } })() : {}
  switch (type) {
    case "TRIAL":
      return "Cours d\u2019essai Pilates"
    case "BOOKING":
      return "S\u00e9ance de Pilates \u00e0 l\u2019unit\u00e9"
    case "COURSE_CARD":
      return `Carte de ${meta.sessions ?? ""} cours`.trim()
    case "SUBSCRIPTION":
      return "Abonnement mensuel illimit\u00e9"
    case "GIFT_CARD":
      return "Carte cadeau"
    default:
      return type
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get("paymentId")

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId requis" }, { status: 400 })
  }

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId: session.user.id, status: "COMPLETED" },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  const invoiceNumber = `MP-${paymentId.slice(0, 8).toUpperCase()}`
  const dateStr = new Date(payment.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const description = getPaymentDescription(payment.type, payment.metadata)
  const totalEur = (payment.amount / 100).toFixed(2)

  // Build PDF
  const doc = new jsPDF()

  // --- Header ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(60, 60, 60)
  doc.text("Mon Pilates", 20, 25)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text("Studio de Pilates", 20, 32)
  doc.text("14 Boulevard des Dunes, 56260 Larmor-Plage", 20, 37)
  doc.text("contact@mon-pilates.bzh", 20, 42)

  // --- Invoice title ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("FACTURE", 140, 25)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`N\u00b0 ${invoiceNumber}`, 140, 32)
  doc.text(`Date : ${dateStr}`, 140, 38)

  // --- Separator ---
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 50, 190, 50)

  // --- Client info ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text("Client", 20, 60)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(payment.user.name, 20, 67)
  doc.text(payment.user.email, 20, 73)

  // --- Table header ---
  const tableY = 90
  doc.setFillColor(245, 245, 240)
  doc.rect(20, tableY - 6, 170, 10, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text("Description", 22, tableY)
  doc.text("Quantit\u00e9", 110, tableY, { align: "center" })
  doc.text("Prix unitaire", 145, tableY, { align: "center" })
  doc.text("Total", 182, tableY, { align: "right" })

  // --- Table row ---
  const rowY = tableY + 12
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.text(description, 22, rowY)
  doc.text("1", 110, rowY, { align: "center" })
  doc.text(`${totalEur} \u20ac`, 145, rowY, { align: "center" })
  doc.text(`${totalEur} \u20ac`, 182, rowY, { align: "right" })

  // --- Separator ---
  doc.setDrawColor(200, 200, 200)
  doc.line(20, rowY + 8, 190, rowY + 8)

  // --- Total ---
  const totalY = rowY + 20
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text("Total TTC", 130, totalY)
  doc.text(`${totalEur} \u20ac`, 182, totalY, { align: "right" })

  // --- Footer ---
  const footerY = 260
  doc.setDrawColor(200, 200, 200)
  doc.line(20, footerY - 5, 190, footerY - 5)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(140, 140, 140)
  doc.text("Mon Pilates \u2014 Studio de Pilates, Larmor-Plage", 105, footerY, { align: "center" })
  doc.text("TVA non applicable, article 293 B du CGI", 105, footerY + 5, { align: "center" })

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${invoiceNumber}.pdf"`,
    },
  })
}
