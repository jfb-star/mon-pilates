<?php
/**
 * Gestion des champs checkout pour les cartes cadeaux
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

class MPGC_Checkout {

    /**
     * Constructeur
     */
    public function __construct() {
        // Ajouter les champs au checkout
        add_action( 'woocommerce_after_order_notes', array( $this, 'add_gift_card_fields' ) );

        // Valider les champs
        add_action( 'woocommerce_checkout_process', array( $this, 'validate_gift_card_fields' ) );

        // Sauvegarder les données
        add_action( 'woocommerce_checkout_create_order', array( $this, 'save_gift_card_data' ), 10, 2 );

        // Après paiement réussi
        add_action( 'woocommerce_payment_complete', array( $this, 'process_gift_card_order' ), 10, 1 );
        add_action( 'woocommerce_order_status_completed', array( $this, 'process_gift_card_order' ), 10, 1 );
        add_action( 'woocommerce_order_status_processing', array( $this, 'process_gift_card_order' ), 10, 1 );

        // Masquer les champs de livraison si uniquement cartes cadeaux
        add_filter( 'woocommerce_cart_needs_shipping', array( $this, 'cart_needs_shipping' ) );
    }

    /**
     * Vérifier si le panier contient des cartes cadeaux
     */
    private function cart_has_gift_cards() {
        if ( ! WC()->cart ) {
            return false;
        }

        foreach ( WC()->cart->get_cart() as $cart_item ) {
            if ( MonPilates_GiftCards::is_gift_card_product( $cart_item['product_id'] ) ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Pas de livraison pour les cartes cadeaux
     */
    public function cart_needs_shipping( $needs_shipping ) {
        if ( $this->cart_has_gift_cards() ) {
            // Vérifier si TOUS les produits sont des cartes cadeaux
            $all_gift_cards = true;
            foreach ( WC()->cart->get_cart() as $cart_item ) {
                if ( ! MonPilates_GiftCards::is_gift_card_product( $cart_item['product_id'] ) ) {
                    $all_gift_cards = false;
                    break;
                }
            }

            if ( $all_gift_cards ) {
                return false;
            }
        }

        return $needs_shipping;
    }

    /**
     * Ajouter les champs carte cadeau au checkout
     */
    public function add_gift_card_fields( $checkout ) {
        if ( ! $this->cart_has_gift_cards() ) {
            return;
        }

        // Obtenir les infos des cartes dans le panier
        $gift_cards_in_cart = array();
        foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
            if ( MonPilates_GiftCards::is_gift_card_product( $cart_item['product_id'] ) ) {
                $product = wc_get_product( $cart_item['product_id'] );
                $sessions = MonPilates_GiftCards::get_product_sessions( $cart_item['product_id'] );
                $gift_cards_in_cart[] = array(
                    'key'      => $cart_item_key,
                    'name'     => $product->get_name(),
                    'sessions' => $sessions,
                    'qty'      => $cart_item['quantity'],
                );
            }
        }

        ?>
        <div id="mpgc-gift-card-fields" class="mpgc-checkout-section">
            <h3><?php esc_html_e( '🎁 Informations de la carte cadeau', 'monpilates-giftcards' ); ?></h3>

            <div class="mpgc-gift-summary">
                <p class="mpgc-summary-intro">
                    Vous offrez :
                    <?php foreach ( $gift_cards_in_cart as $gc ) : ?>
                        <strong><?php echo esc_html( $gc['name'] ); ?></strong>
                        <?php if ( $gc['qty'] > 1 ) : ?> (x<?php echo esc_html( $gc['qty'] ); ?>)<?php endif; ?>
                    <?php endforeach; ?>
                </p>
            </div>

            <p class="form-row form-row-wide">
                <label for="mpgc_recipient_email">
                    <?php esc_html_e( 'Email du destinataire', 'monpilates-giftcards' ); ?>
                    <abbr class="required" title="obligatoire">*</abbr>
                </label>
                <input type="email"
                       class="input-text"
                       name="mpgc_recipient_email"
                       id="mpgc_recipient_email"
                       placeholder="email@exemple.com"
                       maxlength="254"
                       value="<?php echo esc_attr( WC()->checkout->get_value( 'mpgc_recipient_email' ) ); ?>"
                       required>
                <span class="mpgc-field-note">La carte cadeau sera envoyée à cette adresse. Cette donnée est utilisée uniquement pour la livraison de votre carte cadeau.</span>
            </p>

            <p class="form-row form-row-wide">
                <label for="mpgc_recipient_email_confirm">
                    <?php esc_html_e( 'Confirmer l\'email du destinataire', 'monpilates-giftcards' ); ?>
                    <abbr class="required" title="obligatoire">*</abbr>
                </label>
                <input type="email"
                       class="input-text"
                       name="mpgc_recipient_email_confirm"
                       id="mpgc_recipient_email_confirm"
                       placeholder="email@exemple.com"
                       maxlength="254"
                       value="<?php echo esc_attr( WC()->checkout->get_value( 'mpgc_recipient_email_confirm' ) ); ?>"
                       required>
            </p>

            <p class="form-row form-row-wide">
                <label for="mpgc_recipient_name">
                    <?php esc_html_e( 'Nom du bénéficiaire', 'monpilates-giftcards' ); ?>
                    <span class="optional">(optionnel)</span>
                </label>
                <input type="text"
                       class="input-text"
                       name="mpgc_recipient_name"
                       id="mpgc_recipient_name"
                       placeholder="Prénom du destinataire"
                       maxlength="100"
                       value="<?php echo esc_attr( WC()->checkout->get_value( 'mpgc_recipient_name' ) ); ?>">
                <span class="mpgc-field-note">Apparaîtra sur la carte cadeau imprimée.</span>
            </p>

            <p class="form-row form-row-wide">
                <label for="mpgc_personal_message">
                    <?php esc_html_e( 'Message personnel', 'monpilates-giftcards' ); ?>
                    <span class="optional">(optionnel, max 200 caractères)</span>
                </label>
                <textarea name="mpgc_personal_message"
                          id="mpgc_personal_message"
                          class="input-text"
                          rows="3"
                          maxlength="200"
                          placeholder="Un petit mot pour accompagner votre cadeau..."><?php echo esc_textarea( WC()->checkout->get_value( 'mpgc_personal_message' ) ); ?></textarea>
                <span class="mpgc-char-count"><span id="mpgc-char-current">0</span>/200</span>
            </p>

            <p class="form-row form-row-wide mpgc-checkbox-row">
                <label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
                    <input type="checkbox"
                           class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox"
                           name="mpgc_email_confirm_checkbox"
                           id="mpgc_email_confirm_checkbox"
                           value="1">
                    <span class="mpgc-checkbox-text">
                        <?php esc_html_e( 'Je confirme que l\'adresse email du destinataire est correcte.', 'monpilates-giftcards' ); ?>
                    </span>
                </label>
            </p>

            <div class="mpgc-info-box">
                <p>
                    <strong>📧 Comment ça marche ?</strong><br>
                    Après votre paiement, vous recevrez immédiatement un email avec la carte cadeau en PDF à imprimer ou transférer.
                    Le destinataire pourra l'utiliser pour réserver ses séances.
                </p>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            // Compteur de caractères
            $('#mpgc_personal_message').on('input', function() {
                $('#mpgc-char-current').text($(this).val().length);
            });

            // Vérification email en temps réel
            $('#mpgc_recipient_email_confirm').on('blur', function() {
                var email1 = $('#mpgc_recipient_email').val();
                var email2 = $(this).val();
                if (email1 && email2 && email1 !== email2) {
                    $(this).addClass('mpgc-error');
                    if (!$('#mpgc-email-mismatch').length) {
                        $(this).after('<span id="mpgc-email-mismatch" class="mpgc-error-msg">Les emails ne correspondent pas.</span>');
                    }
                } else {
                    $(this).removeClass('mpgc-error');
                    $('#mpgc-email-mismatch').remove();
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Valider les champs carte cadeau
     */
    public function validate_gift_card_fields() {
        if ( ! $this->cart_has_gift_cards() ) {
            return;
        }

        $recipient_email = isset( $_POST['mpgc_recipient_email'] ) ? sanitize_email( $_POST['mpgc_recipient_email'] ) : '';
        $recipient_email_confirm = isset( $_POST['mpgc_recipient_email_confirm'] ) ? sanitize_email( $_POST['mpgc_recipient_email_confirm'] ) : '';

        // Email obligatoire
        if ( empty( $recipient_email ) ) {
            wc_add_notice(
                __( 'Veuillez renseigner l\'email du destinataire de la carte cadeau.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }

        // Email valide
        if ( ! is_email( $recipient_email ) ) {
            wc_add_notice(
                __( 'L\'adresse email du destinataire n\'est pas valide.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }

        // Confirmation email obligatoire
        if ( empty( $recipient_email_confirm ) ) {
            wc_add_notice(
                __( 'Veuillez confirmer l\'email du destinataire.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }

        // Les deux emails doivent correspondre
        if ( $recipient_email !== $recipient_email_confirm ) {
            wc_add_notice(
                __( 'Les deux adresses email ne correspondent pas. Veuillez vérifier.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }

        // B1 : Nom bénéficiaire — longueur max
        $recipient_name = isset( $_POST['mpgc_recipient_name'] ) ? sanitize_text_field( $_POST['mpgc_recipient_name'] ) : '';
        if ( mb_strlen( $recipient_name ) > 100 ) {
            wc_add_notice(
                __( 'Le nom du bénéficiaire ne doit pas dépasser 100 caractères.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }

        // Message personnel : longueur max
        $personal_message = isset( $_POST['mpgc_personal_message'] ) ? sanitize_textarea_field( $_POST['mpgc_personal_message'] ) : '';
        if ( mb_strlen( $personal_message, 'UTF-8' ) > 200 ) {
            wc_add_notice(
                __( 'Le message personnel ne doit pas dépasser 200 caractères.', 'monpilates-giftcards' ),
                'error'
            );
            return;
        }
    }

    /**
     * Sauvegarder les données carte cadeau dans la commande
     */
    public function save_gift_card_data( $order, $data ) {
        if ( ! $this->cart_has_gift_cards() ) {
            return;
        }

        $recipient_email = isset( $_POST['mpgc_recipient_email'] ) ? sanitize_email( $_POST['mpgc_recipient_email'] ) : '';
        $recipient_name = isset( $_POST['mpgc_recipient_name'] ) ? sanitize_text_field( $_POST['mpgc_recipient_name'] ) : '';
        $personal_message = isset( $_POST['mpgc_personal_message'] ) ? sanitize_textarea_field( $_POST['mpgc_personal_message'] ) : '';

        // Métadonnées carte cadeau
        $order->update_meta_data( '_mpgc_is_gift_card_order', 'yes' );
        $order->update_meta_data( '_mpgc_recipient_email', $recipient_email );
        $order->update_meta_data( '_mpgc_recipient_name', $recipient_name );
        $order->update_meta_data( '_mpgc_personal_message', $personal_message );
        $order->update_meta_data( '_mpgc_activation_status', 'pending' ); // pending, activated
        $order->update_meta_data( '_mpgc_pdf_generated', 'no' );

        // Nombre total de séances
        $total_sessions = 0;
        foreach ( WC()->cart->get_cart() as $cart_item ) {
            if ( MonPilates_GiftCards::is_gift_card_product( $cart_item['product_id'] ) ) {
                $sessions = MonPilates_GiftCards::get_product_sessions( $cart_item['product_id'] );
                $total_sessions += $sessions * $cart_item['quantity'];
            }
        }
        $order->update_meta_data( '_mpgc_total_sessions', $total_sessions );
    }

    /**
     * Traiter la commande carte cadeau après paiement
     */
    public function process_gift_card_order( $order_id ) {
        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            return;
        }

        // Vérifier si c'est une commande carte cadeau
        if ( 'yes' !== $order->get_meta( '_mpgc_is_gift_card_order' ) ) {
            return;
        }

        // Vérifier si le PDF a déjà été généré
        if ( 'yes' === $order->get_meta( '_mpgc_pdf_generated' ) ) {
            return;
        }

        // Générer le PDF
        $pdf_path = MPGC()->pdf->generate_gift_card_pdf( $order );

        if ( $pdf_path ) {
            // Marquer comme généré
            $order->update_meta_data( '_mpgc_pdf_generated', 'yes' );
            $order->update_meta_data( '_mpgc_pdf_path', $pdf_path );
            $order->save();

            // Envoyer l'email
            MPGC()->emails->send_gift_card_email( $order );

            // Log
            $order->add_order_note(
                __( '🎁 Carte cadeau PDF générée et email envoyé.', 'monpilates-giftcards' )
            );
        } else {
            $order->add_order_note(
                __( '❌ Erreur lors de la génération du PDF carte cadeau.', 'monpilates-giftcards' )
            );
        }
    }
}
