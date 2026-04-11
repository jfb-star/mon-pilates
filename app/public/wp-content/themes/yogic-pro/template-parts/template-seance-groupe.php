<?php
/**
 * Template Name: Séances en petit groupe
 *
 * Template pour la page présentant les séances en petit groupe
 * Design UX premium, convivial et chaleureux
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-groupe-page mp-seances-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-groupe">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <circle cx="18" cy="24" r="5" fill="#7fa8b6" opacity="0.25"/>
                    <circle cx="38" cy="24" r="5" fill="#7fa8b6" opacity="0.25"/>
                    <circle cx="28" cy="36" r="5" fill="#7fa8b6" opacity="0.25"/>
                    <path d="M18 24L28 36L38 24" stroke="#7fa8b6" stroke-width="1.5" fill="none" opacity="0.5"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Cours de Pilates en petit groupe à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Ensemble, mais chacun à son rythme. Les séances en petit groupe, c'est le meilleur des deux mondes : l'énergie d'un collectif, avec l'attention d'un accompagnement personnalisé. Ici, on ne se compare pas — on avance côte à côte.
            </p>
            <p class="mp-hero-badge">5 personnes maximum par séance</p>
            <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-outline mp-hero-cta">
                <span>Voir les créneaux disponibles</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION 1 : L'ESPRIT DES SÉANCES EN PETIT GROUPE -->
        <section class="mp-section mp-section-esprit">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <h2 class="mp-section-title">L'esprit des séances en petit groupe</h2>
                    <p class="mp-section-intro">Oubliez l'image du cours collectif anonyme où l'on se perd dans la masse. Chez Mon Pilates, les groupes sont volontairement réduits pour que chacun·e puisse être vu·e, accompagné·e, corrigé·e.</p>
                </div>

                <div class="mp-values-grid">
                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">Des groupes réduits</h3>
                        <p>Maximum 6 personnes par séance. C'est peu — et c'est voulu. Ce nombre permet de garder une vraie qualité d'accompagnement, tout en profitant d'une dynamique de groupe.</p>
                    </div>

                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">Une ambiance conviviale</h3>
                        <p>Beaucoup de personnes reviennent pour l'ambiance autant que pour la pratique. On se retrouve, on échange quelques mots, on partage un moment. Sans compétition, sans jugement.</p>
                    </div>

                    <div class="mp-value-card">
                        <div class="mp-value-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <h3 class="mp-value-title">Le respect du rythme de chacun</h3>
                        <p>Même en groupe, personne n'est laissé de côté. Je propose des variantes, j'adapte les exercices, je veille à ce que tout le monde se sente à sa place.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION IMAGE -->
        <section class="mp-section mp-section-image-ambiance">
            <figure class="mp-ambiance-image">
                <img
                    src="<?php echo esc_url(content_url('/uploads/2026/02/seance-relaxation.jpg')); ?>"
                    alt="Séance de Pilates en petit groupe au studio Mon Pilates à Larmor-Plage"
                    loading="lazy"
                    decoding="async"
                >
            </figure>
        </section>

        <!-- SECTION 2 : POUR QUI SONT CES SÉANCES -->
        <section class="mp-section mp-section-profiles mp-section-alt">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Ces séances sont faites pour vous si...</h2>

                <!-- Phrase anti-objection directe -->
                <p class="mp-direct-reassurance">Vous n'avez pas besoin d'avoir déjà pratiqué pour venir en petit groupe.</p>

                <div class="mp-profiles-grid mp-profiles-groupe">
                    <!-- Profil 1 -->
                    <div class="mp-profile-card mp-profile-blue-soft">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous aimez apprendre entouré·e ?</h3>
                        <p>Le groupe rassure. On voit que les autres aussi tâtonnent, cherchent, progressent. Et on avance ensemble.</p>
                    </div>

                    <!-- Profil 2 -->
                    <div class="mp-profile-card mp-profile-rose-soft">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous cherchez un rendez-vous régulier ?</h3>
                        <p>Les séances en groupe créent un rituel. Un créneau dans la semaine où l'on sait qu'on va bouger, respirer, se faire du bien.</p>
                    </div>

                    <!-- Profil 3 -->
                    <div class="mp-profile-card mp-profile-warm-soft">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Vous aimez l'énergie collective, sans l'anonymat ?</h3>
                        <p>Ici, le groupe est petit, l'attention est réelle, et vous restez une personne — pas un numéro.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 : DÉROULEMENT D'UNE SÉANCE -->
        <section class="mp-section mp-section-deroulement">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Une séance pensée pour le collectif... et pour vous</h2>

                <div class="mp-deroulement-grid">
                    <!-- Étape 1 -->
                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">1</div>
                        <h3 class="mp-deroulement-title">L'accueil</h3>
                        <p>On prend le temps de se retrouver. Quelques mots échangés, un moment pour s'installer. La séance ne commence pas dans la précipitation.</p>
                    </div>

                    <!-- Étape 2 -->
                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">2</div>
                        <h3 class="mp-deroulement-title">Des exercices adaptés à tous les niveaux</h3>
                        <p>Les mouvements sont proposés avec des variantes. Que vous soyez débutant·e ou plus à l'aise, vous trouverez votre version de chaque exercice.</p>
                    </div>

                    <!-- Étape 3 -->
                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">3</div>
                        <h3 class="mp-deroulement-title">Des corrections individualisées</h3>
                        <p>Même en groupe, je passe auprès de chacun·e. Je corrige une posture, je suggère un ajustement, je m'assure que vous êtes bien installé·e dans le mouvement.</p>
                    </div>

                    <!-- Étape 4 -->
                    <div class="mp-deroulement-card">
                        <div class="mp-deroulement-number">4</div>
                        <h3 class="mp-deroulement-title">La fin de séance</h3>
                        <p>On termine ensemble, dans le calme. Un moment de respiration, de relâchement. Et souvent, quelques sourires échangés avant de repartir.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section mp-quote-groupe">
            <blockquote class="mp-quote-box">
                <p>"Le groupe, ici, ce n'est pas une foule. C'est un petit cercle où chacun a sa place."</p>
            </blockquote>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Envie de rejoindre un groupe ?</h2>
                <p class="mp-cta-text">
                    Consultez le planning pour voir les créneaux en petit groupe.<br>
                    Et si vous avez une question, n'hésitez pas à m'écrire.
                </p>
                <p class="mp-cta-reassurance">Séances accessibles à tous les niveaux – débutants bienvenus<br>Studio face à la mer à Larmor-Plage, accessible depuis <a href="<?php echo esc_url(home_url('/pilates-lorient/')); ?>">Lorient</a> (10 min), <a href="<?php echo esc_url(home_url('/pilates-ploemeur/')); ?>">Ploemeur</a> (5 min) et Guidel</p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Voir les créneaux en petit groupe</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </a>
                    <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-btn mp-btn-secondary">
                        <span>Me poser une question</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                    </a>
                </div>
                <p class="mp-cta-alternative">
                    <a href="<?php echo esc_url(mp_get_seances_individuelles_url()); ?>">Vous hésitez entre individuel et petit groupe ?</a>
                </p>
            </div>
        </section>

    </div>

</div>

<?php get_footer(); ?>
