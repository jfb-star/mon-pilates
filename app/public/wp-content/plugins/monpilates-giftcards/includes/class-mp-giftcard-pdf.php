<?php
/**
 * Génération des PDF cartes cadeaux
 *
 * Utilise une approche HTML native sans dépendance externe.
 * Le PDF est généré via HTML stylé, sauvegardé comme HTML d'abord,
 * puis converti ou utilisé tel quel pour impression.
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

class MPGC_PDF {

    /**
     * Constructeur
     */
    public function __construct() {
        // Endpoint pour télécharger le PDF
        add_action( 'init', array( $this, 'register_pdf_endpoint' ) );
        add_action( 'template_redirect', array( $this, 'handle_pdf_download' ) );
    }

    /**
     * Enregistrer l'endpoint de téléchargement PDF
     */
    public function register_pdf_endpoint() {
        add_rewrite_rule(
            '^carte-cadeau-pdf/([0-9]+)/([a-zA-Z0-9]+)/?$',
            'index.php?mpgc_pdf_order=$matches[1]&mpgc_pdf_token=$matches[2]',
            'top'
        );

        add_rewrite_tag( '%mpgc_pdf_order%', '([0-9]+)' );
        add_rewrite_tag( '%mpgc_pdf_token%', '([a-zA-Z0-9]+)' );
    }

    /**
     * Gérer le téléchargement du PDF
     */
    public function handle_pdf_download() {
        $order_id = get_query_var( 'mpgc_pdf_order' );
        $token = get_query_var( 'mpgc_pdf_token' );

        if ( ! $order_id || ! $token ) {
            return;
        }

        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            wp_die( 'Commande non trouvée.', 'Erreur', array( 'response' => 404 ) );
        }

        // B3 : Comparaison timing-safe du token (protège contre timing attacks)
        $stored_token = $order->get_meta( '_mpgc_pdf_token' );
        if ( ! $stored_token || ! hash_equals( $stored_token, $token ) ) {
            wp_die( 'Lien invalide ou expiré.', 'Erreur', array( 'response' => 403 ) );
        }

        // Générer et afficher le PDF
        $this->output_pdf( $order );
        exit;
    }

    /**
     * Générer le PDF pour une commande
     */
    public function generate_gift_card_pdf( $order ) {
        if ( ! $order ) {
            return false;
        }

        // Générer un token unique pour le téléchargement
        $token = wp_generate_password( 32, false );
        $order->update_meta_data( '_mpgc_pdf_token', $token );
        $order->save();

        // Chemin du fichier PDF (on stocke d'abord le HTML)
        $filename = 'carte-cadeau-' . $order->get_id() . '-' . $token . '.html';
        $filepath = MPGC_UPLOADS_DIR . $filename;

        // Générer le contenu HTML
        $html_content = $this->generate_html_content( $order );

        // Sauvegarder le fichier HTML
        if ( ! file_exists( MPGC_UPLOADS_DIR ) ) {
            wp_mkdir_p( MPGC_UPLOADS_DIR );

            // Fichiers de protection (anti directory listing)
            $htaccess = MPGC_UPLOADS_DIR . '.htaccess';
            if ( ! file_exists( $htaccess ) ) {
                file_put_contents( $htaccess, "Options -Indexes\nDeny from all\n" );
            }
            $index = MPGC_UPLOADS_DIR . 'index.php';
            if ( ! file_exists( $index ) ) {
                file_put_contents( $index, "<?php\n// Silence is golden." );
            }
        }

        $result = file_put_contents( $filepath, $html_content );

        if ( $result === false ) {
            error_log( 'MPGC: Erreur lors de la création du fichier PDF pour commande #' . $order->get_id() );
            return false;
        }

        // URL de téléchargement sécurisée
        $download_url = home_url( '/carte-cadeau-pdf/' . $order->get_id() . '/' . $token . '/' );
        $order->update_meta_data( '_mpgc_pdf_url', $download_url );
        $order->update_meta_data( '_mpgc_pdf_path', $filepath );
        $order->save();

        return $filepath;
    }

    /**
     * Afficher le PDF (via HTML imprimable)
     */
    public function output_pdf( $order ) {
        // Header pour forcer le mode impression
        header( 'Content-Type: text/html; charset=utf-8' );

        echo $this->generate_html_content( $order, true );
    }

    /**
     * Générer le contenu HTML de la carte cadeau
     */
    private function generate_html_content( $order, $with_print_script = false ) {
        $order_id = $order->get_id();
        $recipient_name = $order->get_meta( '_mpgc_recipient_name' );
        $personal_message = $order->get_meta( '_mpgc_personal_message' );
        $total_sessions = $order->get_meta( '_mpgc_total_sessions' );
        $order_date = $order->get_date_created()->date_i18n( 'j F Y' );
        $buyer_name = $order->get_billing_first_name() . ' ' . $order->get_billing_last_name();

        // Texte du nombre de séances
        if ( $total_sessions == 1 ) {
            $sessions_text = '1 séance de Pilates';
        } else {
            $sessions_text = $total_sessions . ' séances de Pilates';
        }

        // Logo en base64 ou URL
        $logo_url = MPGC_PLUGIN_URL . 'assets/images/logo-monpilates.png';

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
    <title>Carte Cadeau Mon Pilates #<?php echo esc_html( $order_id ); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .gift-card {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }

        /* Header avec vague */
        .gift-card__header {
            background: linear-gradient(135deg, <?php echo $color_ocean; ?> 0%, #5a8a9a 100%);
            padding: 50px 60px 80px;
            position: relative;
        }

        .gift-card__header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 80px;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 C300,100 600,20 900,60 C1050,80 1150,70 1200,60 L1200,120 L0,120 Z' fill='%23ffffff'/%3E%3C/svg%3E") no-repeat center bottom;
            background-size: cover;
        }

        .gift-card__logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .gift-card__logo img {
            height: 80px;
            filter: brightness(0) invert(1);
        }

        .gift-card__logo-text {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
        }

        .gift-card__title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 48px;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            margin-top: 10px;
        }

        /* Contenu principal */
        .gift-card__content {
            padding: 60px;
            text-align: center;
        }

        .gift-card__sessions {
            font-size: 42px;
            font-weight: 700;
            color: <?php echo $color_dark; ?>;
            margin-bottom: 10px;
        }

        .gift-card__sessions-subtitle {
            font-size: 18px;
            color: <?php echo $color_ocean; ?>;
            font-weight: 500;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 50px;
        }

        /* Bénéficiaire */
        .gift-card__recipient {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 20px;
            padding: 40px;
            margin: 30px 0;
        }

        .gift-card__recipient-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: <?php echo $color_ocean; ?>;
            margin-bottom: 10px;
        }

        .gift-card__recipient-name {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 36px;
            font-weight: 500;
            color: <?php echo $color_dark; ?>;
        }

        /* Message personnel */
        .gift-card__message {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 22px;
            font-style: italic;
            color: #555;
            line-height: 1.6;
            margin: 40px 20px;
            padding: 30px;
            border-left: 4px solid <?php echo $color_rose; ?>;
            background: #fdf7f9;
            text-align: left;
        }

        .gift-card__message::before {
            content: '"';
            font-size: 60px;
            color: <?php echo $color_rose; ?>;
            opacity: 0.3;
            line-height: 0;
            vertical-align: top;
        }

        /* Infos */
        .gift-card__info {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }

        .gift-card__info-item {
            display: inline-block;
            margin: 0 30px;
            text-align: center;
        }

        .gift-card__info-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            margin-bottom: 5px;
        }

        .gift-card__info-value {
            font-size: 16px;
            font-weight: 600;
            color: <?php echo $color_dark; ?>;
        }

        /* Footer */
        .gift-card__footer {
            background: <?php echo $color_dark; ?>;
            padding: 40px 60px;
            text-align: center;
            margin-top: auto;
        }

        .gift-card__footer-text {
            font-size: 14px;
            color: rgba(255,255,255,0.9);
            line-height: 1.8;
        }

        .gift-card__footer-highlight {
            color: <?php echo $color_ocean; ?>;
            font-weight: 600;
        }

        .gift-card__contact {
            margin-top: 20px;
            font-size: 13px;
            color: rgba(255,255,255,0.7);
        }

        /* Instructions impression */
        .print-instructions {
            text-align: center;
            padding: 20px;
            background: #fff3cd;
            color: #856404;
            font-size: 14px;
        }

        .print-instructions a {
            color: <?php echo $color_rose; ?>;
            font-weight: 600;
            text-decoration: none;
        }

        .btn-print {
            display: inline-block;
            background: <?php echo $color_rose; ?>;
            color: #fff;
            padding: 12px 30px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            margin: 10px;
            cursor: pointer;
            border: none;
            font-size: 16px;
        }

        .btn-print:hover {
            background: #b82a6a;
        }

        @media print {
            body {
                background: #fff;
                padding: 0;
            }

            .gift-card {
                box-shadow: none;
                width: 100%;
                min-height: auto;
            }

            .print-instructions,
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <?php if ( $with_print_script ) : ?>
    <div class="print-instructions no-print">
        <p><strong>🎁 Votre carte cadeau est prête !</strong></p>
        <p>Cliquez sur le bouton ci-dessous pour l'imprimer ou la sauvegarder en PDF.</p>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
    </div>
    <?php endif; ?>

    <div class="gift-card">
        <div class="gift-card__header">
            <div class="gift-card__logo">
                <div class="gift-card__logo-text">MON PILATES</div>
            </div>
            <h1 class="gift-card__title">Carte Cadeau</h1>
        </div>

        <div class="gift-card__content">
            <div class="gift-card__sessions"><?php echo esc_html( $sessions_text ); ?></div>
            <div class="gift-card__sessions-subtitle">Face à la mer • Larmor-Plage</div>

            <?php if ( ! empty( $recipient_name ) ) : ?>
            <div class="gift-card__recipient">
                <div class="gift-card__recipient-label">Offert à</div>
                <div class="gift-card__recipient-name"><?php echo esc_html( $recipient_name ); ?></div>
            </div>
            <?php endif; ?>

            <?php if ( ! empty( $personal_message ) ) : ?>
            <div class="gift-card__message">
                <?php echo esc_html( $personal_message ); ?>
            </div>
            <?php endif; ?>

            <div class="gift-card__info">
                <div class="gift-card__info-item">
                    <div class="gift-card__info-label">Date d'achat</div>
                    <div class="gift-card__info-value"><?php echo esc_html( $order_date ); ?></div>
                </div>
                <div class="gift-card__info-item">
                    <div class="gift-card__info-label">N° de commande</div>
                    <div class="gift-card__info-value">#<?php echo esc_html( $order_id ); ?></div>
                </div>
                <div class="gift-card__info-item">
                    <div class="gift-card__info-label">Offert par</div>
                    <div class="gift-card__info-value"><?php echo esc_html( $buyer_name ); ?></div>
                </div>
            </div>
        </div>

        <div class="gift-card__footer">
            <p class="gift-card__footer-text">
                Cette carte cadeau sera <span class="gift-card__footer-highlight">activée lors de la première réservation</span> du bénéficiaire.<br>
                Présentez cette carte lors de votre venue au studio ou mentionnez le numéro de commande lors de votre réservation.
            </p>
            <p class="gift-card__contact">
                Mon Pilates • 14 boulevard des Dunes, 56260 Larmor-Plage<br>
                06 99 18 32 16 • cetteviolettela@hotmail.fr
            </p>
        </div>
    </div>

    <?php if ( $with_print_script ) : ?>
    <script>
        // Auto-print si demandé via URL
        if (window.location.search.includes('print=1')) {
            window.onload = function() {
                window.print();
            };
        }
    </script>
    <?php endif; ?>
</body>
</html>
        <?php
        return ob_get_clean();
    }

    /**
     * Obtenir l'URL de téléchargement du PDF
     */
    public function get_pdf_download_url( $order ) {
        $token = $order->get_meta( '_mpgc_pdf_token' );

        if ( ! $token ) {
            return false;
        }

        return home_url( '/carte-cadeau-pdf/' . $order->get_id() . '/' . $token . '/' );
    }

    /**
     * Régénérer le PDF pour une commande
     */
    public function regenerate_pdf( $order_id ) {
        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            return false;
        }

        return $this->generate_gift_card_pdf( $order );
    }
}
