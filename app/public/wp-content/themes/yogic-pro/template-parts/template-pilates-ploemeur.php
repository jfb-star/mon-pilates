<?php
/**
 * Template Name: Pilates Ploemeur
 *
 * Page locale SEO ciblant "pilates ploemeur"
 * Angle : proximité, qualité de vie, bien-être durable, cadre naturel
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-ploemeur-page mp-premium-page">

    <!-- HERO SECTION -->
    <section class="mp-hero mp-hero-warm">
        <div class="mp-hero-inner">
            <div class="mp-hero-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="24" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <path d="M16 36c2-4 6-8 12-8s10 4 12 8" stroke="#7fa8b6" stroke-width="1.5" fill="none" opacity="0.4"/>
                    <path d="M20 32c2-3 4-6 8-6s6 3 8 6" stroke="#7fa8b6" stroke-width="1.5" fill="none" opacity="0.3"/>
                    <circle cx="28" cy="22" r="6" fill="#7fa8b6" opacity="0.2"/>
                    <path d="M28 16v-2M24 18l-2-2M32 18l2-2" stroke="#7fa8b6" stroke-width="1.5" opacity="0.3"/>
                </svg>
            </div>
            <h1 class="mp-hero-title">Pilates à Ploemeur : votre studio à 5 minutes</h1>
            <p class="mp-hero-subtitle">
                Vous vivez à Ploemeur et cherchez un lieu calme pour prendre soin de vous ? Mon Pilates vous accueille à Larmor-Plage, à 5 minutes de chez vous. Un studio lumineux à deux pas de la plage de Toulhars, des cours en petit groupe, en individuel ou en duo, et un accompagnement attentif qui respecte vos possibilités.
            </p>
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

        <!-- SECTION 1 : PROXIMITÉ ET CADRE -->
        <section class="mp-section mp-section-with-image mp-section-reverse">
            <div class="mp-section-inner">
                <div class="mp-section-text">
                    <h2 class="mp-section-title">Un studio de Pilates tout près de Ploemeur</h2>
                    <p>Le studio Mon Pilates est situé au 14 Boulevard des Dunes à Larmor-Plage, à seulement 5 minutes en voiture depuis Ploemeur-centre. Le trajet est rapide et agréable, en longeant la côte.</p>
                    <p>Quand on vit à Ploemeur, on apprécie le calme, la nature, l'espace. Le studio prolonge cette qualité de vie : un lieu lumineux, face à l'océan, où l'on prend le temps de respirer et de bouger sans se presser.</p>
                    <p class="mp-text-emphasis">Pas besoin d'aller loin pour trouver un studio de Pilates de qualité. Il est juste à côté.</p>
                </div>
                <div class="mp-section-visual">
                    <figure class="mp-section-image">
                        <img
                            src="<?php echo esc_url(content_url('/uploads/2025/02/14-Boulevard-des-dunes-56260-Larmor-Plage-Mon-Pilates.jpg')); ?>"
                            alt="Studio Mon Pilates à Larmor-Plage, à 5 minutes de Ploemeur"
                            loading="lazy"
                            decoding="async"
                        >
                    </figure>
                </div>
            </div>
        </section>

        <!-- SECTION 2 : BIEN-ÊTRE DURABLE -->
        <section class="mp-section mp-section-text-only mp-section-alt">
            <div class="mp-section-inner mp-section-centered">
                <div class="mp-section-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7fa8b6" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                </div>
                <h2 class="mp-section-title">Le Pilates, un bien-être qui s'inscrit dans la durée</h2>
                <p>Le Pilates n'est pas un sport de performance. C'est une pratique douce et profonde qui s'intègre naturellement dans votre quotidien. Semaine après semaine, vous gagnez en mobilité, en posture, en confiance corporelle.</p>
                <p>Beaucoup de Ploemeuroises et Ploemeurois viennent au studio pour le mal de dos, les tensions liées au travail sédentaire, ou simplement pour s'accorder un moment de calme dans la semaine. Et ils reviennent parce qu'ils se sentent mieux, durablement.</p>
            </div>
        </section>

        <!-- SECTION 3 : CE QUE NOUS PROPOSONS -->
        <section class="mp-section mp-section-profiles">
            <div class="mp-section-inner">
                <div class="mp-section-header">
                    <h2 class="mp-section-title">Des formules pensées pour votre quotidien</h2>
                    <p class="mp-section-intro">Chaque personne est différente, chaque besoin est unique. C'est pourquoi nous proposons plusieurs formats, tous accessibles aux habitants de Ploemeur.</p>
                </div>

                <div class="mp-profiles-grid">
                    <!-- Petit groupe -->
                    <div class="mp-profile-card mp-profile-blue-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Cours collectifs en petit groupe</h3>
                        <p>En petit groupe restreint, dans une ambiance conviviale : <strong>Pilates Tapis</strong> au sol avec petit matériel (5 personnes max), ou <strong>Pilates Machine</strong> sur Reformer (3 personnes max). Un format chaleureux pour inscrire le mouvement dans sa routine.</p>
                        <a href="<?php echo esc_url(mp_get_seances_groupe_url()); ?>" class="mp-profile-link">En savoir plus sur les séances</a>
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
                        <h3 class="mp-profile-title">Cours privé ou duo sur appareils</h3>
                        <p>Reformer, Cadillac, Wunda Chair... Un accompagnement 100 % personnalisé, seul·e ou à deux avec la <strong>séance duo</strong> (80 € pour deux, soit 40 € par personne). Idéal si vous avez des douleurs, un objectif précis, ou simplement envie d'un moment rien que pour vous.</p>
                        <a href="<?php echo esc_url(mp_get_seances_individuelles_url()); ?>" class="mp-profile-link">Découvrir les cours privés et le duo</a>
                    </div>

                    <!-- Cartes cadeaux -->
                    <div class="mp-profile-card mp-profile-warm-light">
                        <div class="mp-profile-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="8" width="18" height="13" rx="2"/>
                                <path d="M12 8v13M3 12h18"/>
                                <path d="M12 8c-2-3-6-4-6-1s4 1 6 1c2 0 6 2 6-1s-4-2-6 1"/>
                            </svg>
                        </div>
                        <h3 class="mp-profile-title">Cartes cadeaux Pilates</h3>
                        <p>Offrez du bien-être à un proche qui habite Ploemeur ou les environs. Un cadeau original, disponible en ligne, valable pour tous les types de séances.</p>
                        <a href="<?php echo esc_url(mp_get_gift_card_url()); ?>" class="mp-profile-link">Voir les cartes cadeaux</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ENCART CITATION -->
        <section class="mp-quote-section">
            <blockquote class="mp-quote-box">
                <p>"J'habite à Ploemeur et je viens chaque mardi. En cinq minutes je suis au studio, et en une heure je repars transformée. C'est devenu mon rendez-vous de la semaine."</p>
            </blockquote>
        </section>

        <!-- SECTION 4 : FAQ LOCALE -->
        <section class="mp-section mp-section-faq">
            <div class="mp-section-inner">
                <h2 class="mp-section-title mp-section-title-centered">Questions fréquentes — Pilates près de Ploemeur</h2>

                <div class="mp-faq-list">
                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Où se trouve le studio de Pilates le plus proche de Ploemeur ?</summary>
                        <div class="mp-faq-answer">
                            <p>Le studio Mon Pilates est situé au 14 Boulevard des Dunes à Larmor-Plage, à seulement 5 minutes en voiture depuis Ploemeur-centre. C'est le studio de Pilates le plus proche, dans un cadre exceptionnel face à la mer.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Les cours de Pilates sont-ils adaptés aux débutants ?</summary>
                        <div class="mp-faq-answer">
                            <p>Absolument. La majorité des personnes qui nous rejoignent n'ont jamais pratiqué le Pilates. Les cours en petit groupe restreint permettent à l'enseignante d'adapter chaque exercice à votre niveau. Pas de prérequis, pas de condition physique minimum.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Le Pilates peut-il aider pour le mal de dos ?</summary>
                        <div class="mp-faq-answer">
                            <p>Oui, c'est l'une des raisons les plus fréquentes de consultation. Le Pilates renforce les muscles profonds qui soutiennent la colonne vertébrale, améliore la posture et soulage les tensions. En cours <strong>Pilates Machine</strong> (en petit groupe ou en privé), le travail sur appareils permet d'aller encore plus loin, avec un accompagnement précis et adapté à votre dos.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Comment réserver un cours de Pilates depuis Ploemeur ?</summary>
                        <div class="mp-faq-answer">
                            <p>La réservation se fait en ligne via notre <a href="<?php echo esc_url(mp_get_planning_url()); ?>">planning en ligne</a>. Vous pouvez voir les créneaux disponibles et réserver en quelques clics. Pour les séances individuelles et les séances duo, vous pouvez aussi nous <a href="<?php echo esc_url(mp_get_contact_url()); ?>">contacter directement</a> pour convenir d'un créneau.</p>
                        </div>
                    </details>

                    <details class="mp-faq-item">
                        <summary class="mp-faq-question">Quels sont les horaires du studio ?</summary>
                        <div class="mp-faq-answer">
                            <p>Le studio est ouvert du lundi au vendredi de 8h à 20h et le samedi de 9h à 14h. Des créneaux en matinée, à midi et en soirée vous permettent de trouver l'horaire qui convient le mieux à votre emploi du temps.</p>
                        </div>
                    </details>
                </div>
            </div>
        </section>

        <!-- SECTION CTA -->
        <section class="mp-cta-section">
            <div class="mp-cta-inner">
                <h2 class="mp-cta-title">Envie de commencer le Pilates près de Ploemeur ?</h2>
                <p class="mp-cta-text">
                    Réservez votre première séance en quelques clics ou contactez-nous pour en discuter.<br>
                    Le studio est à 5 minutes de Ploemeur, face à l'océan.
                </p>
                <p class="mp-cta-reassurance">Débutants bienvenus — Studio Mon Pilates, 14 Boulevard des Dunes, Larmor-Plage</p>
                <div class="mp-cta-buttons">
                    <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                        <span>Voir le planning</span>
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

<!-- Schema.org FAQPage – SEO local Ploemeur -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Où se trouve le studio de Pilates le plus proche de Ploemeur ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le studio Mon Pilates est situé au 14 Boulevard des Dunes à Larmor-Plage, à seulement 5 minutes en voiture depuis Ploemeur-centre. C'est le studio de Pilates le plus proche, dans un cadre exceptionnel face à la mer."
            }
        },
        {
            "@type": "Question",
            "name": "Les cours de Pilates sont-ils adaptés aux débutants ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolument. La majorité des personnes qui nous rejoignent n'ont jamais pratiqué le Pilates. Les cours en petit groupe restreint permettent à l'enseignante d'adapter chaque exercice à votre niveau. Pas de prérequis, pas de condition physique minimum."
            }
        },
        {
            "@type": "Question",
            "name": "Le Pilates peut-il aider pour le mal de dos ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, c'est l'une des raisons les plus fréquentes de consultation. Le Pilates renforce les muscles profonds qui soutiennent la colonne vertébrale, améliore la posture et soulage les tensions. En cours Pilates Machine (en petit groupe ou en privé), le travail sur appareils permet d'aller encore plus loin, avec un accompagnement précis et adapté à votre dos."
            }
        },
        {
            "@type": "Question",
            "name": "Comment réserver un cours de Pilates depuis Ploemeur ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "La réservation se fait en ligne via le planning en ligne. Vous pouvez voir les créneaux disponibles et réserver en quelques clics. Pour les séances individuelles et les séances duo, vous pouvez aussi contacter directement le studio pour convenir d'un créneau."
            }
        },
        {
            "@type": "Question",
            "name": "Quels sont les horaires du studio ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le studio est ouvert du lundi au vendredi de 8h à 20h et le samedi de 9h à 14h. Des créneaux en matinée, à midi et en soirée vous permettent de trouver l'horaire qui convient le mieux à votre emploi du temps."
            }
        }
    ]
}
</script>

<?php get_footer(); ?>
