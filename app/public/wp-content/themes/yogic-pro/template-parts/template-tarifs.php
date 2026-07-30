<?php
/**
 * Template Name: Tarifs & Formules Premium
 *
 * Page tarifs redesignée - UX/UI premium
 * Design épuré, cartes élégantes, hiérarchie claire
 *
 * @package Yogic Pro / Mon Pilates
 */

get_header();
?>

<div class="mp-tarifs-page mp-premium-page">

    <!-- ============================================================
         HERO - Accueil doux et rassurant
         ============================================================ -->
    <section class="mp-tarifs-hero">
        <div class="mp-tarifs-hero-inner">
            <div class="mp-tarifs-hero-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                    <path d="M24 14v20M14 24h20" stroke="#7fa8b6" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
                    <circle cx="24" cy="24" r="8" stroke="#7fa8b6" stroke-width="2" fill="none"/>
                </svg>
            </div>
            <h1 class="mp-tarifs-title">Tarifs des cours de Pilates à Larmor-Plage</h1>
            <p class="mp-tarifs-subtitle">
                Des formules simples, à choisir selon vos envies. Pas d'abonnement, pas d'engagement.<br>
                Vous achetez une carte ou une séance, vous réservez quand vous voulez, dans un studio à deux pas de la plage de Toulhars.
            </p>
            <div class="mp-tarifs-badges">
                <span class="mp-badge">Sans engagement</span>
                <span class="mp-badge">Tous niveaux</span>
                <span class="mp-badge">Cartes flexibles</span>
                <span class="mp-badge">Réservation en ligne</span>
            </div>
        </div>
    </section>

    <!-- ============================================================
         SECTION "COMMENT CHOISIR ?" - 3 parcours
         ============================================================ -->
    <section class="mp-tarifs-choose">
        <div class="mp-tarifs-choose-inner">
            <h2 class="mp-section-title">Comment choisir sa formule ?</h2>
            <p class="mp-section-intro">
                Trois approches différentes, selon vos envies et vos besoins.
                Chacune a ses avantages.
            </p>

            <div class="mp-choose-cards">
                <!-- Découverte -->
                <div class="mp-choose-card mp-choose-card-discovery">
                    <div class="mp-choose-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <h3 class="mp-choose-title">Découverte</h3>
                    <p class="mp-choose-desc">
                        Vous n'avez jamais essayé le Pilates ? Commencez par une séance découverte,
                        sans pression, pour voir si ça vous plaît.
                    </p>
                    <span class="mp-choose-for">Idéal pour : première fois, curiosité</span>
                </div>

                <!-- Collectif Tapis -->
                <div class="mp-choose-card mp-choose-card-group">
                    <div class="mp-choose-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="9" cy="7" r="3"/>
                            <circle cx="15" cy="7" r="3"/>
                            <path d="M3 21v-2a4 4 0 014-4h2"/>
                            <path d="M15 15a4 4 0 014 4v2"/>
                            <circle cx="12" cy="17" r="3"/>
                        </svg>
                    </div>
                    <h3 class="mp-choose-title">Pilates Tapis</h3>
                    <p class="mp-choose-desc">
                        Cours collectif au sol avec petit matériel,
                        en petit groupe de 5 personnes maximum.
                    </p>
                    <span class="mp-choose-for">Idéal pour : pratique régulière, convivialité</span>
                </div>

                <!-- Machine Petit Groupe -->
                <div class="mp-choose-card mp-choose-card-machine">
                    <div class="mp-choose-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="9" width="18" height="6" rx="1"/>
                            <path d="M3 12h18"/>
                            <circle cx="6" cy="12" r="1.5"/>
                            <circle cx="18" cy="12" r="1.5"/>
                        </svg>
                    </div>
                    <h3 class="mp-choose-title">Pilates Machine</h3>
                    <p class="mp-choose-desc">
                        Cours collectif sur Reformer, en groupe restreint.
                        Le travail ciblé de l'appareil, l'énergie du collectif.
                    </p>
                    <span class="mp-choose-for">Idéal pour : progresser sur Reformer sans engagement individuel</span>
                </div>

                <!-- Privé -->
                <div class="mp-choose-card mp-choose-card-private">
                    <div class="mp-choose-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                            <path d="M16 3l2 2-2 2"/>
                        </svg>
                    </div>
                    <h3 class="mp-choose-title">Cours privés — solo ou duo</h3>
                    <p class="mp-choose-desc">
                        Un accompagnement 100% personnalisé, sur appareils Pilates.
                        Seul·e pour un objectif précis, ou <strong>à deux</strong> avec la séance duo.
                    </p>
                    <span class="mp-choose-for">Idéal pour : objectifs précis, reprise après douleur, pratiquer à deux</span>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         TARIFS - Cartes élégantes par catégorie
         ============================================================ -->
    <section class="mp-tarifs-pricing">
        <div class="mp-tarifs-pricing-inner">

            <!-- DÉCOUVERTE -->
            <div class="mp-pricing-category mp-pricing-discovery">
                <div class="mp-category-header">
                    <span class="mp-category-label">Pour commencer</span>
                    <h2 class="mp-category-title">Séances découverte</h2>
                    <p class="mp-category-desc">Essayez sans engagement, à votre rythme</p>
                </div>

                <div class="mp-pricing-cards mp-pricing-cards-3">
                    <div class="mp-pricing-card">
                        <div class="mp-card-header">
                            <h3 class="mp-card-title">Découverte Tapis</h3>
                            <p class="mp-card-subtitle">Cours collectif</p>
                        </div>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">10</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <ul class="mp-card-features">
                            <li>1 séance en petit groupe</li>
                            <li>5 personnes maximum</li>
                            <li>Tous niveaux acceptés</li>
                        </ul>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609533/?membership=3023&force=true" class="mp-card-cta" target="_blank" rel="noopener">
                            Acheter ma séance découverte
                        </a>
                    </div>

                    <div class="mp-pricing-card">
                        <div class="mp-card-header">
                            <h3 class="mp-card-title">Découverte Machine</h3>
                            <p class="mp-card-subtitle">Cours collectif sur appareils</p>
                        </div>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">20</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <ul class="mp-card-features">
                            <li>1 séance en petit groupe</li>
                            <li>Sur Reformer</li>
                            <li>Tous niveaux acceptés</li>
                        </ul>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/755371/?membership=3023&force=true" class="mp-card-cta" target="_blank" rel="noopener">
                            Acheter ma séance découverte
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-highlight">
                        <div class="mp-card-badge">Recommandé</div>
                        <div class="mp-card-header">
                            <h3 class="mp-card-title">Découverte Privée</h3>
                            <p class="mp-card-subtitle">Cours individuel sur appareils</p>
                        </div>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">50</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <ul class="mp-card-features">
                            <li>1 séance individuelle</li>
                            <li>Bilan personnalisé inclus</li>
                            <li>Sur appareils Pilates</li>
                        </ul>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/639573/?membership=3023&force=true" class="mp-card-cta" target="_blank" rel="noopener">
                            Acheter ma séance découverte
                        </a>
                    </div>
                </div>
            </div>

            <!-- COLLECTIF - TAPIS -->
            <div class="mp-pricing-category mp-pricing-group">
                <div class="mp-category-header">
                    <span class="mp-category-label">Pratique régulière</span>
                    <h2 class="mp-category-title">Pilates Tapis</h2>
                    <p class="mp-category-desc">Cours collectifs en petit groupe de 5 personnes maximum, sur tapis avec petit matériel</p>
                </div>

                <div class="mp-pricing-cards mp-pricing-cards-4">
                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">À l'unité</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">20</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">Flexibilité totale</p>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609528/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">Carte 5 séances</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">95</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">19€ / séance</p>
                        <span class="mp-card-validity">Valable 3 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609529/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple mp-pricing-card-popular">
                        <div class="mp-card-badge">Le + choisi</div>
                        <h3 class="mp-card-title">Carte 10 séances</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">180</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">18€ / séance</p>
                        <span class="mp-card-validity">Valable 6 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609530/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">Carte 20 séances</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">340</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">17€ / séance</p>
                        <span class="mp-card-validity">Valable 12 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/609531/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>
                </div>

                <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-category-cta">
                    <span>Voir le planning des cours collectifs</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>

            <!-- COLLECTIF - MACHINE PETIT GROUPE -->
            <div class="mp-pricing-category mp-pricing-machine">
                <div class="mp-category-header">
                    <span class="mp-category-label">Travailler sur appareils en groupe</span>
                    <h2 class="mp-category-title">Pilates Machine en petit groupe</h2>
                    <p class="mp-category-desc">Cours collectifs sur Reformer, en groupe restreint</p>
                </div>

                <div class="mp-pricing-cards mp-pricing-cards-3">
                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">Séance unité</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">30</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">Découverte ou flexibilité</p>
                        <span class="mp-card-validity">Valable 1 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/755253/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">Carte 5 cours</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">140</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">28€ / séance</p>
                        <span class="mp-card-validity">Valable 5 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/755254/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple mp-pricing-card-popular">
                        <div class="mp-card-badge">Le + choisi</div>
                        <h3 class="mp-card-title">Carte 10 cours</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">270</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">27€ / séance</p>
                        <span class="mp-card-validity">Valable 10 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/755256/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>
                </div>

                <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-category-cta">
                    <span>Voir les créneaux Pilates Machine</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>

            <!-- PRIVÉ - INDIVIDUEL & DUO -->
            <div class="mp-pricing-category mp-pricing-private">
                <div class="mp-category-header">
                    <span class="mp-category-label">Accompagnement 100% personnalisé — solo ou à deux</span>
                    <h2 class="mp-category-title">Cours privés</h2>
                    <p class="mp-category-desc">Séances sur Reformer, Cadillac et autres appareils Pilates, en individuel ou en duo</p>
                </div>

                <div class="mp-pricing-cards mp-pricing-cards-3">
                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <h3 class="mp-card-title">À l'unité</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">65</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">55 min à 1 h</p>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/639559/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple mp-pricing-card-popular">
                        <div class="mp-card-badge">Meilleure valeur</div>
                        <h3 class="mp-card-title">Carte 10 séances</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">550</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">55€ / séance</p>
                        <span class="mp-card-validity">Valable 8 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/723882/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>

                    <div class="mp-pricing-card mp-pricing-card-simple">
                        <div class="mp-card-badge">Nouveau</div>
                        <h3 class="mp-card-title">Séance duo</h3>
                        <div class="mp-card-price">
                            <span class="mp-price-amount">80</span>
                            <span class="mp-price-currency">€</span>
                        </div>
                        <p class="mp-card-note">40&nbsp;€ / personne — 55 min à 1 h</p>
                        <span class="mp-card-validity">Valable 3 mois</span>
                        <a href="https://backoffice.bsport.io/customer/payment/pass/779204/?membership=3023&force=true" class="mp-card-buy-btn" target="_blank" rel="noopener">
                            Acheter
                        </a>
                    </div>
                </div>

                <p class="mp-pricing-note">
                    <strong>La séance duo</strong> se déroule à deux, sur les appareils, avec le même accompagnement personnalisé qu'un cours privé.
                    Le créneau se cale directement avec moi : après l'achat, écrivez-moi et on trouve le moment qui vous arrange à tous les deux.
                </p>

                <a href="<?php echo esc_url(mp_get_contact_url()); ?>" class="mp-category-cta mp-category-cta-secondary">
                    <span>Une question sur les cours privés ou le duo ?</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                </a>
            </div>

        </div>
    </section>

    <!-- ============================================================
         SECTION "VOUS HÉSITEZ ?" - Aide à la décision
         ============================================================ -->
    <section class="mp-tarifs-help">
        <div class="mp-tarifs-help-inner">
            <h2 class="mp-section-title">Vous hésitez entre les formules ?</h2>
            <ul class="mp-help-list">
                <li><strong>Pour découvrir le Pilates en douceur</strong> : commencez par une <em>Séance découverte tapis</em> (10&nbsp;€), une <em>Séance découverte machine</em> (20&nbsp;€) ou une carte 5&nbsp;cours <em>Pilates Tapis</em>.</li>
                <li><strong>Pour progresser sur Reformer sans cours individuel</strong> : choisissez <em>Pilates Machine</em> en petit groupe (carte 5&nbsp;cours à 140&nbsp;€).</li>
                <li><strong>Pour un besoin spécifique ou un accompagnement complet</strong> : privilégiez le <em>cours privé</em> (séance unité à 65&nbsp;€ ou carte 10&nbsp;cours à 550&nbsp;€).</li>
                <li><strong>Pour venir à deux</strong> : la <em>séance duo</em> (80&nbsp;€ la séance, soit 40&nbsp;€ par personne) offre le même accompagnement sur appareils, à partager avec votre conjoint·e, un ami, un parent.</li>
            </ul>
            <p class="mp-help-note">Vous pouvez toujours alterner les formules selon vos envies — chaque carte est valable plusieurs mois.</p>
        </div>
    </section>

    <!-- ============================================================
         SECTION CARTES CADEAUX
         ============================================================ -->
    <section class="mp-tarifs-gift">
        <div class="mp-tarifs-gift-inner">
            <div class="mp-gift-content">
                <div class="mp-gift-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cf317c" stroke-width="1.5">
                        <rect x="3" y="8" width="18" height="13" rx="2"/>
                        <path d="M12 8v13"/>
                        <path d="M3 12h18"/>
                        <path d="M12 8c-2-3-6-3-6 0s4 0 6 0c2 0 6-3 6 0s-4 3-6 0"/>
                    </svg>
                </div>
                <div class="mp-gift-text">
                    <h2 class="mp-gift-title">Offrez du bien-être</h2>
                    <p class="mp-gift-desc">
                        Les cartes cadeaux Mon Pilates sont disponibles pour toutes les formules.
                        Un cadeau attentionné, à offrir simplement.
                    </p>
                </div>
            </div>
            <a href="<?php echo esc_url(mp_get_gift_card_url()); ?>" class="mp-gift-cta">
                <span>Découvrir les cartes cadeaux</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    </section>

    <!-- ============================================================
         FAQ / RÉASSURANCE
         ============================================================ -->
    <section class="mp-tarifs-faq">
        <div class="mp-tarifs-faq-inner">
            <h2 class="mp-section-title">Questions fréquentes</h2>

            <div class="mp-faq-items">
                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Les cartes ont-elles une date d'expiration ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>Oui, chaque carte a une durée de validité indiquée au moment de l'achat (de 1 à 12 mois selon la formule). En cas de situation particulière — blessure, grossesse, arrêt prolongé — vous pouvez me contacter pour en parler.</p>
                    </div>
                </details>

                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Puis-je annuler ou reporter une séance ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>Oui, jusqu'à 12&nbsp;h avant le début de la séance, directement depuis votre espace de réservation en ligne.</p>
                    </div>
                </details>

                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Je n'ai jamais fait de Pilates, par quoi commencer ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>Le plus simple est de réserver une <strong>séance découverte</strong>&nbsp;: 10&nbsp;€ pour un cours tapis en petit groupe, 20&nbsp;€ pour un cours machine en petit groupe, ou 50&nbsp;€ pour un cours privé sur appareils. Ce premier rendez-vous permet de voir si la pratique vous convient, sans engagement.</p>
                    </div>
                </details>

                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Quelle différence entre tapis et appareils ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>Le studio propose trois formats : <strong>Pilates Tapis</strong> en petit groupe (au sol avec petit matériel), <strong>Pilates Machine</strong> en petit groupe (sur Reformer, à plusieurs pour une dynamique collective) et <strong>Cours privés</strong> (séance individuelle sur Reformer, Cadillac et autres appareils, entièrement personnalisée). Tapis et appareils sont complémentaires : le tapis travaille la conscience corporelle, le Reformer ajoute les résistances pour cibler plus finement.</p>
                    </div>
                </details>

                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Quelle différence entre Pilates Machine en groupe et cours privé sur appareils ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>Le format <strong>Pilates Machine en petit groupe</strong> se déroule uniquement sur <strong>Reformer</strong>, à plusieurs, pour bénéficier de l'énergie collective à un tarif accessible. Le <strong>cours privé</strong> est une séance individuelle sur tous les appareils du studio (Reformer, Cadillac, Wunda Chair…), entièrement personnalisée selon vos besoins — idéale pour un objectif précis, une douleur ou une rééducation.</p>
                    </div>
                </details>

                <details class="mp-faq-item">
                    <summary class="mp-faq-question">
                        <span>Comment fonctionne la séance duo ?</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </summary>
                    <div class="mp-faq-answer">
                        <p>La <strong>séance duo</strong> est un cours privé partagé à deux, sur les appareils du studio. Le tarif est de <strong>80&nbsp;€ la séance pour deux personnes</strong>, soit 40&nbsp;€ par personne — une façon plus accessible de bénéficier d'un accompagnement personnalisé. Une seule personne achète la séance pour les deux, puis on convient ensemble du créneau : il suffit de me contacter après l'achat. C'est idéal en couple, entre amis, ou parent-enfant, à condition d'avoir des objectifs et un niveau compatibles.</p>
                    </div>
                </details>
            </div>
        </div>
    </section>

    <!-- ============================================================
         CTA FINAL
         ============================================================ -->
    <section class="mp-tarifs-cta-final">
        <div class="mp-tarifs-cta-inner">
            <h2 class="mp-cta-title">Prêt à commencer ?</h2>
            <p class="mp-cta-text">
                Choisissez une formule et réservez en ligne, ou écrivez-moi si vous avez une question avant.
            </p>
            <div class="mp-cta-buttons">
                <a href="<?php echo esc_url(mp_get_planning_url()); ?>" class="mp-btn mp-btn-primary">
                    <span>Voir les disponibilités</span>
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

