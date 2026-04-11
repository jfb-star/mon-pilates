<?php
/**
 * Gestion du renvoi d'email carte cadeau (front-end)
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

class MPGC_Resend {

    /**
     * Transient prefix pour rate limiting
     */
    const RATE_LIMIT_PREFIX = 'mpgc_resend_';

    /**
     * Nombre max de tentatives
     */
    const MAX_ATTEMPTS = 3;

    /**
     * Durée du rate limit (10 minutes)
     */
    const RATE_LIMIT_DURATION = 600;

    /**
     * Constructeur
     */
    public function __construct() {
        // Actions AJAX
        add_action( 'wp_ajax_mpgc_resend_card', array( $this, 'handle_resend_request' ) );
        add_action( 'wp_ajax_nopriv_mpgc_resend_card', array( $this, 'handle_resend_request' ) );
    }

    /**
     * Gérer la demande de renvoi
     */
    public function handle_resend_request() {
        // Vérifier le nonce
        if ( ! check_ajax_referer( 'mpgc_nonce', 'nonce', false ) ) {
            wp_send_json_error( array(
                'message' => 'Session expirée. Veuillez rafraîchir la page.',
            ) );
        }

        // R3 : Honeypot anti-spam — si rempli, c'est un bot
        if ( ! empty( $_POST['mpgc_website'] ) ) {
            wp_send_json_success( array(
                'message' => 'Si une carte cadeau est associée à cet email, vous recevrez un nouvel email dans quelques minutes.',
            ) );
        }

        // Obtenir l'IP
        $ip = $this->get_client_ip();

        // Vérifier le rate limit
        if ( $this->is_rate_limited( $ip ) ) {
            wp_send_json_error( array(
                'message' => 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
            ) );
        }

        // Obtenir l'email
        $email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';

        if ( empty( $email ) || ! is_email( $email ) ) {
            $this->increment_attempts( $ip );
            wp_send_json_error( array(
                'message' => 'Veuillez entrer une adresse email valide.',
            ) );
        }

        // Rechercher la commande
        $order = $this->find_gift_card_order( $email );

        // IMPORTANT: Toujours afficher le même message pour des raisons de sécurité
        $success_message = 'Si une carte cadeau est associée à cet email, vous recevrez un nouvel email dans quelques minutes.';

        if ( ! $order ) {
            // Incrémenter les tentatives même si non trouvé
            $this->increment_attempts( $ip );

            // Message neutre (ne pas révéler si l'email existe ou non)
            wp_send_json_success( array(
                'message' => $success_message,
            ) );
        }

        // Renvoyer l'email
        $sent = MPGC()->emails->resend_gift_card_email( $order->get_id() );

        // Incrémenter les tentatives
        $this->increment_attempts( $ip );

        // Toujours renvoyer un message de succès (sécurité)
        wp_send_json_success( array(
            'message' => $success_message,
        ) );
    }

    /**
     * Trouver une commande carte cadeau par email
     *
     * R8 : Utilise l'API WooCommerce (compatible HPOS) au lieu de requêtes SQL brutes.
     *
     * Recherche dans:
     * 1. Email de facturation (payeur)
     * 2. Email du destinataire (recipient)
     */
    private function find_gift_card_order( $email ) {
        // Recherche par email de facturation (payeur)
        $orders_billing = wc_get_orders( array(
            'billing_email' => $email,
            'meta_key'      => '_mpgc_is_gift_card_order',
            'meta_value'    => 'yes',
            'status'        => array( 'completed', 'processing' ),
            'limit'         => 1,
            'orderby'       => 'date',
            'order'         => 'DESC',
        ) );

        // Recherche par email destinataire
        $orders_recipient = wc_get_orders( array(
            'meta_query' => array(
                'relation' => 'AND',
                array(
                    'key'   => '_mpgc_recipient_email',
                    'value' => $email,
                ),
                array(
                    'key'   => '_mpgc_is_gift_card_order',
                    'value' => 'yes',
                ),
            ),
            'status'  => array( 'completed', 'processing' ),
            'limit'   => 1,
            'orderby' => 'date',
            'order'   => 'DESC',
        ) );

        // Fusionner et prendre le plus récent
        $all_orders = array_merge( $orders_billing, $orders_recipient );

        if ( empty( $all_orders ) ) {
            return false;
        }

        // Trier par ID décroissant et retourner le plus récent
        usort( $all_orders, function( $a, $b ) {
            return $b->get_id() - $a->get_id();
        } );

        return $all_orders[0];
    }

    /**
     * Obtenir l'IP du client
     */
    private function get_client_ip() {
        $ip = '';

        if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
            $ip = sanitize_text_field( $_SERVER['HTTP_CLIENT_IP'] );
        } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
            $ip = sanitize_text_field( $_SERVER['HTTP_X_FORWARDED_FOR'] );
        } elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
            $ip = sanitize_text_field( $_SERVER['REMOTE_ADDR'] );
        }

        // Prendre uniquement la première IP si plusieurs
        if ( strpos( $ip, ',' ) !== false ) {
            $ip = trim( explode( ',', $ip )[0] );
        }

        return $ip;
    }

    /**
     * Vérifier si l'IP est rate limited
     */
    private function is_rate_limited( $ip ) {
        $attempts = get_transient( self::RATE_LIMIT_PREFIX . md5( $ip ) );

        return $attempts && $attempts >= self::MAX_ATTEMPTS;
    }

    /**
     * Incrémenter le compteur de tentatives
     */
    private function increment_attempts( $ip ) {
        $key = self::RATE_LIMIT_PREFIX . md5( $ip );
        $attempts = get_transient( $key );

        if ( false === $attempts ) {
            $attempts = 0;
        }

        $attempts++;

        set_transient( $key, $attempts, self::RATE_LIMIT_DURATION );
    }
}
