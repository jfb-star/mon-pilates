/**
 * Mon Pilates Gift Cards - Frontend JavaScript
 *
 * @package MonPilates_GiftCards
 */

(function($) {
    'use strict';

    /**
     * Validation des champs carte cadeau au checkout
     */
    function initCheckoutValidation() {
        // Compteur de caractères pour le message personnel
        var messageField = $('#mpgc_personal_message');
        var charCounter = $('#mpgc-char-current');

        if (messageField.length && charCounter.length) {
            messageField.on('input', function() {
                charCounter.text($(this).val().length);
            });

            // Initialiser le compteur
            charCounter.text(messageField.val().length);
        }

        // Validation email en temps réel
        var email1 = $('#mpgc_recipient_email');
        var email2 = $('#mpgc_recipient_email_confirm');

        if (email1.length && email2.length) {
            email2.on('blur', function() {
                validateEmails();
            });

            email1.on('input', function() {
                // Effacer l'erreur quand on modifie le premier email
                email2.removeClass('mpgc-error');
                $('#mpgc-email-mismatch').remove();
            });
        }
    }

    /**
     * Valider la correspondance des emails
     */
    function validateEmails() {
        var email1 = $('#mpgc_recipient_email').val();
        var email2 = $('#mpgc_recipient_email_confirm').val();
        var field2 = $('#mpgc_recipient_email_confirm');

        if (email1 && email2 && email1 !== email2) {
            field2.addClass('mpgc-error');
            if (!$('#mpgc-email-mismatch').length) {
                field2.after('<span id="mpgc-email-mismatch" class="mpgc-error-msg">Les adresses email ne correspondent pas.</span>');
            }
            return false;
        } else {
            field2.removeClass('mpgc-error');
            $('#mpgc-email-mismatch').remove();
            return true;
        }
    }

    /**
     * Validation au submit du formulaire checkout
     */
    function initCheckoutSubmitValidation() {
        $('form.checkout').on('checkout_place_order', function() {
            // Vérifier si des cartes cadeaux sont dans le panier
            if ($('#mpgc-gift-card-fields').length === 0) {
                return true;
            }

            // Valider les emails
            if (!validateEmails()) {
                // Scroll vers l'erreur
                $('html, body').animate({
                    scrollTop: $('#mpgc_recipient_email_confirm').offset().top - 100
                }, 500);
                return false;
            }

            return true;
        });
    }

    /**
     * Formulaire de renvoi carte cadeau
     */
    function initResendForm() {
        var form = $('#mpgc-resend-form');

        if (form.length === 0) {
            return;
        }

        form.on('submit', function(e) {
            e.preventDefault();

            var button = form.find('.mpgc-resend-button');
            var buttonText = button.find('.mpgc-resend-button-text');
            var buttonLoading = button.find('.mpgc-resend-button-loading');
            var messageBox = $('#mpgc-resend-message');
            var email = $('#mpgc-resend-email').val();

            // Validation basique
            if (!email || !isValidEmail(email)) {
                showMessage(messageBox, 'error', 'Veuillez entrer une adresse email valide.');
                return;
            }

            // Désactiver le bouton
            button.prop('disabled', true);
            buttonText.hide();
            buttonLoading.show();
            messageBox.hide();

            // Envoyer la requête
            $.ajax({
                url: mpgc_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'mpgc_resend_card',
                    email: email,
                    nonce: mpgc_ajax.nonce
                },
                success: function(response) {
                    if (response.success) {
                        showMessage(messageBox, 'success', response.data.message);
                        form.find('input[type="email"]').val('');
                    } else {
                        showMessage(messageBox, 'error', response.data.message);
                    }
                },
                error: function() {
                    showMessage(messageBox, 'error', 'Une erreur est survenue. Veuillez réessayer.');
                },
                complete: function() {
                    button.prop('disabled', false);
                    buttonText.show();
                    buttonLoading.hide();
                }
            });
        });
    }

    /**
     * Afficher un message
     */
    function showMessage(element, type, message) {
        element.removeClass('success error')
               .addClass(type)
               .text(message)
               .show();
    }

    /**
     * Valider un email
     */
    function isValidEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Initialisation
     */
    $(document).ready(function() {
        initCheckoutValidation();
        initCheckoutSubmitValidation();
        initResendForm();
    });

    // Re-initialiser après les updates AJAX de WooCommerce
    $(document.body).on('updated_checkout', function() {
        initCheckoutValidation();
    });

})(jQuery);
