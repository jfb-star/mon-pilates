<?php
/**
 * Template Name: Séances individuelles
 *
 * Template pour la page présentant les séances individuelles
 * Design UX premium, intime et rassurant
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-individuel-page mp-seances-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-individuel">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <circle cx="28" cy="22" r="8" fill="#7fa8b6" opacity="0.3"/>
                    <path d="M28 32c-6 0-12 4-12 10h24c0-6-6-10-12-10z" fill="#7fa8b6" opacity="0.2"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Cours privés de Pilates à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Une séance sur appareils Pilates pour travailler avec précision, dans un cadre calme et avec un accompagnement entièrement personnalisé.<br>
                Vous avancez selon vos possibilités, sur des mouvements choisis pour votre corps et votre objectif du jour.
            </p>
            <p class="mp-hero-badge">En individuel ou à deux — <a href="#cours-duo">découvrir la séance duo</a></p>
            <p class="mp-hero-hint">Prenez quelques minutes pour découvrir si cette approche est faite pour vous.</p>
        </div>
    </section>

    <!-- HERO PHOTO + INFO PLEIN AIR -->
    <section class="mp-hero-photo">
        <div class="mp-hero-photo-frame">
            <?php
            echo wp_get_attachment_image( 2261, 'full', false, [
                'loading'  => 'eager',
                'decoding' => 'async',
                'fetchpriority' => 'high',
            ] );
            ?>
        </div>
        <div class="mp-plein-air-note">
            <span class="mp-plein-air-note-icon" aria-hidden="true">☀️</span>
            <p><strong>Cours en plein air dès que la météo le permet</strong> — au bord de la piscine, face à la mer. Pensez à votre casquette et à vos lunettes de soleil.</p>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION 1 : À QUI S'ADRESSE UNE SÉANCE INDIVIDUELLE -->
        <section class="mp-section mp-section-profiles">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <h2 class="mp-section-title">Le cours privé est particulièrement adapté si vous souhaitez…</h2>
                    <p class="mp-section-intro">Certaines situations demandent une attention plus précise que ce qu'un cours collectif peut offrir. La séance individuelle est faite pour ça.</p>
                </div>

                <div class="mp-profiles-grid">
                    <!-- Profil 1 : Reprise -->
                    <div class="mp-profile-card mp-profile-blue-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Reprendre après une douleur, une blessure ou un arrêt</h3>
                        <p>On commence là où vous en êtes aujourd'hui, pas là où vous étiez avant. Mouvements adaptés, progression progressive, dans un cadre sécurisant.</p>
                    </div>

                    <!-- Profil 2 : Objectif précis -->
                    <div class="mp-profile-card mp-profile-rose-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Travailler un objectif précis</h3>
                        <p>Dos, posture, mobilité, respiration, préparation sportive, post-grossesse… La séance est construite autour de votre besoin concret du moment.</p>
                    </div>

                    <!-- Profil 3 : Découvrir les appareils -->
                    <div class="mp-profile-card mp-profile-warm-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Découvrir les appareils Pilates</h3>
                        <p>Reformer, Cadillac, Wunda Chair… Une approche complète, expliquée pas à pas. Toute mon attention est centrée sur vos sensations et votre alignement.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 2 : DÉROULEMENT D'UNE SÉANCE -->
        <section class="mp-section mp-section-steps mp-section-alt">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Une heure pour vous, étape par étape</h2>

                <div class="mp-steps-timeline">
                    <!-- Étape 1 -->
                    <div class="mp-timeline-step">
                        <div class="mp-timeline-marker">
                            <span class="mp-timeline-number">1</span>
                        </div>
                        <div class="mp-timeline-content">
                            <h3 class="mp-timeline-title">L'accueil</h3>
                            <p>Avant même de commencer, on échange. Comment vous sentez-vous aujourd'hui ? Y a-t-il une zone tendue à éviter, un objectif à privilégier ? Ce moment me permet d'adapter la séance à votre état du jour, pas à un programme préétabli.</p>
                        </div>
                    </div>

                    <!-- Étape 2 -->
                    <div class="mp-timeline-step">
                        <div class="mp-timeline-marker">
                            <span class="mp-timeline-number">2</span>
                        </div>
                        <div class="mp-timeline-content">
                            <h3 class="mp-timeline-title">Des mouvements pensés pour vous</h3>
                            <p>Chaque exercice est choisi en fonction de vos besoins. Pas de programme figé : si quelque chose ne convient pas, on ajuste. L'idée, c'est que vous vous sentiez bien dans chaque mouvement.</p>
                        </div>
                    </div>

                    <!-- Étape 3 -->
                    <div class="mp-timeline-step">
                        <div class="mp-timeline-marker">
                            <span class="mp-timeline-number">3</span>
                        </div>
                        <div class="mp-timeline-content">
                            <h3 class="mp-timeline-title">Un accompagnement attentif</h3>
                            <p>Je reste présente tout au long de la séance. Je guide, je corrige doucement, je m'assure que vous êtes à l'aise. Vous pouvez poser des questions, faire des pauses, prendre votre temps.</p>
                        </div>
                    </div>

                    <!-- Étape 4 -->
                    <div class="mp-timeline-step">
                        <div class="mp-timeline-marker">
                            <span class="mp-timeline-number">4</span>
                        </div>
                        <div class="mp-timeline-content">
                            <h3 class="mp-timeline-title">La fin de séance</h3>
                            <p>On termine en douceur, avec quelques instants pour respirer et relâcher. C'est aussi un moment pour faire le point : comment vous sentez-vous ? Qu'est-ce qui vous a fait du bien ?</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 : POURQUOI CHOISIR L'INDIVIDUEL -->
        <section class="mp-section mp-section-benefits">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Ce que l'individuel vous apporte</h2>

                <div class="mp-benefits-grid">
                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Une attention totale</h3>
                        <p>Pas de distraction, pas de groupe à gérer. Je peux observer chaque mouvement, ajuster en temps réel, vous accompagner sur les détails qui font la différence.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Une progression sur-mesure</h3>
                        <p>Vous travaillez sur ce qui compte pour vous, sans suivre le tempo des autres. Selon vos possibilités du jour, avec le temps nécessaire pour bien faire.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Un cadre intimiste</h3>
                        <p>Certaines personnes ont besoin d'un espace privé pour se sentir à l'aise — surtout après une blessure, pendant une grossesse, ou simplement pour s'autoriser un moment sans regard extérieur.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section">
            <blockquote class="mp-quote-box">
                <p>"En individuel, on ne vient pas pour être performant. On vient pour être écouté."</p>
            </blockquote>
        </section>

        <!-- SECTION IMAGE -->
        <section class="mp-section mp-section-image-full">
            <figure class="mp-full-image">
                <img
                    src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                    alt="Séance individuelle de Pilates sur Reformer avec Violette, instructrice à Larmor-Plage"
                    loading="lazy"
                    decoding="async"
                >
            </figure>
        </section>

        <!-- SECTION DUO -->
        <section class="mp-section mp-section-duo mp-section-alt" id="cours-duo">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <span class="mp-section-eyebrow">Nouveau</span>
                    <h2 class="mp-section-title">Le cours duo : à deux, sur les appareils</h2>
                    <p class="mp-section-intro">Vous préférez ne pas venir seul·e ? La séance duo reprend tout ce qui fait un cours privé — les appareils, l'attention portée à chaque mouvement, l'adaptation à votre corps — mais à deux. Le tarif est partagé, et il y a quelqu'un à côté de vous.</p>
                </div>

                <div class="mp-benefits-grid">
                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <circle cx="9" cy="8" r="3.5"/>
                                <circle cx="16.5" cy="8" r="3.5"/>
                                <path d="M2.5 20v-1.5A4 4 0 016.5 15h5"/>
                                <path d="M13 20v-1.5A4 4 0 0117 15h.5a4 4 0 014 3.5V20"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">À deux, à votre rythme</h3>
                        <p>En couple, entre amies, parent et enfant adulte… On travaille en alternance et en parallèle sur les appareils, chacun avec ses réglages et ses adaptations. Personne ne suit le tempo de l'autre.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M12 2v20"/>
                                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Un tarif partagé</h3>
                        <p>80&nbsp;€ la séance pour deux, soit 40&nbsp;€ par personne. C'est la façon la plus accessible de bénéficier d'un accompagnement sur appareils, sans passer en cours collectif.</p>
                    </div>

                    <div class="mp-benefit-card">
                        <div class="mp-benefit-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <path d="M9 12l2 2 4-4"/>
                            </svg>
                        </div>
                        <h3 class="mp-benefit-title">Rassurant pour débuter</h3>
                        <p>Franchir la porte d'un studio pour la première fois est plus simple accompagné. Le duo est souvent le bon compromis entre l'intimité du privé et la convivialité du groupe.</p>
                    </div>
                </div>

                <div class="mp-duo-offer">
                    <div class="mp-duo-offer-price">
                        <span class="mp-duo-offer-amount">80&nbsp;€</span>
                        <span class="mp-duo-offer-unit">la séance de 55 min à 1 h, pour deux personnes</span>
                        <span class="mp-duo-offer-per">soit 40&nbsp;€ par personne — carte valable 3&nbsp;mois</span>
                    </div>
                    <div class="mp-duo-offer-action">
                        <a href="https://backoffice.bsport.io/customer/payment/pass/779204/?membership=3023&force=true" class="mp-btn mp-btn-primary" target="_blank" rel="noopener">
                            <span>Acheter une séance duo</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                        <p class="mp-duo-offer-note">Une seule personne achète pour les deux. Ensuite, <a href="<?php echo esc_url(mp_get_contact_url()); ?>">écrivez-moi</a> et on cale ensemble le créneau qui vous arrange à tous les deux.</p>
                    </div>
                </div>

                <p class="mp-snapshot-cta-text">
                    <a href="<?php echo esc_url(home_url('/cours-de-pilates-larmor-plage-tarifs/')); ?>">Voir tous les tarifs et formules →</a>
                </p>
            </div>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Envie d'essayer ?</h2>
                <p class="mp-cta-text">
                    Réservez un créneau directement, ou écrivez-moi pour en parler avant de vous engager.
                </p>
                <p class="mp-cta-reassurance">Première séance découverte possible, seul·e ou <a href="#cours-duo">à deux en duo</a> — Studio de Pilates à Larmor-Plage, à 10 min de <a href="<?php echo esc_url(home_url('/pilates-lorient/')); ?>">Lorient</a></p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Réserver une séance individuelle</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </a>
                    <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-btn mp-btn-secondary">
                        <span>Échanger avant de réserver</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                    </a>
                </div>
                <p class="mp-cta-alternative">
                    <a href="<?php echo esc_url(mp_get_seances_machine_url()); ?>">Voir aussi le Pilates Machine en petit groupe</a>
                    &nbsp;·&nbsp;
                    <a href="<?php echo esc_url(mp_get_seances_groupe_url()); ?>">ou le Pilates Tapis</a>
                </p>
            </div>
        </section>

    </div>

</div>

<?php get_footer(); ?>
