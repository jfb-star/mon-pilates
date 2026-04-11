<?php
/**
 * Template Name: Pour qui est le Pilates
 *
 * Template pour la page expliquant à qui s'adresse le Pilates
 * Design UX inclusif, rassurant et bienveillant
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-pourqui-page mp-premium-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-warm">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <circle cx="20" cy="24" r="4" fill="#7fa8b6" opacity="0.3"/>
                    <circle cx="36" cy="24" r="4" fill="#7fa8b6" opacity="0.3"/>
                    <circle cx="28" cy="36" r="4" fill="#7fa8b6" opacity="0.3"/>
                    <path d="M20 24L28 36L36 24" stroke="#7fa8b6" stroke-width="1.5" fill="none"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Le Pilates, c'est pour qui ? Cours adaptés à Larmor-Plage</h1>
            <p class="mp-hero-subtitle">
                Peu importe votre âge, votre forme physique ou votre expérience. Si vous avez envie de bouger en douceur et de prendre soin de vous, vous êtes au bon endroit. Chez Mon Pilates à Larmor-Plage, chacun est le bienvenu.
            </p>
        </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="mp-content-container">

        <!-- SECTION INTRO -->
        <section class="mp-section mp-section-intro">
            <div class="mp-section-inner mp-section-centered">
                <p class="mp-intro-text">Beaucoup de personnes hésitent avant de pousser la porte d'un studio. Peur de ne pas être à la hauteur, de ne pas savoir faire, de se sentir jugé. Ces craintes sont normales — et ici, elles n'ont pas lieu d'être.</p>
                <p class="mp-intro-text">Chez Mon Pilates à Larmor-Plage, chaque personne est accueillie telle qu'elle est. Il n'y a pas de niveau minimum requis, pas de condition physique idéale. Juste l'envie d'essayer. Que vous habitiez à <a href="<?php echo esc_url(home_url('/pilates-lorient/')); ?>">Lorient</a>, <a href="<?php echo esc_url(home_url('/pilates-ploemeur/')); ?>">Ploemeur</a> ou Guidel, vous êtes les bienvenus dans notre studio face à la mer.</p>
            </div>
        </section>

        <!-- BLOC 1 : DÉBUTANTS -->
        <section class="mp-profile-section">
            <div class="mp-profile-card mp-profile-blue">
                <div class="mp-profile-header">
                    <div class="mp-profile-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </div>
                    <h2 class="mp-profile-title">Vous débutez complètement ?</h2>
                </div>

                <div class="mp-profile-content">
                    <div class="mp-profile-feelings">
                        <h3 class="mp-feelings-label">Ce que vous pouvez ressentir :</h3>
                        <ul class="mp-feelings-list">
                            <li>"Je ne connais rien au Pilates."</li>
                            <li>"J'ai peur de mal faire."</li>
                            <li>"Je ne suis pas souple / pas sportif·ve."</li>
                        </ul>
                    </div>

                    <div class="mp-profile-experience">
                        <h3 class="mp-experience-label">Ce que vous allez vivre ici :</h3>
                        <p>Chaque mouvement est expliqué simplement. On prend le temps, on répète, on ajuste. Il n'y a aucune attente de performance. Vous apprenez à écouter votre corps, pas à le forcer.</p>
                    </div>

                    <div class="mp-profile-reassurance">
                        <p><strong>Pourquoi vous êtes à votre place :</strong> Le Pilates a été conçu pour être accessible. Et c'est souvent en partant de zéro qu'on progresse le plus sereinement.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- BLOC 2 : REPRISE -->
        <section class="mp-profile-section">
            <div class="mp-profile-card mp-profile-rose">
                <div class="mp-profile-header">
                    <div class="mp-profile-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 6v6l4 2"/>
                            <path d="M2 12h2M20 12h2M12 2v2M12 20v2" opacity="0.5"/>
                        </svg>
                    </div>
                    <h2 class="mp-profile-title">Vous reprenez doucement ?</h2>
                </div>

                <div class="mp-profile-content">
                    <div class="mp-profile-feelings">
                        <h3 class="mp-feelings-label">Ce que vous pouvez ressentir :</h3>
                        <ul class="mp-feelings-list">
                            <li>"Ça fait longtemps que je n'ai pas bougé."</li>
                            <li>"J'ai eu une blessure / une grossesse / une période difficile."</li>
                            <li>"Je ne sais pas si mon corps peut encore."</li>
                        </ul>
                    </div>

                    <div class="mp-profile-experience">
                        <h3 class="mp-experience-label">Ce que vous allez vivre ici :</h3>
                        <p>On repart de là où vous êtes, pas de là où vous étiez. Chaque séance s'adapte à vos besoins du moment. Vous pouvez aller à votre rythme, faire des pauses, poser des questions.</p>
                    </div>

                    <div class="mp-profile-reassurance">
                        <p><strong>Pourquoi vous êtes à votre place :</strong> Le Pilates est idéal pour se reconnecter à son corps sans le brusquer. Beaucoup de personnes viennent justement pour reprendre en douceur — vous n'êtes pas seul·e.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- BLOC 3 : EXPÉRIMENTÉS -->
        <section class="mp-profile-section">
            <div class="mp-profile-card mp-profile-dark">
                <div class="mp-profile-header">
                    <div class="mp-profile-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
                        </svg>
                    </div>
                    <h2 class="mp-profile-title">Vous avez déjà de l'expérience ?</h2>
                </div>

                <div class="mp-profile-content">
                    <div class="mp-profile-feelings">
                        <h3 class="mp-feelings-label">Ce que vous pouvez ressentir :</h3>
                        <ul class="mp-feelings-list">
                            <li>"Je cherche un studio avec une vraie approche personnalisée."</li>
                            <li>"J'ai envie de progresser sans me faire mal."</li>
                            <li>"Je veux un cadre calme, pas une salle bondée."</li>
                        </ul>
                    </div>

                    <div class="mp-profile-experience">
                        <h3 class="mp-experience-label">Ce que vous allez vivre ici :</h3>
                        <p>Un accompagnement attentif, des ajustements précis, un espace où l'on peut approfondir sa pratique. Le petit nombre de participant·es par séance permet un suivi de qualité.</p>
                    </div>

                    <div class="mp-profile-reassurance">
                        <p><strong>Pourquoi vous êtes à votre place :</strong> Même avec de l'expérience, on apprend toujours. Et avoir un regard extérieur bienveillant aide à affiner les mouvements et à éviter les compensations.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART RÉASSURANCE -->
        <section class="mp-quote-section mp-quote-gradient">
            <div class="mp-quote-box mp-quote-large">
                <p>Quel que soit votre point de départ, vous êtes légitime ici.</p>
                <p class="mp-quote-secondary">Il n'y a pas de bon moment pour commencer — il y a juste le vôtre.</p>
            </div>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Envie d'essayer ?</h2>
                <p class="mp-cta-text">
                    Si vous avez trouvé ce qui vous parle, vous pouvez découvrir les séances proposées.<br>
                    Et si vous hésitez encore, écrivez-moi simplement — on en parle, sans engagement.
                </p>
                <p class="mp-cta-reassurance">Séances accessibles à tous les niveaux – aucune expérience requise</p>
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
