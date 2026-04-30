"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ChevronDown, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { clsx } from "clsx"

interface Review {
  id: string
  displayName: string
  rating: number
  comment: string | null
  courseTypeSlug: string
  courseTypeName: string
  createdAt: string
}

interface ReviewData {
  reviews: Review[]
  averageRating: number | null
  totalReviews: number
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMinutes < 1) return "a l'instant"
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`
  if (diffHours < 24) return `il y a ${diffHours} h`
  if (diffDays === 1) return "il y a 1 jour"
  if (diffDays < 7) return `il y a ${diffDays} jours`
  if (diffWeeks === 1) return "il y a 1 semaine"
  if (diffWeeks < 5) return `il y a ${diffWeeks} semaines`
  if (diffMonths === 1) return "il y a 1 mois"
  if (diffMonths < 12) return `il y a ${diffMonths} mois`
  return `il y a plus d'un an`
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number
  size?: "sm" | "md"
}) {
  const sizeClass = size === "md" ? "w-5 h-5" : "w-4 h-4"
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} sur 5 etoiles`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            sizeClass,
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-mp-sand-dark/40"
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (rating: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div
      className="inline-flex gap-1"
      role="radiogroup"
      aria-label="Votre note"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} etoile${star > 1 ? "s" : ""}`}
            className="p-0.5 cursor-pointer transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-mp-ocean rounded"
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
          >
            <Star
              className={clsx(
                "w-7 h-7 transition-colors",
                active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-mp-sand-dark/50"
              )}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewSection({
  courseTypeSlug,
}: {
  courseTypeSlug: string
}) {
  const [data, setData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?courseType=${courseTypeSlug}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // Silent fail for public display
    } finally {
      setLoading(false)
    }
  }, [courseTypeSlug])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setSubmitMessage({ type: "error", text: "Veuillez selectionner une note." })
      return
    }

    setSubmitting(true)
    setSubmitMessage(null)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTypeSlug,
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setSubmitMessage({
          type: "error",
          text: json.error || "Une erreur est survenue.",
        })
        return
      }

      setSubmitMessage({
        type: "success",
        text: "Merci pour votre avis !",
      })
      setRating(0)
      setComment("")
      setFormOpen(false)
      // Refresh reviews
      fetchReviews()
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Erreur de connexion. Veuillez reessayer.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-mp-ocean" aria-hidden="true" />
        <span className="sr-only">Chargement des avis...</span>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header with aggregate */}
      <div className="flex items-center gap-3 flex-wrap">
        {data.averageRating !== null && (
          <>
            <StarRating rating={Math.round(data.averageRating)} size="md" />
            <span className="font-heading text-xl font-bold text-mp-charcoal">
              {data.averageRating.toFixed(1)}/5
            </span>
          </>
        )}
        <span className="font-body text-mp-text-light">
          {data.totalReviews === 0
            ? "Aucun avis pour le moment"
            : `${data.totalReviews} avis`}
        </span>
      </div>

      {/* Reviews list */}
      {data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-mp-white rounded-xl border border-mp-sand-dark/20 p-5"
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-sm font-semibold text-mp-charcoal">
                    {review.displayName}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-mp-text-muted font-heading">
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
              {review.comment && (
                <p className="font-body text-sm text-mp-text leading-relaxed italic">
                  &laquo; {review.comment} &raquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit message (outside form for visibility after form close) */}
      {submitMessage && (
        <div
          className={clsx(
            "flex items-center gap-2 p-3 rounded-lg text-sm font-body",
            submitMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
          role="alert"
        >
          {submitMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          {submitMessage.text}
        </div>
      )}

      {/* Toggle form button */}
      <button
        type="button"
        onClick={() => {
          setFormOpen(!formOpen)
          setSubmitMessage(null)
        }}
        className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-mp-ocean hover:text-mp-ocean-dark transition-colors"
      >
        Laisser un avis
        <ChevronDown
          className={clsx(
            "w-4 h-4 transition-transform",
            formOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Review form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-mp-cream rounded-xl border border-mp-sand-dark/20 p-5 space-y-4"
        >
          <div>
            <label className="block font-heading text-sm font-semibold text-mp-charcoal mb-2">
              Votre note
            </label>
            <InteractiveStarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="block font-heading text-sm font-semibold text-mp-charcoal mb-2"
            >
              Commentaire{" "}
              <span className="font-normal text-mp-text-muted">(optionnel)</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-mp-sand-dark/30 bg-mp-white px-4 py-2.5 font-body text-sm text-mp-text placeholder:text-mp-text-muted/60 focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 focus:border-mp-ocean transition-colors resize-none"
              placeholder="Partagez votre expérience..."
            />
            <p className="text-xs text-mp-text-muted mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className={clsx(
              "mp-btn mp-btn-primary text-sm",
              (submitting || rating === 0) && "opacity-50 cursor-not-allowed"
            )}
          >
            {submitting ? (
              <>
                <Loader2
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
                Envoi en cours...
              </>
            ) : (
              "Publier mon avis"
            )}
          </button>
        </form>
      )}
    </div>
  )
}
