"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

const subjects = [
  "Question générale",
  "Réservation",
  "Cours privé",
  "Partenariat",
  "Autre",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis.";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!formData.subject) newErrors.subject = "Veuillez choisir un sujet.";
    if (!formData.message.trim())
      newErrors.message = "Le message est requis.";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caractères.";
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus the first field with an error
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) requestAnimationFrame(() => el.focus());
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setIsSuccess(true);
    } catch {
      setErrors({ form: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(
    field: string,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (isSuccess) {
    return (
      <div className="mp-card p-8 sm:p-12 text-center border border-mp-sage/30">
        <CheckCircle className="w-16 h-16 text-mp-sage mx-auto mb-6" aria-hidden="true" />
        <h3 className="font-heading text-2xl font-bold text-mp-charcoal mb-3">
          Message envoyé !
        </h3>
        <p className="font-body text-mp-text-light leading-relaxed max-w-md mx-auto">
          Merci pour votre message. Nous vous répondrons dans les meilleurs
          délais, généralement sous 24 heures.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mp-card p-6 sm:p-8 border border-mp-sand-dark/30 space-y-5"
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-hp">Ne pas remplir</label>
        <input
          id="contact-hp"
          type="text"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) => handleChange("honeypot", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Prénom */}
        <div>
          <label
            htmlFor="firstName"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Prénom <span className="text-mp-rose">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            required
            autoComplete="given-name"
            enterKeyHint="next"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            aria-invalid={!!errors.firstName}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.firstName ? "border-red-400" : "border-mp-sand-dark/50"
            }`}
            placeholder="Votre prénom"
          />
          {errors.firstName && (
            <p id="firstName-error" role="alert" className="text-xs text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label
            htmlFor="lastName"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Nom <span className="text-mp-rose">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            required
            autoComplete="family-name"
            enterKeyHint="next"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            aria-invalid={!!errors.lastName}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.lastName ? "border-red-400" : "border-mp-sand-dark/50"
            }`}
            placeholder="Votre nom"
          />
          {errors.lastName && (
            <p id="lastName-error" role="alert" className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Email <span className="text-mp-rose">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.email ? "border-red-400" : "border-mp-sand-dark/50"
            }`}
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="phone"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Téléphone <span className="text-mp-text-light text-xs">(optionnel)</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      {/* Sujet */}
      <div>
        <label
          htmlFor="subject"
          className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
        >
          Sujet <span className="text-mp-rose">*</span>
        </label>
        <select
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          aria-invalid={!!errors.subject}
          className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 appearance-none ${
            errors.subject ? "border-red-400" : "border-mp-sand-dark/50"
          } ${!formData.subject ? "text-mp-text-light" : ""}`}
        >
          <option value="" disabled>
            Choisir un sujet
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" role="alert" className="text-xs text-red-600 mt-1">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="message"
            className="block font-heading text-sm font-medium text-mp-charcoal"
          >
            Message <span className="text-mp-rose">*</span>
          </label>
          <span className={`text-xs font-body ${formData.message.length > 1500 ? "text-mp-rose" : "text-mp-text-muted"}`}>
            {formData.message.length}/2000
          </span>
        </div>
        <textarea
          id="message"
          required
          rows={5}
          maxLength={2000}
          enterKeyHint="send"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 resize-y ${
            errors.message ? "border-red-400" : "border-mp-sand-dark/50"
          }`}
          placeholder="Votre message..."
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-xs text-red-600 mt-1">{errors.message}</p>
        )}
      </div>

      {errors.form && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p role="alert" className="text-sm text-red-700 font-body">{errors.form}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="mp-btn mp-btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" aria-hidden="true" />
              Envoyer le message
            </>
          )}
        </button>
        <p className="text-xs text-mp-text-muted font-body">
          <span className="text-mp-rose">*</span> Champs obligatoires
        </p>
      </div>
    </form>
  );
}
