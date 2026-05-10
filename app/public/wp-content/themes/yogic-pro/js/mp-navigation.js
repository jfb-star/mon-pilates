/**
 * Mon Pilates - Navigation Premium
 * JavaScript pour les interactions fluides et accessibles
 *
 * Fonctionnalités :
 * - Header sticky avec changement d'état au scroll
 * - Menu mobile avec overlay
 * - Sous-menus accordéon sur mobile
 * - Support préférence mouvement réduit
 * - Gestion focus pour accessibilité
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================

    const CONFIG = {
        scrollThreshold: 50,           // Pixels avant de déclencher l'état "scrolled"
        mobileBreakpoint: 768,         // Breakpoint mobile en pixels
        animationDuration: 600,        // Durée animations en ms (sync avec CSS)
    };

    // ==========================================================================
    // ÉLÉMENTS DOM
    // ==========================================================================

    const elements = {
        header: null,
        toggle: null,
        mobileMenu: null,
        mobileBackdrop: null,
        mobileClose: null,
        mobileNav: null,
        body: document.body
    };

    // ==========================================================================
    // ÉTAT
    // ==========================================================================

    let state = {
        isScrolled: false,
        isMobileMenuOpen: false,
        lastScrollY: 0,
        prefersReducedMotion: false
    };

    // ==========================================================================
    // INITIALISATION
    // ==========================================================================

    function init() {
        // Récupérer les éléments DOM
        elements.header = document.querySelector('.mp-header');
        elements.toggle = document.querySelector('.mp-toggle');
        elements.mobileMenu = document.querySelector('.mp-mobile-menu');
        elements.mobileBackdrop = document.querySelector('.mp-mobile-menu__backdrop');
        elements.mobileClose = document.querySelector('.mp-mobile-menu__close');
        elements.mobileNav = document.querySelector('.mp-mobile-menu__nav');

        if (!elements.header) {
            console.warn('Mon Pilates Navigation: Header element not found');
            return;
        }

        // Vérifier préférence mouvement réduit
        state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initialiser les fonctionnalités
        initScrollHandler();
        initMobileMenu();
        initMobileSubmenus();
        initParentLinks();
        initKeyboardNavigation();

        // Écouter les changements de préférence mouvement
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            state.prefersReducedMotion = e.matches;
        });

        // État initial du header
        updateHeaderState();
    }

    // ==========================================================================
    // GESTION DU SCROLL - Header sticky
    // ==========================================================================

    function initScrollHandler() {
        // Utiliser requestAnimationFrame pour des performances optimales
        let ticking = false;

        function onScroll() {
            state.lastScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateHeaderState();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function updateHeaderState() {
        const shouldBeScrolled = state.lastScrollY > CONFIG.scrollThreshold;

        if (shouldBeScrolled !== state.isScrolled) {
            state.isScrolled = shouldBeScrolled;
            elements.header.setAttribute('data-state', shouldBeScrolled ? 'scrolled' : 'top');
            elements.body.classList.toggle('mp-scrolled', shouldBeScrolled);
        }
    }

    // ==========================================================================
    // MENU MOBILE - Toggle et overlay
    // ==========================================================================

    function initMobileMenu() {
        if (!elements.toggle || !elements.mobileMenu) return;

        // Toggle button click
        elements.toggle.addEventListener('click', toggleMobileMenu);

        // Fermer en cliquant sur le backdrop
        if (elements.mobileBackdrop) {
            elements.mobileBackdrop.addEventListener('click', closeMobileMenu);
        }

        // Fermer en cliquant sur le bouton X
        if (elements.mobileClose) {
            elements.mobileClose.addEventListener('click', closeMobileMenu);
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                closeMobileMenu();
                elements.toggle.focus();
            }
        });

        // Fermer si on redimensionne au-dessus du breakpoint mobile
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > CONFIG.mobileBreakpoint && state.isMobileMenuOpen) {
                closeMobileMenu();
            }
        }, 150));
    }

    function toggleMobileMenu() {
        if (state.isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        state.isMobileMenuOpen = true;

        elements.toggle.setAttribute('aria-expanded', 'true');
        elements.mobileMenu.setAttribute('aria-hidden', 'false');
        elements.body.classList.add('mp-menu-open');

        // Focus trap - premier élément focusable
        setTimeout(() => {
            const firstLink = elements.mobileNav.querySelector('a');
            if (firstLink) firstLink.focus();
        }, CONFIG.animationDuration);
    }

    function closeMobileMenu() {
        state.isMobileMenuOpen = false;

        elements.toggle.setAttribute('aria-expanded', 'false');
        elements.mobileMenu.setAttribute('aria-hidden', 'true');
        elements.body.classList.remove('mp-menu-open');

        // Fermer tous les sous-menus
        const openSubmenus = elements.mobileNav.querySelectorAll('.submenu-open');
        openSubmenus.forEach(item => item.classList.remove('submenu-open'));
    }

    // ==========================================================================
    // SOUS-MENUS MOBILE - Accordéon
    // ==========================================================================

    function initMobileSubmenus() {
        if (!elements.mobileNav) return;

        const parentItems = elements.mobileNav.querySelectorAll('.menu-item-has-children > a');

        parentItems.forEach(link => {
            link.addEventListener('click', (e) => {
                // Seulement sur mobile
                if (window.innerWidth > CONFIG.mobileBreakpoint) return;

                const parentLi = link.parentElement;
                const submenu = parentLi.querySelector('.sub-menu');

                if (submenu) {
                    e.preventDefault();
                    parentLi.classList.toggle('submenu-open');
                }
            });
        });
    }

    // ==========================================================================
    // LIENS PARENTS DESKTOP - Empêcher la navigation
    // ==========================================================================

    function initParentLinks() {
        const parentLinks = document.querySelectorAll('.mp-nav__link--parent');

        parentLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });

            // Curseur par défaut au lieu du pointeur
            link.style.cursor = 'default';
        });
    }

    // ==========================================================================
    // NAVIGATION CLAVIER - Accessibilité
    // ==========================================================================

    function initKeyboardNavigation() {
        // Gestion des sous-menus desktop au clavier
        const menuItems = document.querySelectorAll('.mp-nav .menu-item-has-children');

        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.sub-menu');

            if (!link || !submenu) return;

            // Ouvrir/fermer avec Enter ou Space
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Si c'est un lien avec sous-menu, toggle au lieu de naviguer
                    if (submenu && window.innerWidth > CONFIG.mobileBreakpoint) {
                        // Permettre la navigation, le sous-menu s'affiche au focus
                    }
                }

                // Navigation avec flèches
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const firstSubmenuLink = submenu.querySelector('a');
                    if (firstSubmenuLink) firstSubmenuLink.focus();
                }
            });

            // Focus sur le parent affiche le sous-menu
            item.addEventListener('focusin', () => {
                item.classList.add('focus-within');
            });

            item.addEventListener('focusout', (e) => {
                // Vérifier si le focus reste dans l'item
                setTimeout(() => {
                    if (!item.contains(document.activeElement)) {
                        item.classList.remove('focus-within');
                    }
                }, 10);
            });
        });

        // Navigation dans les sous-menus avec flèches
        document.querySelectorAll('.mp-nav .sub-menu a').forEach(link => {
            link.addEventListener('keydown', (e) => {
                const li = link.parentElement;
                const siblings = Array.from(li.parentElement.children);
                const index = siblings.indexOf(li);

                if (e.key === 'ArrowDown' && index < siblings.length - 1) {
                    e.preventDefault();
                    siblings[index + 1].querySelector('a').focus();
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index > 0) {
                        siblings[index - 1].querySelector('a').focus();
                    } else {
                        // Remonter au parent
                        const parentLink = li.closest('.menu-item-has-children').querySelector('a');
                        if (parentLink) parentLink.focus();
                    }
                }

                if (e.key === 'Escape') {
                    const parentLink = li.closest('.menu-item-has-children').querySelector('a');
                    if (parentLink) parentLink.focus();
                }
            });
        });
    }

    // ==========================================================================
    // UTILITAIRES
    // ==========================================================================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==========================================================================
    // SMOOTH SCROLL - Pour les ancres
    // ==========================================================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    // Fermer le menu mobile si ouvert
                    if (state.isMobileMenuOpen) {
                        closeMobileMenu();
                    }

                    // Calculer l'offset avec la hauteur du header
                    const headerHeight = state.isScrolled
                        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mp-header-height-scrolled'))
                        : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mp-header-height'));

                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    // Scroll fluide ou instantané selon préférence
                    if (state.prefersReducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ==========================================================================
    // DÉMARRAGE
    // ==========================================================================

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initSmoothScroll();
        });
    } else {
        init();
        initSmoothScroll();
    }

})();
