<?php
/**
 * Template Name: Le studio & l'accompagnement
 *
 * Template pour la page présentant le studio et l'approche personnalisée
 * Design UX premium, calme et bienveillant
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-studio-page mp-premium-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-soft">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <path d="M28 12c0 8-8 12-8 16s8 8 8 16c0-8 8-12 8-16s-8-8-8-16z" fill="#7fa8b6" opacity="0.2"/>
                    <circle cx="28" cy="28" r="6" fill="#7fa8b6" opacity="0.4"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Notre studio de Pilates face à la mer à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Un espace pensé pour vous. Dans la lumière du matin ou la douceur de l'après-midi, Mon Pilates est un lieu où l'on prend le temps. Le temps de respirer, de bouger, de se retrouver.
            </p>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION 1 : LE LIEU -->
        <section class="mp-section mp-section-with-image">
            <div class="mp-section-inner">
                <div class="mp-section-text">
                    <h2 class="mp-section-title">Un studio face à l'océan</h2>
                    <p>Situé à Larmor-Plage, le studio baigne dans une lumière naturelle tout au long de la journée. Les grandes fenêtres ouvrent sur la mer. L'espace est épuré, chaleureux, pensé pour favoriser la concentration et le lâcher-prise.</p>
                    <p class="mp-text-emphasis">Ici, pas de musique forte ni de miroirs omniprésents. Juste le calme, l'horizon, et l'essentiel.</p>
                </div>
                <div class="mp-section-visual">
                    <figure class="mp-section-image">
                          <img
                            src="<?php echo esc_url(content_url('/uploads/2026/02/interieur-mon-pilates-vue-mer.png')); ?>"
                            alt="Intérieur du studio Mon Pilates à Larmor-Plage avec vue sur la mer"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- SECTION 2 : L'AMBIANCE ET LE RYTHME -->
        <section class="mp-section mp-section-text-only mp-section-alt">
            <div class="mp-section-inner mp-section-centered">
                <div class="mp-section-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                </div>
                <h2 class="mp-section-title">Un rythme qui vous ressemble</h2>
                <p>Chaque séance commence en douceur. On prend le temps de s'installer, de respirer, de se connecter à son corps. Pas de chronomètre, pas de performance à atteindre.</p>
                <p>Le Pilates ici, c'est un moment pour soi. Un espace où l'on peut ralentir sans culpabiliser, et avancer à son propre rythme.</p>
            </div>
        </section>

        <!-- SECTION 3 : L'ACCOMPAGNEMENT PERSONNALISÉ -->
        <section class="mp-section mp-section-with-image mp-section-reverse">
            <div class="mp-section-inner">
                <div class="mp-section-text">
                    <h2 class="mp-section-title">Un accompagnement qui s'adapte à vous</h2>
                    <p>Je m'appelle Violette, et j'ai créé Mon Pilates avec une conviction simple : chaque corps est différent, chaque parcours est unique.</p>
                    <p>Que vous veniez pour la première fois ou que vous pratiquiez depuis des années, je prends le temps de comprendre ce dont vous avez besoin. Ensemble, on ajuste les mouvements, on respecte vos limites, on avance pas à pas.</p>
                    <p class="mp-text-emphasis">Mon rôle n'est pas de vous pousser, mais de vous accompagner avec bienveillance.</p>
                </div>
                <div class="mp-section-visual">
                    <figure class="mp-section-image mp-image-portrait">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                            alt="Violette, fondatrice de Mon Pilates, dans le studio"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section">
            <blockquote class="mp-quote-box">
                <p>"Ici, on ne vient pas pour être parfait. On vient pour se sentir bien."</p>
            </blockquote>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Envie de découvrir le studio ?</h2>
                <p class="mp-cta-text">
                    Vous pouvez simplement me contacter pour en parler, sans engagement.<br>
                    Ou consulter les séances disponibles pour trouver un créneau qui vous convient.
                </p>
                <p class="mp-cta-reassurance">Première séance découverte possible</p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Voir les séances disponibles</span>
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
            </div>
        </section>

    </div>

</div>

<?php get_footer(); ?>