<!-- Schema.org FAQPage – SEO rich snippets -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Les cartes de cours Pilates ont-elles une date d'expiration ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, chaque carte a une durée de validité indiquée au moment de l'achat (de 1 à 12 mois selon la formule). En cas de situation particulière — blessure, grossesse, arrêt prolongé — vous pouvez me contacter pour en parler."
            }
        },
        {
            "@type": "Question",
            "name": "Puis-je annuler ou reporter une séance de Pilates ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, jusqu'à 12 h avant le début de la séance, directement depuis votre espace de réservation en ligne."
            }
        },
        {
            "@type": "Question",
            "name": "Je n'ai jamais fait de Pilates, par quoi commencer ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le plus simple est de réserver une séance découverte : 10 € pour un cours tapis en petit groupe, 20 € pour un cours machine en petit groupe, ou 50 € pour un cours privé sur appareils. Ce premier rendez-vous permet de voir si la pratique vous convient, sans engagement."
            }
        },
        {
            "@type": "Question",
            "name": "Quelle différence entre les cours Pilates tapis et appareils ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le studio propose trois formats : Pilates Tapis en petit groupe (au sol avec petit matériel), Pilates Machine en petit groupe (sur Reformer, à plusieurs pour une dynamique collective) et Cours privés (séance individuelle sur Reformer, Cadillac et autres appareils, entièrement personnalisée). Tapis et appareils sont complémentaires : le tapis travaille la conscience corporelle, le Reformer ajoute les résistances pour cibler plus finement."
            }
        },
        {
            "@type": "Question",
            "name": "Quelle différence entre Pilates Machine en groupe et cours privé sur appareils ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le format Pilates Machine en petit groupe se déroule uniquement sur Reformer, à plusieurs, pour bénéficier de l'énergie collective à un tarif accessible. Le cours privé est une séance individuelle sur tous les appareils du studio (Reformer, Cadillac, Wunda Chair…), entièrement personnalisée selon vos besoins, idéale pour un objectif précis, une douleur ou une rééducation."
            }
        },
        {
            "@type": "Question",
            "name": "Comment fonctionne la séance duo de Pilates ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "La séance duo est un cours privé partagé à deux, sur les appareils du studio. Le tarif est de 80 € la séance pour deux personnes, soit 40 € par personne. Une seule personne achète la séance pour les deux, puis le créneau est convenu directement avec l'enseignante après l'achat. C'est idéal en couple, entre amis ou parent-enfant, à condition d'avoir des objectifs et un niveau compatibles."
            }
        }
    ]
}
</script>

<?php get_footer(); ?>
