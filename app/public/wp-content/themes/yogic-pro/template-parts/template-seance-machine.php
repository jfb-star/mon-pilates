<?php
/**
 * Template Name: Pilates Machine en petit groupe
 *
 * Page dédiée au format collectif sur Reformer (Pilates Machine).
 * Distinct de :
 *  - "Séances en petit groupe" qui présente le tapis
 *  - "Séances individuelles" qui présente le cours privé sur tous les appareils
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-machine-page mp-seances-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-machine">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fb069" stroke-width="2" fill="none"/>
                    <rect x="14" y="25" width="28" height="6" rx="1" stroke="#7fb069" stroke-width="2" fill="none"/>
                    <line x1="14" y1="28" x2="42" y2="28" stroke="#7fb069" stroke-width="1.5"/>
                    <circle cx="18" cy="28" r="2" fill="#7fb069"/>
                    <circle cx="38" cy="28" r="2" fill="#7fb069"/>
                </svg>
            </div>
            <p class="mp-hero-eyebrow">Nouveau format</p>
            <h1 class="mp-hero-title">Pilates Machine en petit groupe à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Le travail ciblé sur Reformer, avec la dynamique d'un petit groupe.<br>
                Une formule qui combine progression précise et énergie collective, à un tarif accessible.
            </p>
            <p class="mp-hero-badge">4 personnes maximum par séance</p>
            <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-outline mp-hero-cta">
                <span>Trouver un créneau</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION 1 : QU'EST-CE QUE LE PILATES MACHINE -->
        <section class="mp-section mp-section-esprit">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <h2 class="mp-section-title">Le Pilates sur Reformer, accessible en petit groupe</h2>
                    <p class="mp-section-intro">Jusqu'ici, travailler sur Reformer signifiait passer en cours privé. Avec ce nouveau format, vous bénéficiez du même appareil — et de la même précision — dans un groupe restreint, à un tarif plus accessible.</p>
                </div>

                <div class="mp-values-grid">
                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="9" width="18" height="6" rx="1"/>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <circle cx="6" cy="12" r="1.5"/>
                                <circle cx="18" cy="12" r="1.5"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">Le travail des résistances</h3>
                        <p>Le Reformer ajoute des ressorts à votre pratique. Ce sont eux qui guident, qui soutiennent et qui sollicitent les muscles profonds avec précision. Une sensation différente du tapis, complémentaire.</p>
                    </div>

                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">Un groupe de 4 maximum</h3>
                        <p>Travailler sur Reformer demande une attention particulière à l'alignement. En limitant à 4 personnes — un format encore plus restreint que le tapis — je peux passer auprès de chacun, ajuster les réglages et corriger en temps réel.</p>
                    </div>

                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 2v6m0 8v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">À un tarif accessible</h3>
                        <p>À partir de 27 €/séance avec une carte 10 cours, le Pilates Machine en petit groupe rend les appareils Pilates accessibles sans engagement individuel — beaucoup plus abordable qu'un cours privé.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 2 : POUR QUI SONT CES SÉANCES -->
        <section class="mp-section mp-section-profiles mp-section-alt">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Ces séances sont faites pour vous si…</h2>

                <p class="mp-direct-reassurance">Aucune expérience préalable du Reformer n'est nécessaire — on vous explique tout pas à pas.</p>

                <div class="mp-profiles-grid mp-profiles-groupe">
                    <div class="mp-profile-card mp-profile-sage-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous voulez découvrir le Reformer</h3>
                        <p>Sans passer par le cours privé. Le format collectif vous permet de tester l'appareil dans un cadre rassurant, accompagné, et à un tarif raisonnable.</p>
                    </div>

                    <div class="mp-profile-card mp-profile-blue-soft">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous pratiquez déjà le tapis et voulez progresser</h3>
                        <p>Les appareils sont la suite logique. Les résistances vous aident à mieux ressentir l'engagement musculaire, à affiner votre alignement et à approfondir votre pratique.</p>
                    </div>

                    <div class="mp-profile-card mp-profile-warm-soft">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous cherchez une alternative au cours privé</h3>
                        <p>Le cours privé sur appareils est très complet, mais pas accessible à tous les budgets pour une pratique régulière. Le format en petit groupe offre une bonne partie des bénéfices, à un tarif plus doux.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION IMAGE -->
        <section class="mp-section mp-section-image-ambiance">
            <figure class="mp-ambiance-image">
                <img
                    src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                    alt="Studio de Pilates avec Reformer à Larmor-Plage"
                    loading="lazy"
                    decoding="async"
                >
            </figure>
        </section>

        <!-- SECTION 3 : DÉROULEMENT D'UNE SÉANCE -->
        <section class="mp-section mp-section-deroulement">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Comment se déroule une séance ?</h2>

                <div class="mp-deroulement-grid">
                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">1</div>
                        <h3 class="mp-deroulement-title">L'installation</h3>
                        <p>Premier réflexe : régler le Reformer à vos mensurations. Ressorts, sangles, position des appuis — chacun a son installation. Si c'est votre première fois, je vous accompagne pas à pas.</p>
                    </div>

                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">2</div>
                        <h3 class="mp-deroulement-title">L'échauffement</h3>
                        <p>On commence en douceur, par des mouvements simples qui réveillent les chaînes musculaires et préparent le corps au travail des résistances.</p>
                    </div>

                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">3</div>
                        <h3 class="mp-deroulement-title">Les exercices guidés</h3>
                        <p>Une série d'exercices ciblés, expliqués clairement et adaptés à votre niveau. Je passe auprès de chacun pour ajuster les réglages, corriger une posture, suggérer une variante.</p>
                    </div>

                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">4</div>
                        <h3 class="mp-deroulement-title">Le retour au calme</h3>
                        <p>On termine sur des étirements et quelques respirations. Une vraie sensation d'avoir travaillé en profondeur, sans avoir forcé.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section mp-quote-machine">
            <blockquote class="mp-quote-box">
                <p>"Le Reformer permet d'aller plus loin dans le ressenti. Et le faire à plusieurs, c'est mêler la précision de l'appareil à la convivialité du groupe."</p>
            </blockquote>
        </section>

        <!-- SECTION TARIFS -->
        <section class="mp-section mp-section-pricing-snapshot">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Tarifs Pilates Machine en petit groupe</h2>
                <div class="mp-snapshot-grid">
                    <div class="mp-snapshot-card">
                        <p class="mp-snapshot-label">Séance unité</p>
                        <p class="mp-snapshot-price">30&nbsp;€</p>
                        <p class="mp-snapshot-note">Découverte ou flexibilité</p>
                    </div>
                    <div class="mp-snapshot-card">
                        <p class="mp-snapshot-label">Carte 5&nbsp;cours</p>
                        <p class="mp-snapshot-price">140&nbsp;€</p>
                        <p class="mp-snapshot-note">28&nbsp;€ / séance — valable 5&nbsp;mois</p>
                    </div>
                    <div class="mp-snapshot-card mp-snapshot-card-featured">
                        <p class="mp-snapshot-label">Carte 10&nbsp;cours</p>
                        <p class="mp-snapshot-price">270&nbsp;€</p>
                        <p class="mp-snapshot-note">27&nbsp;€ / séance — valable 10&nbsp;mois</p>
                    </div>
                </div>
                <p class="mp-snapshot-cta-text">
                    <a href="<?php echo esc_url(home_url('/cours-de-pilates-larmor-plage-tarifs/')); ?>">Voir tous les tarifs et formules →</a>
                </p>
            </div>
        </section>

        <!-- SECTION CTA FINALE -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Prêt à essayer le Reformer ?</h2>
                <p class="mp-cta-text">
                    Consultez les créneaux Pilates Machine ou écrivez-moi pour échanger avant de réserver.
                </p>
                <p class="mp-cta-reassurance">4 personnes maximum, débutants bienvenus<br>Studio à Larmor-Plage, à 10 min de <a href="<?php echo esc_url(home_url('/pilates-lorient/')); ?>">Lorient</a>, 5 min de <a href="<?php echo esc_url(home_url('/pilates-ploemeur/')); ?>">Ploemeur</a></p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Trouver un créneau</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </a>
                    <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-btn mp-btn-secondary">
                        <span>J'ai une question avant de réserver</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                    </a>
                </div>
                <p class="mp-cta-alternative">
                    <a href="<?php echo esc_url(mp_get_seances_groupe_url()); ?>">Vous préférez le tapis ?</a>
                    &nbsp;·&nbsp;
                    <a href="<?php echo esc_url(mp_get_seances_individuelles_url()); ?>">Vous voulez un cours privé ?</a>
                </p>
            </div>
        </section>

    </div>

</div>

<!-- Schema.org Service – SEO -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Cours de Pilates sur Reformer en petit groupe",
    "name": "Pilates Machine en petit groupe",
    "description": "Cours collectif sur Reformer en petit groupe (4 personnes maximum) à Larmor-Plage. Le travail ciblé des appareils Pilates avec la dynamique du collectif, à un tarif accessible.",
    "provider": {
        "@type": "LocalBusiness",
        "name": "Mon Pilates",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "14 boulevard des Dunes",
            "addressLocality": "Larmor-Plage",
            "postalCode": "56260",
            "addressCountry": "FR"
        }
    },
    "areaServed": [
        {"@type": "City", "name": "Larmor-Plage"},
        {"@type": "City", "name": "Lorient"},
        {"@type": "City", "name": "Ploemeur"},
        {"@type": "City", "name": "Guidel"}
    ],
    "offers": [
        {
            "@type": "Offer",
            "name": "Séance unité Pilates Machine",
            "price": "30.00",
            "priceCurrency": "EUR"
        },
        {
            "@type": "Offer",
            "name": "Carte 5 cours Pilates Machine",
            "price": "140.00",
            "priceCurrency": "EUR"
        },
        {
            "@type": "Offer",
            "name": "Carte 10 cours Pilates Machine",
            "price": "270.00",
            "priceCurrency": "EUR"
        }
    ]
}
</script>

<?php get_footer(); ?>
