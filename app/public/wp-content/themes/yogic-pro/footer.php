<?php
/**
 * Mon Pilates - Footer Premium
 * "Un footer qui respire" - Calme, clair, rassurant
 *
 * @package Yogic Pro
 */
?>

<!-- ========== FOOTER PREMIUM MON PILATES ========== -->
<footer class="mp-footer" id="footer-wrapper">

    <!-- Contenu principal du footer -->
    <div class="mp-footer__main">

        <!-- Bloc Identité -->
        <div class="mp-footer__identity">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="mp-footer__logo" aria-label="Mon Pilates">
                <img src="/wp-content/uploads/2024/08/logo-removebg-preview.png" alt="Mon Pilates - Studio de Pilates à Larmor-Plage près de Lorient">
            </a>
            <div class="mp-footer__identity-text">
                <p class="mp-footer__tagline">Pilates face à la mer — Larmor-Plage</p>
                <p class="mp-footer__signature">« Respirer. Bouger. Se recentrer. »</p>
            </div>
        </div>

        <!-- Bloc Navigation -->
        <nav class="mp-footer__nav" aria-label="Navigation du pied de page">
            <h2 class="mp-footer__title">Explorer</h2>
            <ul class="mp-footer__links">
                <li class="mp-footer__category">Découvrir le Pilates</li>
                <li><a href="<?php echo esc_url( home_url( '/le-studio/' ) ); ?>">Le studio</a></li>
                <li><a href="<?php echo esc_url( home_url( '/pour-qui/' ) ); ?>">Pour qui ?</a></li>
                <li class="mp-footer__category">Les séances</li>
                <li><a href="<?php echo esc_url( mp_get_seances_groupe_url() ); ?>">Cours en petit groupe</a></li>
                <li><a href="<?php echo esc_url( mp_get_seances_individuelles_url() ); ?>">Cours individuels</a></li>
                <li><a href="<?php echo esc_url( mp_get_planning_url() ); ?>">Planning & réservation</a></li>
                <li><a href="<?php echo esc_url( home_url( '/cours-de-pilates-larmor-plage-tarifs/' ) ); ?>">Tarifs</a></li>
                <li><a href="<?php echo esc_url( mp_get_gift_card_url() ); ?>">Cartes cadeaux</a></li>
                <li><a href="<?php echo esc_url( home_url( '/pilates-en-entreprise-boostez-le-bien-etre-au-travail/' ) ); ?>">Pilates en entreprise</a></li>
                <li><a href="<?php echo esc_url( mp_get_contact_url() ); ?>">Contact</a></li>
            </ul>
        </nav>

        <!-- Bloc Contact -->
        <div class="mp-footer__contact">
            <h2 class="mp-footer__title">Nous trouver</h2>

            <address class="mp-footer__address">
                14 boulevard des Dunes<br>
                56260 Larmor-Plage
                <span class="mp-footer__address-highlight">Face à l'océan</span>
            </address>

            <div class="mp-footer__contact-info">
                <a href="tel:+33699183216" class="mp-footer__contact-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    06 99 18 32 16
                </a>
                <a href="mailto:contact@mon-pilates.bzh" class="mp-footer__contact-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    contact@mon-pilates.bzh
                </a>
            </div>

            <!-- Réseaux sociaux -->
            <div class="mp-footer__social">
                <a href="https://www.instagram.com/monpilates.bzh/" target="_blank" rel="noopener noreferrer" class="mp-footer__social-link" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
                <a href="https://www.facebook.com/monpilates.bzh" target="_blank" rel="noopener noreferrer" class="mp-footer__social-link" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                </a>
            </div>
        </div>

    </div>

    <!-- Bandeau légal -->
    <div class="mp-footer__bottom">
        <div class="mp-footer__bottom-inner">
            <p class="mp-footer__copyright">© <?php echo date('Y'); ?> Mon Pilates · Larmor-Plage</p>
            <div class="mp-footer__legal">
                <a href="<?php echo esc_url( home_url( '/mentions-legales/' ) ); ?>">Mentions légales</a>
                <a href="<?php echo esc_url( home_url( '/politique-de-confidentialite/' ) ); ?>">Confidentialité</a>
                <a href="<?php echo esc_url( home_url( '/conditions-generales-de-vente/' ) ); ?>">CGV</a>
            </div>
        </div>
    </div>

</footer>

<!-- Bouton téléphone flottant (mobile uniquement) -->
<a href="tel:+33699183216" class="floating-phone" aria-label="Appeler Mon Pilates">
    <i class="fas fa-phone-volume"></i>
</a>

<!-- Schema.org LocalBusiness – SEO local -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    "name": "Mon Pilates",
    "alternateName": ["Mon Pilates Larmor-Plage", "Mon Pilates à Larmor-Plage"],
    "description": "Studio de Pilates à Larmor-Plage face à la mer, près de Lorient. Cours collectifs en petit groupe (5 personnes max), cours privés sur appareils (Reformer, Cadillac). Enseignante certifiée FPMP.",
    "url": "https://mon-pilates.bzh/",
    "logo": "https://mon-pilates.bzh/wp-content/uploads/2024/08/logo-removebg-preview.png",
    "image": "https://mon-pilates.bzh/wp-content/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg",
    "telephone": "+33699183216",
    "email": "contact@mon-pilates.bzh",
    "priceRange": "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Carte bancaire, Espèces",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "14 Boulevard des Dunes",
        "addressLocality": "Larmor-Plage",
        "postalCode": "56260",
        "addressRegion": "Bretagne",
        "addressCountry": "FR"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.7093,
        "longitude": -3.3773
    },
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "20:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "14:00"
        }
    ],
    "sameAs": [
        "https://www.facebook.com/monpilates.bzh",
        "https://www.instagram.com/monpilates.bzh/"
    ],
    "founder": {
        "@type": "Person",
        "name": "Violette",
        "jobTitle": "Enseignante de Pilates certifiée FPMP"
    },
    "areaServed": [
        {"@type": "City", "name": "Larmor-Plage"},
        {"@type": "City", "name": "Lorient"},
        {"@type": "City", "name": "Ploemeur"},
        {"@type": "City", "name": "Guidel"},
        {"@type": "City", "name": "Lanester"}
    ],
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cours de Pilates",
        "itemListElement": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Cours collectif tapis",
                    "description": "Cours de Pilates en petit groupe de 5 personnes maximum, sur tapis avec petit matériel"
                },
                "price": "17.00",
                "priceCurrency": "EUR",
                "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "17.00",
                    "priceCurrency": "EUR",
                    "referenceQuantity": {
                        "@type": "QuantitativeValue",
                        "value": "1",
                        "unitText": "séance"
                    }
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Cours privé sur appareils",
                    "description": "Séance individuelle sur Reformer, Cadillac et autres appareils Pilates"
                },
                "price": "55.00",
                "priceCurrency": "EUR"
            }
        ]
    }
}
</script>

<?php wp_footer(); ?>
</div>
</body>
</html>
