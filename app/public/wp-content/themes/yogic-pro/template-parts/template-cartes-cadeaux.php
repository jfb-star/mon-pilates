<?php
/**
 * Template Name: Cartes Cadeaux Premium
 *
 * Page cartes cadeaux - Approche émotionnelle et UX premium
 * Design épuré, focus sur l'intention du cadeau
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-gift-page mp-premium-page">

    <!-- ============================================================
         HERO ÉMOTIONNEL
         Connexion immédiate, on vend du temps pour soi
         ============================================================ -->
    <section class="mp-gift-hero">
        <div class="mp-gift-hero__background">
            <div class="mp-gift-hero__overlay"></div>
        </div>
        <div class="mp-gift-hero__content">
            <div class="mp-gift-hero__icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 12v10H4V12"/>
                    <path d="M2 7h20v5H2z"/>
                    <path d="M12 22V7"/>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
            </div>
            <h1 class="mp-gift-hero__title">Cartes cadeaux Pilates à Larmor-Plage</h1>
            <p class="mp-gift-hero__subtitle">
                Offrez un moment de calme. Une pause face à la mer, un cadeau qui fait vraiment du bien.
            </p>
            <a href="#cartes" class="mp-gift-hero__cta">
                <span>Choisir une carte cadeau</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </a>
        </div>
    </section>

    <!-- ============================================================
         POURQUOI OFFRIR UNE CARTE CADEAU
         Lever les freins, montrer l'universalité du cadeau
         ============================================================ -->
    <section class="mp-gift-why">
        <div class="mp-gift-why__inner">
            <h2 class="mp-gift-section-title">Un cadeau différent, un cadeau qui compte</h2>

            <div class="mp-gift-why__grid">
                <!-- Du temps pour soi -->
                <div class="mp-gift-why__card">
                    <div class="mp-gift-why__icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <h3 class="mp-gift-why__title">Du temps pour soi</h3>
                    <p class="mp-gift-why__text">
                        Dans une vie qui va vite, offrir une heure de calme, c'est offrir un vrai luxe.
                        Un moment sans écran, sans to-do list, juste pour respirer.
                    </p>
                </div>

                <!-- Accessible à tous -->
                <div class="mp-gift-why__card">
                    <div class="mp-gift-why__icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <h3 class="mp-gift-why__title">Accessible à tous</h3>
                    <p class="mp-gift-why__text">
                        Pas besoin d'être souple ou sportif. Le Pilates s'adapte à chacun,
                        quel que soit l'âge ou le niveau. Votre proche sera guidé en douceur.
                    </p>
                </div>

                <!-- Un cadeau utile -->
                <div class="mp-gift-why__card">
                    <div class="mp-gift-why__icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="M9 12l2 2 4-4"/>
                        </svg>
                    </div>
                    <h3 class="mp-gift-why__title">Un cadeau utile et durable</h3>
                    <p class="mp-gift-why__text">
                        Pas un objet qu'on range dans un tiroir. Une expérience qui laisse une trace :
                        plus de mobilité, moins de tensions, un corps qui se sent mieux.
                    </p>
                </div>

                <!-- Face à la mer -->
                <div class="mp-gift-why__card">
                    <div class="mp-gift-why__icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M2 12c2-2 4-3 6-3s4 1 6 3 4 3 6 3 4-1 6-3"/>
                            <path d="M2 17c2-2 4-3 6-3s4 1 6 3 4 3 6 3 4-1 6-3"/>
                            <circle cx="12" cy="6" r="3"/>
                        </svg>
                    </div>
                    <h3 class="mp-gift-why__title">Face à la mer, à Larmor-Plage</h3>
                    <p class="mp-gift-why__text">
                        Un studio intimiste avec vue sur l'océan, au 14 Boulevard des Dunes à Larmor-Plage.
                        Le cadre idéal pour se reconnecter à soi, loin de l'agitation. Accessible depuis Lorient, Ploemeur et tout le pays de Lorient.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         LES CARTES CADEAUX
         Intégration WooCommerce avec PDF personnalisé
         ============================================================ -->
    <section class="mp-gift-cards" id="cartes">
        <div class="mp-gift-cards__inner">
            <h2 class="mp-gift-section-title">Trouvez la carte qui lui ressemble</h2>
            <p class="mp-gift-section-subtitle">
                Trois façons d'offrir du bien-être, selon l'envie et l'occasion.
            </p>

            <?php
            // Utiliser le shortcode WooCommerce si le plugin est actif
            if ( function_exists( 'MPGC' ) && class_exists( 'WooCommerce' ) ) {
                echo do_shortcode( '[mpgc_gift_cards]' );
            } else {
                // Fallback vers l'ancien système Bsport
            ?>
            <div class="mp-gift-cards__grid">

                <!-- Carte Découverte -->
                <div class="mp-gift-card">
                    <div class="mp-gift-card__header">
                        <span class="mp-gift-card__label">Pour commencer</span>
                        <h3 class="mp-gift-card__name">Carte Découverte</h3>
                        <p class="mp-gift-card__tagline">Pour éveiller la curiosité</p>
                    </div>
                    <div class="mp-gift-card__body">
                        <p class="mp-gift-card__description">
                            Idéale pour quelqu'un qui n'a jamais essayé le Pilates, ou qui hésite
                            à se lancer. Une première séance en petit groupe, sans engagement,
                            pour découvrir les bienfaits en douceur.
                        </p>
                        <ul class="mp-gift-card__features">
                            <li>1 séance collective en petit groupe</li>
                            <li>Tous niveaux bienvenus</li>
                            <li>Matériel fourni</li>
                        </ul>
                    </div>
                    <div class="mp-gift-card__footer">
                        <div class="mp-gift-card__price">
                            <span class="mp-gift-card__amount">20</span>
                            <span class="mp-gift-card__currency">€</span>
                        </div>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609533/?membership=3023&force=true"
                           class="mp-gift-card__cta" target="_blank" rel="noopener">
                            Offrir cette carte
                        </a>
                        <span class="mp-gift-card__validity">Valable 3 mois après activation</span>
                    </div>
                </div>

                <!-- Carte Bien-Être -->
                <div class="mp-gift-card mp-gift-card--featured">
                    <div class="mp-gift-card__badge">Coup de cœur</div>
                    <div class="mp-gift-card__header">
                        <span class="mp-gift-card__label">Le plus offert</span>
                        <h3 class="mp-gift-card__name">Carte Bien-Être</h3>
                        <p class="mp-gift-card__tagline">Pour prendre une vraie pause</p>
                    </div>
                    <div class="mp-gift-card__body">
                        <p class="mp-gift-card__description">
                            Cinq séances, c'est le temps de ressentir les premiers changements :
                            moins de tensions, plus de fluidité. Un cadeau qui accompagne
                            sur plusieurs semaines.
                        </p>
                        <ul class="mp-gift-card__features">
                            <li>5 séances collectives en petit groupe</li>
                            <li>Progression à son rythme</li>
                            <li>Suivi personnalisé</li>
                        </ul>
                    </div>
                    <div class="mp-gift-card__footer">
                        <div class="mp-gift-card__price">
                            <span class="mp-gift-card__amount">95</span>
                            <span class="mp-gift-card__currency">€</span>
                        </div>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609529/?membership=3023&force=true"
                           class="mp-gift-card__cta" target="_blank" rel="noopener">
                            Offrir cette carte
                        </a>
                        <span class="mp-gift-card__validity">Valable 4 mois après activation</span>
                    </div>
                </div>

                <!-- Carte Équilibre -->
                <div class="mp-gift-card">
                    <div class="mp-gift-card__header">
                        <span class="mp-gift-card__label">Pour durer</span>
                        <h3 class="mp-gift-card__name">Carte Équilibre</h3>
                        <p class="mp-gift-card__tagline">Pour ancrer une nouvelle habitude</p>
                    </div>
                    <div class="mp-gift-card__body">
                        <p class="mp-gift-card__description">
                            Le cadeau idéal pour quelqu'un qui veut vraiment prendre soin de son corps
                            sur la durée. Dix séances pour installer une pratique régulière
                            et en récolter tous les bienfaits.
                        </p>
                        <ul class="mp-gift-card__features">
                            <li>10 séances collectives en petit groupe</li>
                            <li>Transformation durable</li>
                            <li>Liberté totale sur le planning</li>
                        </ul>
                    </div>
                    <div class="mp-gift-card__footer">
                        <div class="mp-gift-card__price">
                            <span class="mp-gift-card__amount">180</span>
                            <span class="mp-gift-card__currency">€</span>
                        </div>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609530/?membership=3023&force=true"
                           class="mp-gift-card__cta" target="_blank" rel="noopener">
                            Offrir cette carte
                        </a>
                        <span class="mp-gift-card__validity">Valable 6 mois après activation</span>
                    </div>
                </div>

            </div>
            <?php } ?>

            <!-- Note sur le paiement sécurisé -->
            <div class="mp-gift-payment-info">
                <div class="mp-gift-payment-info__inner">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <p>Paiement sécurisé par carte bancaire via Stripe. Après paiement, vous recevez immédiatement un PDF à imprimer.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         COMMENT ÇA MARCHE
         Rassurer sur la simplicité du processus
         ============================================================ -->
    <section class="mp-gift-how">
        <div class="mp-gift-how__inner">
            <h2 class="mp-gift-section-title">Offrir une carte, c'est simple</h2>

            <div class="mp-gift-how__steps">
                <div class="mp-gift-how__step">
                    <div class="mp-gift-how__number">1</div>
                    <h3 class="mp-gift-how__title">Vous choisissez</h3>
                    <p class="mp-gift-how__text">
                        Sélectionnez la carte qui correspond à la personne et à l'occasion.
                        Pas de compte à créer.
                    </p>
                </div>

                <div class="mp-gift-how__connector"></div>

                <div class="mp-gift-how__step">
                    <div class="mp-gift-how__number">2</div>
                    <h3 class="mp-gift-how__title">Vous offrez</h3>
                    <p class="mp-gift-how__text">
                        Après paiement, vous recevez la carte au format digital.
                        Vous pouvez l'imprimer ou l'envoyer directement.
                    </p>
                </div>

                <div class="mp-gift-how__connector"></div>

                <div class="mp-gift-how__step">
                    <div class="mp-gift-how__number">3</div>
                    <h3 class="mp-gift-how__title">Il/elle réserve</h3>
                    <p class="mp-gift-how__text">
                        Le bénéficiaire choisit son créneau sur le planning en ligne
                        et vient profiter de sa séance. C'est tout.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         RASSURANCE
         Créer la confiance, lever les derniers doutes
         ============================================================ -->
    <section class="mp-gift-trust">
        <div class="mp-gift-trust__inner">
            <h2 class="mp-gift-section-title">Un cadre pensé pour le bien-être</h2>

            <div class="mp-gift-trust__grid">
                <div class="mp-gift-trust__item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div>
                        <strong>Tous niveaux bienvenus</strong>
                        <span>Débutant complet ou pratiquant régulier, chacun est accueilli là où il en est.</span>
                    </div>
                </div>

                <div class="mp-gift-trust__item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div>
                        <strong>Enseignante certifiée FPMP</strong>
                        <span>Formation professionnelle reconnue, approche respectueuse du corps.</span>
                    </div>
                </div>

                <div class="mp-gift-trust__item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div>
                        <strong>Studio calme et intimiste</strong>
                        <span>Petit groupe de 5 personnes maximum. Pas de salle bondée, pas de musique forte.</span>
                    </div>
                </div>

                <div class="mp-gift-trust__item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div>
                        <strong>Zéro pression, zéro performance</strong>
                        <span>Ici, on ne compare pas. On écoute son corps, on progresse à son rythme.</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         RENVOI CARTE CADEAU
         Pour ceux qui n'ont pas reçu leur carte
         ============================================================ -->
    <section class="mp-gift-resend">
        <div class="mp-gift-resend__inner">
            <?php
            // Utiliser le shortcode si le plugin est actif
            if ( function_exists( 'MPGC' ) ) {
                echo do_shortcode( '[mpgc_resend_form]' );
            } else {
            ?>
            <div class="mpgc-resend-section">
                <div class="mpgc-resend-box">
                    <div class="mpgc-resend-icon">📧</div>
                    <h3 class="mpgc-resend-title">Vous n'avez pas reçu votre carte cadeau ?</h3>
                    <p class="mpgc-resend-description">
                        Contactez-nous directement au <a href="tel:+33699183216">06 99 18 32 16</a>
                        ou par email à <a href="mailto:cetteviolettela@hotmail.fr">cetteviolettela@hotmail.fr</a>
                    </p>
                </div>
            </div>
            <?php } ?>
        </div>
    </section>

    <!-- ============================================================
         CTA FINAL
         Dernier élan émotionnel
         ============================================================ -->
    <section class="mp-gift-final">
        <div class="mp-gift-final__inner">
            <p class="mp-gift-final__quote">
                Un cadeau qui fait du bien au corps, à l'esprit, et au cœur.
            </p>
            <div class="mp-gift-final__actions">
                <a href="#cartes" class="mp-gift-final__cta-primary">
                    <span>Offrir une carte cadeau</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
                <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-gift-final__cta-secondary">
                    Voir le planning des cours
                </a>
            </div>
        </div>
    </section>

</div>

<?php get_footer(); ?>
