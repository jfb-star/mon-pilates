"use client";

import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";

const sessionOptions = [
  { sessions: 1, price: 18 },
  { sessions: 5, price: 80 },
  { sessions: 10, price: 150 },
];

export function GiftCardForm() {
  const [giftType, setGiftType] = useState<"sessions" | "amount">("sessions");
  const [selectedSessions, setSelectedSessions] = useState(5);
  const [freeAmount, setFreeAmount] = useState(50);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPrice =
    giftType === "sessions"
      ? sessionOptions.find((o) => o.sessions === selectedSessions)?.price ?? 18
      : Math.max(10, Math.min(500, freeAmount));

  const currentLabel =
    giftType === "sessions"
      ? `${selectedSessions} cours de Pilates`
      : `Carte cadeau de ${currentPrice}\u20AC`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      {/* Left: Form */}
      <div className="space-y-8">
        {/* Gift type toggle */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-mp-charcoal mb-4">
            Type de cadeau
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setGiftType("sessions")}
              type="button"
              className={`flex-1 py-3 px-4 rounded-xl font-heading text-sm font-medium transition-all cursor-pointer ${giftType === "sessions" ? "bg-mp-gold text-white shadow-md" : "bg-mp-sand border border-mp-sand-dark/30 text-mp-text hover:bg-mp-sand-dark/30"}`}
            >
              Nombre de cours
            </button>
            <button
              onClick={() => setGiftType("amount")}
              type="button"
              className={`flex-1 py-3 px-4 rounded-xl font-heading text-sm font-medium transition-all cursor-pointer ${giftType === "amount" ? "bg-mp-gold text-white shadow-md" : "bg-mp-sand border border-mp-sand-dark/30 text-mp-text hover:bg-mp-sand-dark/30"}`}
            >
              Montant libre
            </button>
          </div>
        </div>

        {/* Sessions or amount */}
        {giftType === "sessions" ? (
          <div>
            <h3 className="font-heading text-sm font-medium text-mp-charcoal mb-3">
              Nombre de cours
            </h3>
            <div className="flex gap-3">
              {sessionOptions.map((opt) => (
                <button
                  key={opt.sessions}
                  onClick={() => setSelectedSessions(opt.sessions)}
                  type="button"
                  className={`flex-1 py-4 rounded-xl text-center transition-all cursor-pointer border-2 ${selectedSessions === opt.sessions ? "border-mp-gold bg-mp-gold-light/30 shadow-md" : "border-mp-sand-dark/30 hover:border-mp-gold/50"}`}
                >
                  <span className="block font-heading text-2xl font-bold text-mp-charcoal">
                    {opt.sessions}
                  </span>
                  <span className="block font-body text-xs text-mp-text-light mt-1">
                    cours &mdash; {opt.price}&euro;
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="freeAmount"
              className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
            >
              Montant (de 10&euro; a 500&euro;)
            </label>
            <div className="relative">
              <input
                id="freeAmount"
                type="number"
                min={10}
                max={500}
                value={freeAmount}
                onChange={(e) => setFreeAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-heading text-2xl font-bold text-mp-charcoal bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-heading text-xl text-mp-text-light">
                &euro;
              </span>
            </div>
          </div>
        )}

        {/* Recipient */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-medium text-mp-charcoal">
            Destinataire
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientName" className="sr-only">
                Nom du destinataire
              </label>
              <input
                id="recipientName"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nom du destinataire"
                className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
            <div>
              <label htmlFor="recipientEmail" className="sr-only">
                Email du destinataire
              </label>
              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Email du destinataire"
                className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
          </div>
        </div>

        {/* Personal message */}
        <div>
          <label
            htmlFor="personalMessage"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Message personnel{" "}
            <span className="text-mp-text-light font-normal">
              ({personalMessage.length}/200)
            </span>
          </label>
          <textarea
            id="personalMessage"
            rows={3}
            maxLength={200}
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            placeholder="Un petit mot pour accompagner votre cadeau..."
            className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2 resize-none"
          />
        </div>

        {/* Sender info */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-medium text-mp-charcoal">
            Vos informations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="senderName" className="sr-only">
                Votre nom
              </label>
              <input
                id="senderName"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
            <div>
              <label htmlFor="senderEmail" className="sr-only">
                Votre email
              </label>
              <input
                id="senderEmail"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {error && (
          <p className="text-mp-rose text-sm font-body">{error}</p>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            if (!recipientName || !recipientEmail || !senderName || !senderEmail) {
              setError("Veuillez remplir tous les champs obligatoires.");
              return;
            }
            setError("");
            setLoading(true);
            try {
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mode: "gift-card",
                  items: [
                    {
                      name: `Carte cadeau Mon Pilates — ${currentLabel}`,
                      price: currentPrice,
                      quantity: 1,
                    },
                  ],
                  metadata: {
                    recipientName,
                    recipientEmail,
                    senderName,
                    senderEmail,
                    personalMessage,
                    giftType,
                    label: currentLabel,
                  },
                }),
              });
              const data = await res.json();
              if (data.url) {
                window.location.href = data.url;
              } else {
                setError(data.error || "Erreur lors de la cr\u00e9ation du paiement.");
              }
            } catch {
              setError("Erreur de connexion. Veuillez r\u00e9essayer.");
            } finally {
              setLoading(false);
            }
          }}
          className="mp-btn mp-btn-gold w-full text-lg cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? "Redirection\u2026" : <>Offrir cette carte &mdash; {currentPrice}&euro;</>}
        </button>
      </div>

      {/* Right: Preview card */}
      <div className="flex items-start justify-center lg:sticky lg:top-32">
        <div className="w-full max-w-md">
          <h2 className="font-heading text-xl font-semibold text-mp-charcoal mb-4">
            Apercu de la carte
          </h2>
          <div className="relative rounded-2xl border-2 border-mp-gold overflow-hidden shadow-[0_8px_40px_rgba(201,169,110,0.2)] bg-gradient-to-br from-white via-mp-cream to-mp-gold-light/30">
            {/* Gold bar */}
            <div className="h-2 bg-gradient-to-r from-mp-gold to-mp-gold-light" />
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-heading text-xl font-bold text-mp-charcoal">
                  Mon <span className="text-mp-ocean">Pilates</span>
                </span>
                <Gift className="w-8 h-8 text-mp-gold" />
              </div>

              {/* Label */}
              <div className="text-center py-4">
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-mp-gold mb-2">
                  Carte Cadeau
                </p>
                <p className="font-heading text-3xl font-bold text-mp-charcoal">
                  {currentLabel}
                </p>
              </div>

              {/* Details */}
              <div className="border-t border-mp-gold/20 pt-4 space-y-3">
                <div>
                  <p className="font-heading text-xs uppercase tracking-wider text-mp-text-light">
                    Pour
                  </p>
                  <p className="font-heading text-base font-semibold text-mp-charcoal">
                    {recipientName || "Nom du destinataire"}
                  </p>
                </div>
                {personalMessage && (
                  <div>
                    <p className="font-heading text-xs uppercase tracking-wider text-mp-text-light">
                      Message
                    </p>
                    <p className="font-body text-sm text-mp-text italic leading-relaxed">
                      &laquo; {personalMessage}&raquo;
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-heading text-xs uppercase tracking-wider text-mp-text-light">
                    De la part de
                  </p>
                  <p className="font-heading text-sm font-medium text-mp-charcoal">
                    {senderName || "Votre nom"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="bg-mp-gold/10 rounded-xl p-4 text-center">
                <p className="font-heading text-2xl font-bold text-mp-gold">
                  {currentPrice}&euro;
                </p>
              </div>

              <p className="text-center font-body text-xs text-mp-text-light">
                mon-pilates.bzh &mdash; Larmor-Plage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
