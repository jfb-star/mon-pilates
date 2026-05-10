<?php
/**
 * Gestion des emails pour les cartes cadeaux
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

class MPGC_Emails {

    /**
     * Constructeur
     */
    public function __construct() {
        // Modifier l'email de commande WooCommerce pour les cartes cadeaux
        add_action( 'woocommerce_email_order_details', array( $this, 'add_gift_card_info_to_email' ), 15, 4 );
    }

    /**
     * Envoyer l'email de carte cadeau au payeur
     */
    public function send_gift_card_email( $order ) {
        if ( ! $order ) {
            return false;
        }

        $to = $order->get_billing_email();
        $subject = $this->get_email_subject( $order );
        $message = $this->get_email_content( $order );
        $headers = $this->get_email_headers();

        // Envoyer l'email
        $sent = wp_mail( $to, $subject, $message, $headers );

        if ( $sent ) {
            $order->add_order_note(
                sprintf(
                    __( '📧 Email carte cadeau envoyé à %s', 'monpilates-giftcards' ),
                    $to
                )
            );

            // Marquer l'email comme envoyé
            $order->update_meta_data( '_mpgc_email_sent', 'yes' );
            $order->update_meta_data( '_mpgc_email_sent_date', current_time( 'mysql' ) );
            $order->save();
        } else {
            $order->add_order_note(
                sprintf(
                    __( '❌ Échec de l\'envoi de l\'email carte cadeau à %s', 'monpilates-giftcards' ),
                    $to
                )
            );
        }

        return $sent;
    }

    /**
     * Renvoyer l'email de carte cadeau
     */
    public function resend_gift_card_email( $order_id ) {
        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            return false;
        }

        // Vérifier que c'est bien une commande carte cadeau
        if ( 'yes' !== $order->get_meta( '_mpgc_is_gift_card_order' ) ) {
            return false;
        }

        // Vérifier que le PDF existe
        if ( 'yes' !== $order->get_meta( '_mpgc_pdf_generated' ) ) {
            // Régénérer le PDF si nécessaire
            MPGC()->pdf->generate_gift_card_pdf( $order );
        }

        return $this->send_gift_card_email( $order );
    }

    /**
     * Obtenir le sujet de l'email
     */
    private function get_email_subject( $order ) {
        $total_sessions = $order->get_meta( '_mpgc_total_sessions' );
        $recipient_name = $order->get_meta( '_mpgc_recipient_name' );

        // R1 : Nettoyer CRLF pour empêcher toute header injection
        $recipient_name = str_replace( array( "\r", "\n", "\t" ), '', $recipient_name );

        if ( ! empty( $recipient_name ) ) {
            return sprintf(
                '🎁 Votre carte cadeau Mon Pilates pour %s est prête !',
                $recipient_name
            );
        }

        return '🎁 Votre carte cadeau Mon Pilates est prête !';
    }

    /**
     * Obtenir les en-têtes de l'email
     *
     * B2 : On ne force PAS le header From ici.
     * WP Mail SMTP gère le From (adresse + nom) via ses propres réglages.
     * Forcer un From en dur court-circuiterait SPF/DKIM/DMARC configurés dans WP Mail SMTP.
     */
    private function get_email_headers() {
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
        );

        return $headers;
    }

    /**
     * Générer le contenu de l'email
     */
    private function get_email_content( $order ) {
        $order_id = $order->get_id();
        $buyer_name = $order->get_billing_first_name();
        $recipient_name = $order->get_meta( '_mpgc_recipient_name' );
        $recipient_email = $order->get_meta( '_mpgc_recipient_email' );
        $total_sessions = $order->get_meta( '_mpgc_total_sessions' );
        $pdf_url = MPGC()->pdf->get_pdf_download_url( $order );

        // Texte des séances
        if ( $total_sessions == 1 ) {
            $sessions_text = '1 séance de Pilates';
        } else {
            $sessions_text = $total_sessions . ' séances de Pilates';
        }

        // Couleurs
        $color_ocean = MPGC_COLOR_OCEAN;
        $color_rose = MPGC_COLOR_ROSE;
        $color_dark = MPGC_COLOR_DARK;

        ob_start();
        ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre carte cadeau Mon Pilates</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, <?php echo $color_ocean; ?> 0%, #5a8a9a 100%); padding: 40px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px; font-weight: 700;">MON PILATES</h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Larmor-Plage • Face à la mer</p>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: <?php echo $color_dark; ?>; font-size: 24px; margin: 0 0 20px; text-align: center;">
                                🎁 Votre carte cadeau est prête !
                            </h2>

                            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Bonjour <?php echo esc_html( $buyer_name ); ?>,
                            </p>

                            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Merci pour votre achat ! Votre carte cadeau <strong><?php echo esc_html( $sessions_text ); ?></strong> est maintenant disponible.
                            </p>

                            <?php if ( ! empty( $recipient_name ) ) : ?>
                            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Elle est destinée à <strong><?php echo esc_html( $recipient_name ); ?></strong>.
                            </p>
                            <?php endif; ?>

                            <!-- Bouton téléchargement -->
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="<?php echo esc_url( $pdf_url ); ?>"
                                           style="display: inline-block; background: <?php echo $color_rose; ?>; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(207, 49, 124, 0.3);">
                                            📄 Télécharger la carte cadeau
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Info box -->
                            <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 12px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="color: <?php echo $color_dark; ?>; font-size: 16px; margin: 0 0 15px;">
                                            📋 Comment utiliser cette carte ?
                                        </h3>
                                        <ol style="color: #555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                            <li>Imprimez ou transférez cette carte au bénéficiaire</li>
                                            <li>Le bénéficiaire contacte le studio pour sa première réservation</li>
                                            <li>Les séances sont créditées sur son compte lors de la première venue</li>
                                        </ol>
                                    </td>
                                </tr>
                            </table>

                            <!-- Récapitulatif -->
                            <table role="presentation" style="width: 100%; border: 1px solid #eee; border-radius: 12px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px; border-bottom: 1px solid #eee;">
                                        <strong style="color: <?php echo $color_dark; ?>;">Récapitulatif</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="color: #888; font-size: 14px; padding: 5px 0;">N° de commande</td>
                                                <td style="color: <?php echo $color_dark; ?>; font-size: 14px; text-align: right; font-weight: 600;">#<?php echo esc_html( $order_id ); ?></td>
                                            </tr>
                                            <tr>
                                                <td style="color: #888; font-size: 14px; padding: 5px 0;">Carte cadeau</td>
                                                <td style="color: <?php echo $color_dark; ?>; font-size: 14px; text-align: right; font-weight: 600;"><?php echo esc_html( $sessions_text ); ?></td>
                                            </tr>
                                            <tr>
                                                <td style="color: #888; font-size: 14px; padding: 5px 0;">Montant</td>
                                                <td style="color: <?php echo $color_dark; ?>; font-size: 14px; text-align: right; font-weight: 600;"><?php echo $order->get_formatted_order_total(); ?></td>
                                            </tr>
                                            <?php if ( ! empty( $recipient_email ) ) : ?>
                                            <tr>
                                                <td style="color: #888; font-size: 14px; padding: 5px 0;">Email destinataire</td>
                                                <td style="color: <?php echo $color_dark; ?>; font-size: 14px; text-align: right;"><?php echo esc_html( $recipient_email ); ?></td>
                                            </tr>
                                            <?php endif; ?>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center;">
                                Vous pouvez imprimer cette carte à tout moment en cliquant sur le bouton ci-dessus.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: <?php echo $color_dark; ?>; padding: 30px; text-align: center;">
                            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px;">
                                <strong>Mon Pilates</strong>
                            </p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0 0 5px;">
                                14 boulevard des Dunes, 56260 Larmor-Plage
                            </p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">
                                06 99 18 32 16 • cetteviolettela@hotmail.fr
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Mention légale -->
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                    Cet email a été envoyé suite à votre achat sur monpilates.fr
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        <?php
        return ob_get_clean();
    }

    /**
     * Ajouter les infos carte cadeau aux emails WooCommerce
     */
    public function add_gift_card_info_to_email( $order, $sent_to_admin, $plain_text, $email ) {
        if ( 'yes' !== $order->get_meta( '_mpgc_is_gift_card_order' ) ) {
            return;
        }

        $recipient_name = $order->get_meta( '_mpgc_recipient_name' );
        $recipient_email = $order->get_meta( '_mpgc_recipient_email' );
        $total_sessions = $order->get_meta( '_mpgc_total_sessions' );

        if ( $plain_text ) {
            echo "\n\n=== CARTE CADEAU ===\n";
            echo "Séances : " . $total_sessions . "\n";
            if ( $recipient_name ) {
                echo "Bénéficiaire : " . $recipient_name . "\n";
            }
            echo "Email destinataire : " . $recipient_email . "\n";
        } else {
            ?>
            <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid <?php echo MPGC_COLOR_ROSE; ?>;">
                <h3 style="margin: 0 0 10px; color: <?php echo MPGC_COLOR_DARK; ?>;">🎁 Carte Cadeau</h3>
                <p style="margin: 5px 0;"><strong>Séances :</strong> <?php echo esc_html( $total_sessions ); ?></p>
                <?php if ( $recipient_name ) : ?>
                <p style="margin: 5px 0;"><strong>Bénéficiaire :</strong> <?php echo esc_html( $recipient_name ); ?></p>
                <?php endif; ?>
                <p style="margin: 5px 0;"><strong>Email destinataire :</strong> <?php echo esc_html( $recipient_email ); ?></p>
            </div>
            <?php
        }
    }
}
