/**
 * Mon Pilates - Planning Frontend
 * Parcours par besoin + filtres activités
 * v2.0 - UX optimisée
 */

(function() {
    'use strict';

    // Debug mode (set to false in production)
    const DEBUG = true;
    const log = (...args) => DEBUG && console.log('[MonPilates]', ...args);

    // Config from WordPress
    const config = window.monpilatesPlanning || {};
    const i18n = config.i18n || {};

    // Needs mapping to activity keywords
    // Ordre UX : douceur → maternité → découverte → confirmé → premium
    const NEEDS_MAP = {
        doux: {
            id: 'doux',
            icon: '🌿',
            title: 'Je cherche de la douceur',
            subtitle: 'Mobilité, seniors, dos sensible, reprise',
            keywords: ['doux', 'senior', 'mobilité', 'adapté'],
            color: '#7FB069',
            isSpecial: false
        },
        prenatal: {
            id: 'prenatal',
            icon: '🤰',
            title: 'Je suis enceinte ou jeune maman',
            subtitle: 'Pilates pré & post-natal, adapté à votre corps',
            keywords: ['enceinte', 'prenatal', 'prénatal', 'post-natal', 'postnatal', 'maman', 'femme enceinte', 'grossesse', 'maternité', 'maternite'],
            color: '#E8A4B8',
            isSpecial: false,
            bannerText: 'Pilates pré & post-natal'
        },
        classique: {
            id: 'classique',
            icon: '🔵',
            title: 'Je veux découvrir ou pratiquer le Pilates',
            subtitle: 'Renforcement global, accessible même aux débutants',
            keywords: ['classique', 'tapis', 'collectif', 'mat', 'tous niveaux'],
            color: '#5B8FA8',
            isSpecial: false
        },
        avance: {
            id: 'avance',
            icon: '🔴',
            title: 'Je pratique déjà régulièrement',
            subtitle: 'Plus intense, pour pratiquants confirmés',
            keywords: ['avancé', 'intensif', 'confirmé'],
            color: '#D4726A',
            isSpecial: false
        },
        machine_groupe: {
            id: 'machine_groupe',
            icon: '🏋️',
            title: 'Je veux travailler sur appareils en petit groupe',
            subtitle: 'Reformers & machines, dynamique collective, tarif accessible',
            // Mots qui ciblent l'activité "Pilates Machine Petit Groupe" sans
            // attraper l'activité "Cours privés" (qui contient aussi "machine"
            // dans sa description). On match le libellé exact en priorité.
            keywords: ['pilates machine', 'machine petit groupe', 'machine groupe'],
            color: '#7FB069',
            isSpecial: false
        },
        prive: {
            id: 'prive',
            icon: '✨',
            title: 'Je veux un accompagnement individuel',
            subtitle: 'Cours privé sur appareils, séance 100% personnalisée',
            // Resserré : on enlève "machine" et "appareil" qui captaient aussi
            // le nouveau Pilates Machine Petit Groupe par mégarde.
            keywords: ['privé', 'individuel', 'duo'],
            color: '#8B7355',
            isSpecial: true,
            ctaLabel: 'Découvrir les cours privés',
            ctaUrl: '/cours-prives/'
        }
    };

    // State
    let state = {
        offers: [],
        establishments: [],
        selectedDate: null,
        selectedNeed: null,        // 'doux', 'classique', 'avance', 'prive' or null
        selectedActivities: [],    // Derived from need
        isLoading: true,
        error: null,
        filtersDrawerOpen: false,
        showPrivate: false,        // Cours privés cachés par défaut (toggle au-dessus du planning)
    };

    /**
     * Heuristic to detect a private course offer based on its activity name.
     * Used to filter them out by default from the main planning view.
     */
    function isPrivateOffer(offer) {
        const name = normalizeText(offer && offer.activity_name);
        return name.includes('prive') || name.includes('individuel') || name.includes('duo');
    }

    // DOM Elements
    let container = null;

    /**
     * Initialize
     */
    function init() {
        container = document.getElementById('monpilates-planning');
        if (!container) {
            log('Container not found');
            return;
        }

        log('Initializing planning...');

        const daysAttr = container.dataset.days;
        if (daysAttr) config.daysToShow = parseInt(daysAttr, 10);

        loadData();
    }

    /**
     * Load data from API
     */
    async function loadData() {
        state.isLoading = true;
        render();

        try {
            log('Fetching data from API...');

            const [offersRes, establishmentsRes] = await Promise.all([
                fetch(`${config.ajaxUrl}offers`),
                fetch(`${config.ajaxUrl}establishments`)
            ]);

            if (!offersRes.ok || !establishmentsRes.ok) {
                throw new Error('API request failed');
            }

            const offersData = await offersRes.json();
            const establishmentsData = await establishmentsRes.json();

            state.offers = offersData.offers || [];
            state.establishments = establishmentsData || [];

            log(`Loaded ${state.offers.length} offers`);

            // Set default date
            const dates = getUniqueDates();
            state.selectedDate = dates[0] || formatDate(new Date());

            state.isLoading = false;
            state.error = null;

        } catch (err) {
            console.error('MonPilates Planning Error:', err);
            state.error = i18n.error || 'Erreur de chargement';
            state.isLoading = false;
        }

        render();
    }

    /**
     * Strip diacritics so "Maternité" matches keyword "maternite" (or vice-versa).
     * Resilient to Bsport activity renames where accents may shift.
     */
    function normalizeText(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '');
    }

    /**
     * Per-activity color palette for time pills.
     * Each entry : keyword(s) matched against the (normalized) activity name → light/dark hex.
     * Keep in sync with the Bsport admin so the activity colors stay coherent
     * between the website and the Bsport booking flow.
     */
    const ACTIVITY_COLORS = [
        { match: ['doux', 'senior'],          light: '#A4C99A', dark: '#7FB069' }, // sage
        { match: ['avance', 'avancé'],        light: '#E89489', dark: '#D4726A' }, // corail
        { match: ['maternite', 'enceinte', 'prenatal', 'postnatal'], light: '#F0BFC9', dark: '#E8A4B8' }, // rose tendre
        { match: ['machine', 'reformer'],     light: '#7DBA9F', dark: '#5C9982' }, // vert profond
        { match: ['prive', 'individuel', 'duo'], light: '#D4BC8A', dark: '#B8915A' }, // champagne / doré pâle
        { match: ['tous niveaux', 'classique', 'tapis', 'collectif', 'mat'], light: '#A8C5CF', dark: '#7FA8B6' }, // bleu océan (default Pilates)
    ];

    /**
     * Pick the color pair for a given activity name. Falls back to the
     * theme's primary blue if no rule matches.
     */
    function getActivityColors(activityName) {
        const norm = normalizeText(activityName);
        for (const rule of ACTIVITY_COLORS) {
            if (rule.match.some(kw => norm.includes(kw))) {
                return rule;
            }
        }
        return { light: '#A8C5CF', dark: '#7FA8B6' }; // fallback bleu océan
    }

    /**
     * Get activities matching a need's keywords (accent-insensitive)
     */
    function getActivitiesForNeed(needId) {
        if (!needId || !NEEDS_MAP[needId]) return [];

        const keywords = NEEDS_MAP[needId].keywords.map(normalizeText);
        const allActivities = getUniqueActivities();

        const matched = allActivities.filter(activity => {
            const actNorm = normalizeText(activity);
            return keywords.some(kw => actNorm.includes(kw));
        });

        log(`Need "${needId}" → keywords:`, keywords, '→ matched activities:', matched, '/ all:', allActivities);
        return matched;
    }

    /**
     * Set need and derive activities filter
     */
    function selectNeed(needId) {
        log('Selecting need:', needId);

        if (state.selectedNeed === needId) {
            // Toggle off
            state.selectedNeed = null;
            state.selectedActivities = [];
        } else {
            state.selectedNeed = needId;
            state.selectedActivities = getActivitiesForNeed(needId);
            log('Matched activities:', state.selectedActivities);
        }

        // Ensure date is valid for filtered activities
        const dates = getUniqueDates();
        if (!dates.includes(state.selectedDate)) {
            state.selectedDate = dates[0] || null;
        }

        render();

        // Scroll to planning on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                const planning = container.querySelector('.mp-planning-section');
                if (planning) {
                    planning.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }

    /**
     * Reset all filters
     */
    function resetFilters() {
        log('Resetting filters');
        state.selectedNeed = null;
        state.selectedActivities = [];
        state.filtersDrawerOpen = false;
        state.showPrivate = false;

        const dates = getUniqueDates();
        state.selectedDate = dates[0] || null;

        render();
    }

    /**
     * Get unique dates from future offers (respects filter)
     */
    function getUniqueDates() {
        let offers = getFutureOffers();

        if (state.selectedActivities.length > 0) {
            offers = offers.filter(offer =>
                state.selectedActivities.includes(offer.activity_name)
            );
        }

        return [...new Set(offers.map(o => o.date))].sort();
    }

    /**
     * Get only future offers
     */
    function getFutureOffers() {
        const now = new Date();
        return state.offers.filter(offer => {
            const offerDate = new Date(offer.datetime || `${offer.date}T${offer.time}:00`);
            return offerDate > now;
        });
    }

    /**
     * Get unique activities from future offers
     */
    function getUniqueActivities() {
        return [...new Set(getFutureOffers().map(o => o.activity_name).filter(Boolean))];
    }

    /**
     * Get filtered offers for display
     */
    function getFilteredOffers() {
        return getFutureOffers().filter(offer => {
            if (offer.date !== state.selectedDate) return false;
            // Hide private offers from the main planning view unless explicitly toggled on,
            // OR unless the user has explicitly selected the "private" need (in which case
            // they want to see them).
            if (!state.showPrivate && state.selectedNeed !== 'prive' && isPrivateOffer(offer)) {
                return false;
            }
            if (state.selectedActivities.length > 0) {
                if (!state.selectedActivities.includes(offer.activity_name)) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Count private offers on the currently selected date (for toggle UI label)
     */
    function countPrivateOffersForSelectedDate() {
        return getFutureOffers().filter(offer =>
            offer.date === state.selectedDate && isPrivateOffer(offer)
        ).length;
    }

    /**
     * Count offers for a need
     */
    function countOffersForNeed(needId) {
        const activities = getActivitiesForNeed(needId);
        if (activities.length === 0) return 0;

        return getFutureOffers().filter(offer =>
            activities.includes(offer.activity_name)
        ).length;
    }

    /**
     * Format date for API
     */
    function formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date + 'T00:00:00');
        }
        return date.toISOString().split('T')[0];
    }

    /**
     * Format date for display (short)
     */
    function formatDateShort(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.getTime() === today.getTime()) return "Aujourd'hui";
        if (date.getTime() === tomorrow.getTime()) return 'Demain';

        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    /**
     * Format date for display (long)
     */
    function formatDateLong(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return "Aujourd'hui";

        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    /**
     * Get establishment name
     */
    function getEstablishmentName(id) {
        const est = state.establishments.find(e => e.id === id);
        return est ? est.name : '';
    }

    /**
     * Build booking URL
     */
    function getBookingUrl(offer) {
        return `${config.bookingBaseUrl}/${config.companyId}/${offer.id}`;
    }

    /**
     * Main render
     */
    function render() {
        if (!container) return;

        const skeleton = container.querySelector('.monpilates-skeleton');
        if (skeleton && !state.isLoading) {
            skeleton.remove();
        }

        if (state.isLoading) return;

        if (state.error) {
            container.innerHTML = `
                <div class="monpilates-error" role="alert">
                    <p>${escapeHtml(state.error)}</p>
                    <button type="button" class="mp-btn mp-btn--secondary" onclick="location.reload()">
                        Réessayer
                    </button>
                </div>
            `;
            return;
        }

        const filteredOffers = getFilteredOffers();
        const dates = getUniqueDates();

        container.innerHTML = `
            ${renderNeedsSelector()}
            <div class="mp-planning-section">
                ${renderActiveFilterBanner()}
                ${renderDateNavigation(dates)}
                ${renderContextSummary(filteredOffers.length)}
                ${renderClasses(filteredOffers)}
            </div>
        `;

        attachEventListeners();
    }

    /**
     * Format count as passive text (emotional, not numerical)
     */
    function formatCountPassive(count) {
        if (count === 0) return 'Bientôt';
        if (count < 10) return 'Disponible';
        if (count < 30) return 'Nombreux créneaux';
        if (count < 80) return 'Planning large';
        return 'Très large choix';
    }

    /**
     * Render needs selector (main entry point)
     */
    function renderNeedsSelector() {
        const needs = Object.values(NEEDS_MAP);
        const regularNeeds = needs.filter(n => !n.isSpecial);
        const specialNeeds = needs.filter(n => n.isSpecial);

        const renderRegularCard = (need) => {
            const isActive = state.selectedNeed === need.id;
            const count = countOffersForNeed(need.id);
            const hasOffers = count > 0;

            return `
                <div class="mp-need-card-wrapper">
                    <button type="button"
                            class="mp-need-card ${isActive ? 'mp-need-card--active' : ''} ${!hasOffers ? 'mp-need-card--empty' : ''}"
                            data-need="${need.id}"
                            aria-pressed="${isActive}"
                            style="--need-color: ${need.color}"
                            ${!hasOffers ? 'disabled' : ''}>
                        <span class="mp-need-card__icon">${need.icon}</span>
                        <span class="mp-need-card__content">
                            <span class="mp-need-card__title">${need.title}</span>
                            <span class="mp-need-card__subtitle">${need.subtitle}</span>
                        </span>
                        <span class="mp-need-card__count">${formatCountPassive(count)}</span>
                        ${isActive ? '<span class="mp-need-card__check">✓</span>' : ''}
                    </button>
                    ${need.infoUrl ? `<a href="${need.infoUrl}" class="mp-need-card__info">En savoir plus</a>` : ''}
                </div>
            `;
        };

        const renderSpecialCard = (need) => {
            const isActive = state.selectedNeed === need.id;
            const count = countOffersForNeed(need.id);
            const hasOffers = count > 0;

            return `
                <div class="mp-need-card-wrapper mp-need-card-wrapper--special">
                    <button type="button"
                            class="mp-need-card mp-need-card--special ${isActive ? 'mp-need-card--active' : ''} ${!hasOffers ? 'mp-need-card--empty' : ''}"
                            data-need="${need.id}"
                            aria-pressed="${isActive}"
                            style="--need-color: ${need.color}"
                            ${!hasOffers ? 'disabled' : ''}>
                        <span class="mp-need-card__icon">${need.icon}</span>
                        <span class="mp-need-card__content">
                            <span class="mp-need-card__title">${need.title}</span>
                            <span class="mp-need-card__subtitle">${need.subtitle}</span>
                        </span>
                        <span class="mp-need-card__count">${formatCountPassive(count)}</span>
                        ${isActive ? '<span class="mp-need-card__check">✓</span>' : ''}
                    </button>
                    <a href="${need.ctaUrl}" class="mp-need-card__info">${need.ctaLabel} →</a>
                </div>
            `;
        };

        return `
            <section class="mp-needs-section" aria-labelledby="needs-title">
                <header class="mp-needs-header">
                    <h2 id="needs-title" class="mp-needs-title">Quel est votre besoin aujourd'hui ?</h2>
                    <p class="mp-needs-subtitle">Sélectionnez votre objectif pour voir les cours adaptés</p>
                    <p class="mp-needs-hint">Choisissez votre objectif, puis sélectionnez une date</p>
                </header>

                <div class="mp-needs-grid" role="group" aria-label="Choix du type de cours">
                    ${regularNeeds.map(renderRegularCard).join('')}
                </div>

                ${specialNeeds.length > 0 ? `
                    <div class="mp-needs-premium">
                        <p class="mp-needs-premium__label">Envie d'une expérience premium ?</p>
                        <div class="mp-needs-grid mp-needs-grid--special">
                            ${specialNeeds.map(renderSpecialCard).join('')}
                        </div>
                    </div>
                ` : ''}
            </section>
        `;
    }

    /**
     * Render active filter banner
     */
    function renderActiveFilterBanner() {
        if (!state.selectedNeed) return '';

        const need = NEEDS_MAP[state.selectedNeed];
        if (!need) return '';

        // Utilise bannerText si défini, sinon title
        const displayText = need.bannerText || need.title;

        return `
            <div class="mp-filter-banner" style="--banner-color: ${need.color}">
                <div class="mp-filter-banner__content">
                    <span class="mp-filter-banner__icon">${need.icon}</span>
                    <span class="mp-filter-banner__text">
                        Planning filtré : <strong>${displayText}</strong>
                    </span>
                </div>
                <button type="button" class="mp-filter-banner__reset" data-action="reset-filters">
                    Voir tous les cours
                </button>
            </div>
        `;
    }

    /**
     * Render date navigation
     */
    function renderDateNavigation(dates) {
        if (dates.length === 0) {
            return `
                <div class="mp-date-nav mp-date-nav--empty">
                    <p>Aucun cours disponible pour cette sélection.</p>
                    ${state.selectedNeed ? `
                        <button type="button" class="mp-btn mp-btn--text" data-action="reset-filters">
                            Voir tous les cours
                        </button>
                    ` : ''}
                </div>
            `;
        }

        const currentIndex = dates.indexOf(state.selectedDate);
        const canGoPrev = currentIndex > 0;
        const canGoNext = currentIndex < dates.length - 1;

        const tabs = dates.map(date => {
            const isActive = date === state.selectedDate;
            const d = new Date(date + 'T00:00:00');
            const dayName = formatDateShort(date);
            const dayNum = d.getDate();

            return `
                <button type="button"
                        class="mp-date-tab ${isActive ? 'mp-date-tab--active' : ''}"
                        data-date="${date}"
                        aria-selected="${isActive}">
                    <span class="mp-date-tab__name">${dayName}</span>
                    <span class="mp-date-tab__num">${dayNum}</span>
                </button>
            `;
        }).join('');

        return `
            <nav class="mp-date-nav" aria-label="Navigation par date">
                <div class="mp-date-nav__mobile">
                    <button type="button"
                            class="mp-date-arrow mp-date-arrow--prev"
                            data-direction="prev"
                            aria-label="Jour précédent"
                            ${!canGoPrev ? 'disabled' : ''}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="mp-date-current">
                        <span class="mp-date-current__label">📅</span>
                        <span class="mp-date-current__date">${formatDateLong(state.selectedDate)}</span>
                    </div>
                    <button type="button"
                            class="mp-date-arrow mp-date-arrow--next"
                            data-direction="next"
                            aria-label="Jour suivant"
                            ${!canGoNext ? 'disabled' : ''}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
                <div class="mp-date-nav__desktop">
                    <button type="button" class="mp-date-scroll-btn" data-scroll="left" aria-label="Défiler à gauche">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="mp-date-tabs">
                        ${tabs}
                    </div>
                    <button type="button" class="mp-date-scroll-btn" data-scroll="right" aria-label="Défiler à droite">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </nav>
        `;
    }

    /**
     * Render context summary + private offers toggle
     */
    function renderContextSummary(count) {
        const dateText = formatDateLong(state.selectedDate);
        const needText = state.selectedNeed ? NEEDS_MAP[state.selectedNeed]?.title : '';
        const privateCount = countPrivateOffersForSelectedDate();

        // Toggle is irrelevant if user already filtered on the "private" need (then they see them)
        // or if there are simply no private offers that day.
        const showToggle = state.selectedNeed !== 'prive' && privateCount > 0;

        const toggleLabel = state.showPrivate
            ? `Cours privés affichés (${privateCount})`
            : `Voir aussi les cours privés (${privateCount})`;

        return `
            <div class="mp-context">
                <div class="mp-context__main">
                    <h3 class="mp-context__title">
                        <span class="mp-context__count">${count}</span> cours disponible${count !== 1 ? 's' : ''}
                    </h3>
                    <p class="mp-context__details">
                        ${dateText}${needText ? ` · ${needText}` : ''}
                    </p>
                </div>
                ${showToggle ? `
                    <button type="button"
                            class="mp-toggle-private ${state.showPrivate ? 'mp-toggle-private--on' : ''}"
                            data-toggle-private
                            aria-pressed="${state.showPrivate}">
                        <span class="mp-toggle-private__switch" aria-hidden="true"></span>
                        <span class="mp-toggle-private__label">${toggleLabel}</span>
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render classes list
     */
    function renderClasses(offers) {
        if (offers.length === 0) {
            return `
                <div class="mp-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p>Aucun cours ce jour.</p>
                </div>
            `;
        }

        const cards = offers.map(offer => renderClassCard(offer)).join('');
        return `<div class="mp-classes">${cards}</div>`;
    }

    /**
     * Render single class card
     */
    function renderClassCard(offer) {
        const establishmentName = getEstablishmentName(offer.establishment_id);
        const isFull = offer.is_full;
        const spotsText = isFull ? '' : `${offer.spots_left} place${offer.spots_left > 1 ? 's' : ''}`;
        const bookingUrl = getBookingUrl(offer);
        const colors = getActivityColors(offer.activity_name);
        // We only colorize when not full — full slots stay grey for visual hierarchy
        const colorStyle = isFull ? '' : `style="--card-color-light: ${colors.light}; --card-color-dark: ${colors.dark};"`;

        return `
            <article class="mp-card ${isFull ? 'mp-card--full' : ''}" ${colorStyle}>
                <div class="mp-card__time">
                    <span class="mp-card__hour">${offer.time}</span>
                    <span class="mp-card__duration">${offer.duration} min</span>
                </div>
                <div class="mp-card__content">
                    <h4 class="mp-card__title">${escapeHtml(offer.activity_name)}</h4>
                    ${offer.coach_name ? `<p class="mp-card__coach">avec ${escapeHtml(offer.coach_name)}</p>` : ''}
                    ${establishmentName ? `<p class="mp-card__location">${escapeHtml(establishmentName)}</p>` : ''}
                </div>
                <div class="mp-card__action">
                    ${isFull ? `
                        <span class="mp-badge mp-badge--full">Complet</span>
                    ` : `
                        <span class="mp-card__spots">${spotsText}</span>
                        <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="mp-btn mp-btn--primary mp-btn--cta">
                            Réserver
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    `}
                </div>
            </article>
        `;
    }

    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        // Need cards
        container.querySelectorAll('.mp-need-card').forEach(card => {
            card.addEventListener('click', () => {
                const needId = card.dataset.need;
                selectNeed(needId);
            });
        });

        // Reset filters
        container.querySelectorAll('[data-action="reset-filters"]').forEach(el => {
            el.addEventListener('click', resetFilters);
        });

        // Toggle "Voir aussi les cours privés"
        container.querySelectorAll('[data-toggle-private]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.showPrivate = !state.showPrivate;
                render();
            });
        });

        // Date tabs
        container.querySelectorAll('.mp-date-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.selectedDate = tab.dataset.date;
                render();
            });
        });

        // Date arrows (mobile)
        container.querySelectorAll('.mp-date-arrow').forEach(arrow => {
            arrow.addEventListener('click', () => {
                const dates = getUniqueDates();
                const currentIndex = dates.indexOf(state.selectedDate);
                const direction = arrow.dataset.direction;

                if (direction === 'prev' && currentIndex > 0) {
                    state.selectedDate = dates[currentIndex - 1];
                } else if (direction === 'next' && currentIndex < dates.length - 1) {
                    state.selectedDate = dates[currentIndex + 1];
                }

                render();
            });
        });

        // Date scroll buttons (desktop)
        const tabsContainer = container.querySelector('.mp-date-tabs');
        container.querySelectorAll('.mp-date-scroll-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!tabsContainer) return;
                const direction = btn.dataset.scroll;
                tabsContainer.scrollBy({
                    left: direction === 'left' ? -200 : 200,
                    behavior: 'smooth'
                });
            });
        });

        // Scroll active date into view
        if (tabsContainer) {
            const activeTab = tabsContainer.querySelector('.mp-date-tab--active');
            if (activeTab) {
                setTimeout(() => {
                    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }, 100);
            }
        }
    }

    /**
     * Escape HTML
     */
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.MonPilatesDebug = {
        getState: () => state,
        getNeedsMap: () => NEEDS_MAP,
        selectNeed,
        resetFilters
    };

})();
