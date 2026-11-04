<?php
/**
 * Template Name: Contact Premium
 *
 * Template personnalisé pour la page Contact
 * Layout 2 colonnes, style premium, calme et lumineux
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-contact-page">

    <!-- HERO SECTION -->
    <section class="mp-contact-hero">
        <div class="mp-contact-hero-inner">
            <h1 class="mp-contact-title">Contactez Mon Pilates à Larmor-Plage</h1>
            <p class="mp-contact-subtitle">
                Une question avant de venir ? Un projet d'entreprise ? Je vous réponds sous 24&nbsp;h, avec attention. Le studio est situé au 14 boulevard des Dunes à Larmor-Plage, à deux pas de la plage de Toulhars et à 10 minutes de Lorient.
            </p>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL : 2 colonnes -->
    <div class="mp-contact-container">
        <div class="mp-contact-grid">

            <!-- COLONNE GAUCHE : Infos pratiques -->
            <aside class="mp-contact-infos">
                <h2 class="mp-infos-title">Nous trouver</h2>

                <div class="mp-info-card">
                    <div class="mp-info-icon">📍</div>
                    <div class="mp-info-content">
                        <strong>Adresse</strong>
                        <a href="https://maps.google.com/?q=Mon+Pilates+Larmor-Plage,+14+Boulevard+des+dunes,+56260+Larmor-Plage" target="_blank" rel="noopener" class="mp-address-link">
                            <p>Mon Pilates – Villa les mouettes<br>
                            14 Boulevard des dunes<br>
                            56260 Larmor-Plage</p>
                            <span class="mp-itineraire">Itinéraire →</span>
                        </a>
                    </div>
                </div>

                <div class="mp-info-card">
                    <div class="mp-info-icon">📞</div>
                    <div class="mp-info-content">
                        <strong>Téléphone</strong>
                        <p><a href="tel:+33699183216">06 99 18 32 16</a></p>
                    </div>
                </div>

                <div class="mp-info-card">
                    <div class="mp-info-icon">✉️</div>
                    <div class="mp-info-content">
                        <strong>Email</strong>
                        <p><a href="mailto:contact@mon-pilates.bzh">contact@mon-pilates.bzh</a></p>
                    </div>
                </div>

                <div class="mp-info-card">
                    <div class="mp-info-icon">🕐</div>
                    <div class="mp-info-content">
                        <strong>Horaires</strong>
                        <p>Lundi – Vendredi : 8h – 20h<br>
                        Samedi : 9h – 14h</p>
                    </div>
                </div>

                <div class="mp-response-badge">
                    <span class="mp-badge-icon">⚡</span>
                    <span>Réponse sous 24h en moyenne</span>
                </div>
            </aside>

            <!-- COLONNE DROITE : Formulaire -->
            <div class="mp-contact-form-wrapper">
                <h2 class="mp-form-title">Envoyez-nous un message</h2>

                <!-- Formulaire HTML custom sécurisé -->
                <form id="mp-contact-form" class="mp-contact-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <input type="hidden" name="action" value="mp_contact_submit">
                    <input type="hidden" name="mp_elapsed" value="0">

                    <?php /* Champ piège anti-robots : invisible pour les humains, ignoré par les lecteurs d'écran. */ ?>
                    <div class="mp-hp" aria-hidden="true">
                        <label for="mp_site_web">Ne pas remplir</label>
                        <input type="text" id="mp_site_web" name="mp_site_web" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="mp-form-row mp-form-row-2col">
                        <div class="mp-form-field">
                            <label for="mp_prenom">Prénom <span class="required">*</span></label>
                            <input type="text" id="mp_prenom" name="mp_prenom" required maxlength="60" autocomplete="given-name" placeholder="Votre prénom">
                        </div>
                        <div class="mp-form-field">
                            <label for="mp_nom">Nom <span class="required">*</span></label>
                            <input type="text" id="mp_nom" name="mp_nom" required maxlength="60" autocomplete="family-name" placeholder="Votre nom">
                        </div>
                    </div>

                    <div class="mp-form-field">
                        <label for="mp_email">Email <span class="required">*</span></label>
                        <input type="email" id="mp_email" name="mp_email" required maxlength="254" autocomplete="email" inputmode="email" placeholder="votre@email.com">
                    </div>

                    <div class="mp-form-field">
                        <label for="mp_telephone">Téléphone</label>
                        <input type="tel" id="mp_telephone" name="mp_telephone" maxlength="30" autocomplete="tel" placeholder="Optionnel">
                    </div>

                    <div class="mp-form-field">
                        <label for="mp_message">Message <span class="required">*</span></label>
                        <textarea id="mp_message" name="mp_message" rows="5" required maxlength="5000" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                    </div>

                    <div class="mp-form-field mp-form-rgpd">
                        <label class="mp-checkbox-label">
                            <input type="checkbox" name="mp_rgpd" required>
                            <span class="mp-checkbox-text">
                                En cochant cette case, j'accepte que mes données personnelles soient utilisées pour me recontacter dans le cadre de ma demande.
                                <a href="<?php echo esc_url(get_privacy_policy_url()); ?>" target="_blank">Politique de confidentialité</a>
                            </span>
                        </label>
                    </div>

                    <div class="mp-form-submit">
                        <button type="submit" class="mp-submit-btn">
                            <span>Envoyer mon message</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                    </div>

                    <?php if (isset($_GET['contact']) && $_GET['contact'] === 'success'): ?>
                    <div class="mp-form-success">
                        ✓ Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.
                    </div>
                    <?php elseif (isset($_GET['contact']) && $_GET['contact'] === 'invalid'): ?>
                    <div class="mp-form-error" role="alert">
                        Il manque une information : vérifiez votre prénom, votre nom, votre email, votre message et la case de consentement, puis renvoyez le formulaire.
                    </div>
                    <?php elseif (isset($_GET['contact']) && $_GET['contact'] === 'wait'): ?>
                    <div class="mp-form-error" role="alert">
                        Plusieurs messages viennent d'être envoyés depuis votre connexion. Merci de réessayer dans un quart d'heure, ou d'appeler le 06 99 18 32 16.
                    </div>
                    <?php elseif (isset($_GET['contact']) && $_GET['contact'] === 'error'): ?>
                    <div class="mp-form-error" role="alert">
                        Votre message n'a pas pu partir. Réessayez dans un instant, ou appelez le 06 99 18 32 16.
                    </div>
                    <?php endif; ?>
                </form>
                <script>
                (function () {
                    var form = document.getElementById('mp-contact-form');
                    if (!form) { return; }
                    var start = Date.now();
                    var KEY = 'mp_contact_draft';
                    var FIELDS = ['mp_prenom', 'mp_nom', 'mp_email', 'mp_telephone', 'mp_message'];
                    var status = new URLSearchParams(location.search).get('contact');
                    try {
                        if (status === 'success') {
                            sessionStorage.removeItem(KEY);
                        } else if (status) {
                            // Après une erreur, on remet ce que la personne avait tapé.
                            var draft = JSON.parse(sessionStorage.getItem(KEY) || '{}');
                            FIELDS.forEach(function (name) {
                                if (draft[name] && form.elements[name] && !form.elements[name].value) {
                                    form.elements[name].value = draft[name];
                                }
                            });
                        }
                    } catch (e) {}
                    form.addEventListener('submit', function () {
                        form.elements.mp_elapsed.value = String(Date.now() - start);
                        try {
                            var draft = {};
                            FIELDS.forEach(function (name) { draft[name] = form.elements[name].value; });
                            sessionStorage.setItem(KEY, JSON.stringify(draft));
                        } catch (e) {}
                    });
                })();
                </script>
            </div>

        </div>

        <!-- PHOTO FONDATRICE — Transition émotionnelle vers la carte -->
        <figure class="mp-contact-photo">
            <img
                src="<?php echo esc_url(content_url('/uploads/2026/02/Contact-Mon-Pilates-Larmor-Plage.png')); ?>"
                alt="Studio Mon Pilates face à la mer - 14 Boulevard des Dunes, Larmor-Plage"
                loading="lazy"
                decoding="async"
            >
            <figcaption>Je vous accueille personnellement au studio, face à la mer.</figcaption>
        </figure>

        <!-- GOOGLE MAPS -->
        <section class="mp-contact-map">
            <div class="mp-map-header">
                <h3 class="mp-map-title">Nous situer</h3>
                <p class="mp-map-subtitle">Le studio est situé à deux pas de la plage, face à la mer.</p>
            </div>
            <div class="mp-map-wrapper">
                <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-3.3815%2C47.7068%2C-3.3725%2C47.7118&amp;layer=mapnik&amp;marker=47.70928%2C-3.37734"
                    width="100%"
                    height="320"
                    style="border:0;"
                    loading="lazy"
                    title="Localisation Mon Pilates Larmor-Plage sur OpenStreetMap">
                </iframe>
                <p class="mp-map-link">
                    <a href="https://maps.google.com/?q=Mon+Pilates+Larmor-Plage,+14+Boulevard+des+dunes,+56260+Larmor-Plage" target="_blank" rel="noopener">
                        Itinéraire sur Google Maps →
                    </a>
                </p>
            </div>
        </section>

    </div>

</div>

<?php get_footer(); ?>
