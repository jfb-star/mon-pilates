/**
 * Mon Pilates - Checkout Wizard
 * Navigation et validation pour le wizard 4 étapes (template PHP)
 */
(function($) {
    'use strict';

    var currentStep = 1;

    $(document).ready(function() {
        if (!$('form.mp-checkout-wizard').length) return;
        bindEvents();
    });

    // ── Navigation ──

    function showStep(step) {
        currentStep = step;

        // Panels
        $('.mp-checkout-panel').removeClass('is-visible');
        $('.mp-checkout-panel[data-step="' + step + '"]').addClass('is-visible');

        // Step indicators
        $('.mp-checkout-step-indicator').each(function() {
            var s = parseInt($(this).data('step'));
            $(this).removeClass('is-active is-done');
            if (s === step) {
                $(this).addClass('is-active');
            } else if (s < step) {
                $(this).addClass('is-done');
            }
        });

        // Scroll vers le haut
        var $steps = $('.mp-checkout-steps');
        if ($steps.length && $steps.offset()) {
            $('html, body').animate({
                scrollTop: $steps.offset().top - 20
            }, 400);
        }

        // Refresh checkout au step paiement (pour Stripe)
        if (step === 4) {
            $(document.body).trigger('update_checkout');
        }
    }

    // ── Validation ──

    function validateStep(step) {
        if (step === 2) return validateBeneficiary();
        if (step === 3) return validateBilling();
        return true;
    }

    function validateBeneficiary() {
        var ok = true;
        var $email = $('#mpgc_recipient_email');
        var $emailConfirm = $('#mpgc_recipient_email_confirm');

        clearErrors();

        if (!$email.val() || !isEmail($email.val())) {
            fieldError($email, 'Veuillez entrer un email valide');
            ok = false;
        }

        if (!$emailConfirm.val()) {
            fieldError($emailConfirm, 'Veuillez confirmer l\u2019email');
            ok = false;
        } else if ($email.val() && $emailConfirm.val() !== $email.val()) {
            fieldError($emailConfirm, 'Les emails ne correspondent pas');
            ok = false;
        }

        if (!ok) scrollToFirstError();
        return ok;
    }

    function validateBilling() {
        var ok = true;
        var checks = [
            { sel: '#billing_first_name', msg: 'Le pr\u00e9nom est requis' },
            { sel: '#billing_last_name',  msg: 'Le nom est requis' },
            { sel: '#billing_email',      msg: 'L\u2019email est requis' }
        ];

        clearErrors();

        checks.forEach(function(c) {
            var $f = $(c.sel);
            if ($f.length && !$f.val().trim()) {
                fieldError($f, c.msg);
                ok = false;
            }
        });

        var be = $('#billing_email').val();
        if (be && !isEmail(be)) {
            fieldError($('#billing_email'), 'Email invalide');
            ok = false;
        }

        if (!ok) scrollToFirstError();
        return ok;
    }

    function fieldError($el, msg) {
        $el.addClass('mp-field-error');
        if (!$el.next('.mp-field-error-msg').length) {
            $el.after('<span class="mp-field-error-msg">' + esc(msg) + '</span>');
        }
    }

    function clearErrors() {
        $('.mp-field-error').removeClass('mp-field-error');
        $('.mp-field-error-msg').remove();
    }

    function scrollToFirstError() {
        var $f = $('.mp-field-error:first');
        if ($f.length && $f.offset()) {
            $('html, body').animate({ scrollTop: $f.offset().top - 100 }, 400);
        }
    }

    // ── Helpers ──

    function isEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function esc(str) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(str || ''));
        return d.innerHTML;
    }

    // ── Events ──

    function bindEvents() {
        $(document).on('click', '.mp-btn-next', function(e) {
            e.preventDefault();
            var next = parseInt($(this).data('next'));
            if (validateStep(currentStep)) {
                showStep(next);
            }
        });

        $(document).on('click', '.mp-btn-prev', function(e) {
            e.preventDefault();
            showStep(parseInt($(this).data('prev')));
        });

        $(document).on('click', '.mp-checkout-step-indicator.is-done', function() {
            showStep(parseInt($(this).data('step')));
        });

        $(document).on('focus', '.mp-field-error', function() {
            $(this).removeClass('mp-field-error');
            $(this).next('.mp-field-error-msg').remove();
        });
    }

})(jQuery);
