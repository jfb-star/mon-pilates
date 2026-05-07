<?php
/**
 * Template Name: Pilates Lorient
 *
 * Page locale SEO ciblant "cours pilates lorient"
 * Angle : accessibilité depuis Lorient, diversité des cours, expertise certifiée
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-lorient-page mp-premium-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-soft">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <path d="M20 34c0-6 4-10 8-14 4 4 8 8 8 14" stroke="#7fa8b6" stroke-width="1.5" fill="none"/>
                    <circle cx="28" cy="28" r="5" fill="#7fa8b6" opacity="0.25"/>
                    <path d="M28 18v-4M22 22l-3-3M34 22l3-3" stroke="#7fa8b6" stroke-width="1.5" opacity="0.4"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Cours de Pilates près de Lorient : votre studio à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Vous habitez Lorient et cherchez un studio de Pilates dans un cadre calme, près de chez vous ? Mon Pilates vous accueille à 10 minutes du centre, dans un studio lumineux à Larmor-Plage, à deux pas de la plage de Toulhars. Trois formules au choix : <strong>Pilates Tapis</strong> en petit groupe, <strong>Pilates Machine</strong> en petit groupe, ou <strong>cours privés sur appareils</strong>, avec une enseignante certifiée FPMP.
            </p>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION 1 : POURQUOI VENIR DEPUIS LORIENT -->
        <section class="mp-section mp-section-with-image">
            <div class="mp-section-inner">
                <div class="mp-section-text">
                    <h2 class="mp-section-title">Un studio de Pilates à deux pas de Lorient</h2>
                    <p>Situé au 14 Boulevard des Dunes à Larmor-Plage, Mon Pilates est facilement accessible depuis Lorient en seulement 10 minutes en voiture. Le trajet est simple : direction Larmor-Plage par la D29, puis tout droit jusqu'au front de mer.</p>
                    <p>Stationner est facile : un parking gratuit se trouve à proximité immédiate du studio. Vous pouvez également venir en bus (ligne T2, arrêt Dunes) ou à vélo grâce à la piste cyclable reliant Lorient à Larmor-Plage.</p>
                    <p class="mp-text-emphasis">En quittant Lorient, vous laissez derrière vous le rythme de la ville. En arrivant au studio, ouvert sur l'océan, vous êtes déjà dans un autre état d'esprit. Un cadre propice à la concentration, à la respiration, au relâchement.</p>
                </div>
                <div class="mp-section-visual">
                    <figure class="mp-section-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                            alt="Studio Mon Pilates à Larmor-Plage, à 10 minutes de Lorient"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- SECTION 2 : NOS COURS DE PILATES -->
        <section class="mp-section mp-section-profiles mp-section-alt">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <h2 class="mp-section-title">Des cours de Pilates adaptés à chaque besoin</h2>
                    <p class="mp-section-intro">Que vous soyez débutant ou pratiquant confirmé, que vous cherchiez un moment collectif ou un accompagnement sur mesure : nous avons le format qu'il vous faut.</p>
                </div>

                <div class="mp-profiles-grid">
                    <!-- Cours collectifs -->
                    <div class="mp-profile-card mp-profile-blue-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Pilates Tapis en petit groupe</h3>
                        <p>5 personnes maximum, sur tapis avec petit matériel. L'énergie du collectif, avec une vraie attention individuelle. Idéal pour installer un rituel bien-être hebdomadaire.</p>
                        <p class="mp-profile-price">À partir de 17 € la séance</p>
                    </div>

                    <!-- Pilates Machine en petit groupe -->
                    <div class="mp-profile-card mp-profile-sage-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="9" width="18" height="6" rx="1"/>
                                <path d="M3 12h18"/>
                                <circle cx="6" cy="12" r="1.5"/>
                                <circle cx="18" cy="12" r="1.5"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Pilates Machine en petit groupe</h3>
                        <p>Cours collectif sur Reformer et appareils, en groupe restreint. Le travail ciblé des appareils combiné à la dynamique d'un petit collectif, à un tarif accessible.</p>
                        <p class="mp-profile-price">À partir de 27 € la séance</p>
                    </div>

                    <!-- Cours privé -->
                    <div class="mp-profile-card mp-profile-rose-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="22" r="8" fill="none"/>
                                <circle cx="12" cy="8" r="5" fill="none"/>
                                <path d="M12 13v3"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Cours privé sur appareils</h3>
                        <p>Reformer, Cadillac, Wunda Chair… Une séance entièrement dédiée à vos besoins, idéale pour un travail ciblé : dos, posture, reprise après une douleur ou préparation sportive.</p>
                        <p class="mp-profile-price">À partir de 55 € la séance</p>
                    </div>

                    <!-- Cours découverte -->
                    <div class="mp-profile-card mp-profile-warm-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Séance découverte</h3>
                        <p>Vous n'avez jamais essayé le Pilates ? Venez découvrir la méthode lors d'une première séance, sans engagement. L'occasion de voir si le studio et l'approche vous correspondent.</p>
                        <p class="mp-profile-price">Contactez-nous pour réserver</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 : POURQUOI CHOISIR MON PILATES -->
        <section class="mp-section mp-section-benefits">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Pourquoi choisir Mon Pilates quand on vit à Lorient ?</h2>

                <div class="mp-benefits-grid">
                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Enseignante certifiée FPMP</h3>
                        <p>Violette est diplômée de la Fédération des Professionnels de la Méthode Pilates, certification de référence en France. Une formation exigeante, gage d'un enseignement précis et sécurisant.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Un cadre unique face à la mer</h3>
                        <p>Le studio baigne dans la lumière naturelle et offre une vue sur l'océan. Pratiquer ici, c'est s'accorder une vraie coupure avec le quotidien lorientais.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Des horaires pensés pour les actifs</h3>
                        <p>Des créneaux le matin, à midi et en soirée, compatibles avec la vie professionnelle à Lorient. Et le samedi matin pour ceux qui préfèrent le week-end.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section">
            <blockquote class="mp-quote-box">
                <p>"Je vis à Lorient et je viens au studio chaque semaine. Le trajet fait partie du rituel : on laisse la ville, on arrive face à la mer, et on respire."</p>
            </blockquote>
        </section>

        <!-- SECTION 4 : FAQ LOCALE -->
        <section class="mp-section mp-section-faq">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Questions fréquentes — Pilates à Lorient</h2>

                <div class="mp-faq-list">
                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Combien de temps faut-il pour venir de Lorient au studio ?</summary>
                        <div class="mp-faq-answer">
                            <p>Le studio Mon Pilates se trouve à Larmor-Plage, à environ 10 minutes en voiture depuis le centre de Lorient. L'accès est direct par la D29. Un parking gratuit est disponible à proximité. Vous pouvez aussi venir en bus (ligne T2) ou à vélo par la piste cyclable.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Faut-il avoir déjà pratiqué le Pilates pour s'inscrire ?</summary>
                        <div class="mp-faq-answer">
                            <p>Non, aucune expérience préalable n'est nécessaire. Les cours en petit groupe (5 personnes maximum) permettent d'adapter chaque exercice à votre niveau. Les débutants sont accueillis avec écoute et attention dès la première séance.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Quels sont les tarifs des cours de Pilates près de Lorient ?</summary>
                        <div class="mp-faq-answer">
                            <p>Trois formats, trois gammes de prix : <strong>Pilates Tapis en petit groupe</strong> à partir de 17 € la séance, <strong>Pilates Machine en petit groupe</strong> à partir de 27 € la séance et <strong>cours privé sur appareils</strong> à partir de 55 € la séance. Des cartes de plusieurs séances sont disponibles pour un tarif encore plus avantageux. Consultez notre <a href="<?php echo esc_url(home_url('/cours-de-pilates-larmor-plage-tarifs/')); ?>">page tarifs</a> pour tous les détails.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Quelle est la différence entre les cours collectifs et le cours privé ?</summary>
                        <div class="mp-faq-answer">
                            <p>Le studio propose deux formats <strong>collectifs</strong> en petit groupe de 5 personnes : <em>Pilates Tapis</em> (au sol avec petit matériel) et <em>Pilates Machine</em> (sur Reformer et appareils). Tous deux sont conviviaux et motivants. Le <strong>cours privé</strong> est une séance individuelle sur appareils, entièrement personnalisée selon vos besoins — idéale pour un objectif précis ou une rééducation. Découvrez nos <a href="<?php echo esc_url(home_url('/les-seances/')); ?>">différentes formules</a>.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Peut-on offrir des cours de Pilates en cadeau ?</summary>
                        <div class="mp-faq-answer">
                            <p>Oui ! Nous proposons des <a href="<?php echo esc_url(mp_get_gift_card_url()); ?>">cartes cadeaux</a> pour offrir une ou plusieurs séances de Pilates. Un cadeau original pour un proche qui habite Lorient, Larmor-Plage ou les environs.</p>
                        </div>
                    </details>
                </div>
            </div>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Prêt à essayer le Pilates depuis Lorient ?</h2>
                <p class="mp-cta-text">
                    Réservez votre première séance en ligne ou contactez-nous pour en savoir plus.<br>
                    Le studio vous attend à 10 minutes de Lorient, face à l'océan.
                </p>
                <p class="mp-cta-reassurance">Première séance découverte possible — Studio Mon Pilates, 14 Boulevard des Dunes, Larmor-Plage</p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Réserver une séance</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </a>
                    <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-btn mp-btn-secondary">
                        <span>Nous contacter</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>

    </div>

</div>

<!-- Schema.org FAQPage – SEO local Lorient -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Combien de temps faut-il pour venir de Lorient au studio ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le studio Mon Pilates se trouve à Larmor-Plage, à environ 10 minutes en voiture depuis le centre de Lorient. L'accès est direct par la D29. Un parking gratuit est disponible à proximité. Vous pouvez aussi venir en bus (ligne T2) ou à vélo par la piste cyclable."
            }
        },
        {
            "@type": "Question",
            "name": "Faut-il avoir déjà pratiqué le Pilates pour s'inscrire ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Non, aucune expérience préalable n'est nécessaire. Les cours en petit groupe (5 personnes maximum) permettent d'adapter chaque exercice à votre niveau. Les débutants sont accueillis avec écoute et attention dès la première séance."
            }
        },
        {
            "@type": "Question",
            "name": "Quels sont les tarifs des cours de Pilates près de Lorient ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trois formats, trois gammes de prix : Pilates Tapis en petit groupe à partir de 17 € la séance, Pilates Machine en petit groupe à partir de 27 € la séance et cours privé sur appareils à partir de 55 € la séance. Des cartes de plusieurs séances sont disponibles pour un tarif encore plus avantageux."
            }
        },
        {
            "@type": "Question",
            "name": "Quelle est la différence entre les cours collectifs et le cours privé ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le studio propose deux formats collectifs en petit groupe de 5 personnes : Pilates Tapis (au sol avec petit matériel) et Pilates Machine (sur Reformer et appareils). Le cours privé est une séance individuelle sur appareils, entièrement personnalisée selon vos besoins, idéale pour un objectif précis ou une rééducation."
            }
        },
        {
            "@type": "Question",
            "name": "Peut-on offrir des cours de Pilates en cadeau ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui ! Mon Pilates propose des cartes cadeaux pour offrir une ou plusieurs séances de Pilates. Un cadeau original pour un proche qui habite Lorient, Larmor-Plage ou les environs."
            }
        }
    ]
}
</script>

<?php get_footer(); ?>
