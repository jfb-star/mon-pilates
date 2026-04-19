import Link from "next/link"
import { verify } from "@/lib/unsubscribe-token"

/**
 * Public unsubscribe page.
 *
 * No auth — the HMAC token IS the authorization.
 * A POST to /api/unsubscribe confirms; GET one-click also works for email
 * clients that strip the form.
 */

type SearchParams = Promise<{ token?: string }>

export const dynamic = "force-dynamic"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { token } = await searchParams
  const email = verify(token)

  if (!email) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="mb-4 text-2xl font-semibold text-stone-800">
          Lien invalide ou expiré
        </h1>
        <p className="mb-6 text-stone-600">
          Le lien de désinscription n&apos;est pas valide. Il a peut-être été
          tronqué par votre messagerie.
        </p>
        <p className="text-stone-600">
          Écrivez-nous sur la{" "}
          <Link href="/contact" className="underline">
            page contact
          </Link>{" "}
          et nous vous désinscrirons manuellement.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-4 text-2xl font-semibold text-stone-800">
        Confirmer la désinscription
      </h1>
      <p className="mb-6 text-stone-600">
        Vous êtes sur le point de désinscrire <strong>{email}</strong> de la
        newsletter Mon Pilates.
      </p>
      <form action="/api/unsubscribe" method="POST">
        <input type="hidden" name="token" value={token ?? ""} />
        <button
          type="submit"
          className="rounded-md bg-stone-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          Confirmer la désinscription
        </button>
      </form>
      <p className="mt-6 text-sm text-stone-500">
        Vous pouvez fermer cette page si vous souhaitez rester inscrit.
      </p>
    </main>
  )
}
