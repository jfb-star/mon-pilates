"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

const subjects = [
  "Question generale",
  "Reservation",
  "Cours prive",
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
      newErrors.firstName = "Le prenom est requis.";
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
      newErrors.message = "Le message doit contenir au moins 10 caracteres.";
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
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
        <CheckCircle className="w-16 h-16 text-mp-sage mx-auto mb-6" />
        <h3 className="font-heading text-2xl font-bold text-mp-charcoal mb-3">
          Message envoye !
        </h3>
        <p className="font-body text-mp-text-light leading-relaxed max-w-md mx-auto">
          Merci pour votre message. Nous vous repondrons dans les meilleurs
          delais, generalement sous 24 heures.
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
        {/* Prenom */}
        <div>
          <label
            htmlFor="firstName"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Prenom <span className="text-mp-rose">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.firstName ? "border-mp-rose" : "border-mp-sand-dark/50"
            }`}
            placeholder="Votre prenom"
          />
          {errors.firstName && (
            <p className="text-xs text-mp-rose mt-1">{errors.firstName}</p>
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
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.lastName ? "border-mp-rose" : "border-mp-sand-dark/50"
            }`}
            placeholder="Votre nom"
          />
          {errors.lastName && (
            <p className="text-xs text-mp-rose mt-1">{errors.lastName}</p>
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
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 ${
              errors.email ? "border-mp-rose" : "border-mp-sand-dark/50"
            }`}
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p className="text-xs text-mp-rose mt-1">{errors.email}</p>
          )}
        </div>

        {/* Telephone */}
        <div>
          <label
            htmlFor="phone"
            className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
          >
            Telephone <span className="text-mp-text-light text-xs">(optionnel)</span>
          </label>
          <input
            id="phone"
            type="tel"
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
          className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 appearance-none ${
            errors.subject ? "border-mp-rose" : "border-mp-sand-dark/50"
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
          <p className="text-xs text-mp-rose mt-1">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5"
        >
          Message <span className="text-mp-rose">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border font-body text-sm text-mp-text bg-mp-white transition-colors focus:outline-none focus:ring-2 focus:ring-mp-ocean/40 resize-y ${
            errors.message ? "border-mp-rose" : "border-mp-sand-dark/50"
          }`}
          placeholder="Votre message..."
        />
        {errors.message && (
          <p className="text-xs text-mp-rose mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mp-btn mp-btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
