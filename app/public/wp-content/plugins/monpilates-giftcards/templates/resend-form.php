<?php
/**
 * Template: Formulaire de renvoi de carte cadeau
 *
 * Shortcode: [mpgc_resend_form]
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="mpgc-resend-section">
    <div class="mpgc-resend-box">
        <div class="mpgc-resend-icon">
            📧
        </div>
        <h3 class="mpgc-resend-title">Vous n'avez pas reçu votre carte cadeau ?</h3>
        <p class="mpgc-resend-description">
            Entrez l'adresse email utilisée lors de l'achat ou l'email du destinataire.<br>
            Nous vous renverrons la carte cadeau immédiatement.
        </p>

        <form id="mpgc-resend-form" class="mpgc-resend-form">
            <!-- Honeypot anti-spam -->
            <input type="text" name="mpgc_website" value=""
                   style="position:absolute;left:-9999px;opacity:0;height:0;width:0;"
                   tabindex="-1" autocomplete="off" aria-hidden="true">

            <div class="mpgc-resend-input-group">
                <input type="email"
                       id="mpgc-resend-email"
                       name="email"
                       placeholder="votre@email.com"
                       maxlength="254"
                       required
                       class="mpgc-resend-input">
                <button type="submit" class="mpgc-resend-button">
                    <span class="mpgc-resend-button-text">Renvoyer</span>
                    <span class="mpgc-resend-button-loading" style="display: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                                <animate attributeName="stroke-dashoffset" dur="1s" values="32;0" repeatCount="indefinite"/>
                            </circle>
                        </svg>
                    </span>
                </button>
            </div>
            <div id="mpgc-resend-message" class="mpgc-resend-message" style="display: none;"></div>
        </form>

        <p class="mpgc-resend-note">
            <small>Un problème ? Contactez-nous directement au <a href="tel:+33699183216">06 99 18 32 16</a></small>
        </p>
    </div>
</div>

<style>
.mpgc-resend-section {
    padding: 40px 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 20px;
    margin: 40px 0;
}

.mpgc-resend-box {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
}

.mpgc-resend-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.mpgc-resend-title {
    font-size: 22px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 10px;
}

.mpgc-resend-description {
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 25px;
}

.mpgc-resend-form {
    margin: 0;
}

.mpgc-resend-input-group {
    display: flex;
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
}

.mpgc-resend-input {
    flex: 1;
    padding: 14px 18px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 50px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.mpgc-resend-input:focus {
    border-color: #7fa8b6;
    box-shadow: 0 0 0 3px rgba(127, 168, 182, 0.2);
}

.mpgc-resend-button {
    padding: 14px 28px;
    background: #cf317c;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    white-space: nowrap;
}

.mpgc-resend-button:hover {
    background: #b82a6a;
    transform: translateY(-1px);
}

.mpgc-resend-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.mpgc-resend-message {
    margin-top: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
}

.mpgc-resend-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.mpgc-resend-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.mpgc-resend-note {
    margin-top: 20px;
    font-size: 13px;
    color: #888;
}

.mpgc-resend-note a {
    color: #7fa8b6;
    text-decoration: none;
}

.mpgc-resend-note a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .mpgc-resend-input-group {
        flex-direction: column;
    }

    .mpgc-resend-button {
        width: 100%;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    $('#mpgc-resend-form').on('submit', function(e) {
        e.preventDefault();

        var form = $(this);
        var button = form.find('.mpgc-resend-button');
        var buttonText = button.find('.mpgc-resend-button-text');
        var buttonLoading = button.find('.mpgc-resend-button-loading');
        var messageBox = $('#mpgc-resend-message');
        var email = $('#mpgc-resend-email').val();

        // Validation basique
        if (!email || !email.includes('@')) {
            messageBox.removeClass('success').addClass('error')
                .text('Veuillez entrer une adresse email valide.')
                .show();
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
                messageBox.removeClass('error success');

                if (response.success) {
                    messageBox.addClass('success').text(response.data.message);
                    form.find('input').val('');
                } else {
                    messageBox.addClass('error').text(response.data.message);
                }

                messageBox.show();
            },
            error: function() {
                messageBox.removeClass('success').addClass('error')
                    .text('Une erreur est survenue. Veuillez réessayer.')
                    .show();
            },
            complete: function() {
                button.prop('disabled', false);
                buttonText.show();
                buttonLoading.hide();
            }
        });
    });
});
</script>
