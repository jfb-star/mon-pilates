<?php
/**
 * Template Name: Comment se passe une séance
 *
 * Template personnalisé pour la page "Comment se passe une séance"
 * Design UX premium, parcours visuel étape par étape
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-seance-page">

    <!-- HERO SECTION -->
    <section class="mp-seance-hero">
        <div class="mp-seance-hero-inner">
            <div class="mp-seance-hero-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <path d="M24 12c-2 4-6 6-6 12s4 8 6 12c2-4 6-6 6-12s-4-8-6-12z" fill="#7fa8b6" opacity="0.3"/>
                    <circle cx="24" cy="24" r="4" fill="#7fa8b6"/>
                </svg>
            </div>
            <h1 class="mp-seance-title">Comment se passe une séance de Pilates à Larmor-Plage ?</h1>
            <p class="mp-seance-subtitle">
                Vous n'avez jamais fait de Pilates ? C'est tout à fait normal de se poser des questions avant de pousser la porte d'un studio. Voici comment se déroule une séance chez Mon Pilates, dans notre studio face à la mer.
            </p>
        </div>
    </section>

    <!-- TIMELINE : PARCOURS DE LA SÉANCE -->
    <div class="mp-seance-container">

        <!-- ÉTAPE 1 : L'ACCUEIL -->
        <section class="mp-seance-step mp-seance-step-1">
            <div class="mp-seance-step-inner">
                <div class="mp-seance-step-content">
                    <div class="mp-seance-step-marker">
                        <span class="mp-step-number">1</span>
                        <span class="mp-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7-.7.7M12 6a6 6 0 100 12 6 6 0 000-12z"/>
                            </svg>
                        </span>
                    </div>
                    <div class="mp-seance-step-text">
                        <h2 class="mp-step-title">L'accueil</h2>
                        <p>Quand vous arrivez, je prends le temps de vous accueillir. On échange quelques mots sur comment vous vous sentez, si c'est votre première fois ou si quelque chose vous préoccupe.</p>
                        <p class="mp-step-highlight">Ici, pas de pression. Notre studio de Larmor-Plage est calme, lumineux, avec la mer juste en face. C'est un espace pensé pour vous mettre à l'aise dès les premières minutes. Accessible depuis Lorient, Ploemeur et tout le bassin lorientais.</p>
                    </div>
                </div>
                <div class="mp-seance-step-visual">
                    <figure class="mp-step-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2026/02/seance-accueil.jpg')); ?>"
                            alt="Accueil chaleureux au studio Mon Pilates à Larmor-Plage face à la mer"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- ÉTAPE 2 : LA SÉANCE -->
        <section class="mp-seance-step mp-seance-step-2 mp-seance-step-reverse">
            <div class="mp-seance-step-inner">
                <div class="mp-seance-step-content">
                    <div class="mp-seance-step-marker">
                        <span class="mp-step-number">2</span>
                        <span class="mp-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="5" r="2"/>
                                <path d="M12 7v5m-4 3l4-3 4 3m-8 2l4 4 4-4"/>
                            </svg>
                        </span>
                    </div>
                    <div class="mp-seance-step-text">
                        <h2 class="mp-step-title">La séance</h2>
                        <p>On commence doucement. Chaque mouvement est expliqué simplement, sans vocabulaire compliqué. Vous êtes guidé pas à pas, à votre rythme.</p>
                        <p>Il n'y a pas de bonne ou de mauvaise performance. L'idée, c'est d'écouter votre corps et de bouger en conscience.</p>
                        <p class="mp-step-reassurance">Vous pouvez à tout moment me dire si quelque chose ne vous convient pas. Que vous soyez débutant ou plus expérimenté, les exercices s'adaptent à vous.</p>
                    </div>
                </div>
                <div class="mp-seance-step-visual">
                    <figure class="mp-step-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2026/02/seance-mouvement.png')); ?>"
                            alt="Mouvement Pilates guidé en douceur au studio de Larmor-Plage"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- ÉTAPE 3 : L'ACCOMPAGNEMENT -->
        <section class="mp-seance-step mp-seance-step-3">
            <div class="mp-seance-step-inner">
                <div class="mp-seance-step-content">
                    <div class="mp-seance-step-marker">
                        <span class="mp-step-number">3</span>
                        <span class="mp-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </span>
                    </div>
                    <div class="mp-seance-step-text">
                        <h2 class="mp-step-title">L'accompagnement</h2>
                        <p>Je reste attentive tout au long de la séance. Si un mouvement ne convient pas, on ajuste ensemble. Si vous avez besoin d'une pause, vous la prenez.</p>
                        <p class="mp-step-highlight">Mon rôle, c'est de vous accompagner avec bienveillance, pas de vous pousser au-delà de vos limites. Chaque personne avance différemment, et c'est très bien comme ça.</p>
                    </div>
                </div>
                <div class="mp-seance-step-visual">
                    <figure class="mp-step-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                            alt="Accompagnement personnalisé pendant la séance"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION / RÉASSURANCE (après L'accompagnement) -->
        <section class="mp-seance-quote mp-seance-quote-compact">
            <blockquote class="mp-quote-box">
                <p>"Chaque personne avance différemment, et c'est très bien comme ça."</p>
            </blockquote>
        </section>

        <!-- ÉTAPE 4 : LA FIN DE SÉANCE -->
        <section class="mp-seance-step mp-seance-step-4 mp-seance-step-reverse">
            <div class="mp-seance-step-inner">
                <div class="mp-seance-step-content">
                    <div class="mp-seance-step-marker">
                        <span class="mp-step-number">4</span>
                        <span class="mp-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </span>
                    </div>
                    <div class="mp-seance-step-text">
                        <h2 class="mp-step-title">La fin de séance</h2>
                        <p>On termine en douceur, avec quelques instants pour respirer et relâcher les tensions.</p>
                        <p class="mp-step-result">Beaucoup repartent avec une sensation de légèreté et de calme. Je reste disponible pour répondre à vos questions et, si vous le souhaitez, on voit ensemble la suite.</p>
                    </div>
                </div>
                <div class="mp-seance-step-visual">
                    <figure class="mp-step-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2026/02/seance-relaxation.jpg')); ?>"
                            alt="Moment de détente et relaxation en fin de séance Pilates à Larmor-Plage"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-seance-cta">
            <div class="mp-seance-cta-inner">
                <h2 class="mp-cta-title">Envie d'essayer ?</h2>
                <p class="mp-cta-text">
                    Si vous hésitez encore, vous pouvez m'écrire simplement, sans engagement.<br>
                    Je vous répondrai avec plaisir.
                </p>
                <p class="mp-cta-reassurance">Séances accessibles à tous les niveaux – aucune expérience requise</p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Me poser une question</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                    </a>
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-secondary">
                        <span>Découvrir le planning</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>

    </div>

</div>

<?php get_footer(); ?>
