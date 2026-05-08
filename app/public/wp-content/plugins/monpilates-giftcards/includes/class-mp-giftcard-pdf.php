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

        // Logo et palette brand
        $logo_url = MPGC_PLUGIN_URL . 'assets/images/logo-monpilates.png';
        $color_ocean = MPGC_COLOR_OCEAN;
        $color_rose = MPGC_COLOR_ROSE;

        ob_start();
        ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte Cadeau Mon Pilates #<?php echo esc_html( $order_id ); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page { size: A4; margin: 0; }

        :root {
            --c-teal: <?php echo $color_ocean; ?>;
            --c-teal-deep: #5a8a9a;
            --c-rose: <?php echo $color_rose; ?>;
            --c-ink: #2d3e4e;
            --c-ink-soft: #6b7c8a;
            --c-line: #e8eef0;
            --c-paper: #fefdfb;
            --c-cream: #f8f4ec;
        }

        html, body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--c-cream);
            color: var(--c-ink);
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 16px;
        }

        .gift-card {
            width: 210mm;
            max-width: 100%;
            height: 297mm;
            max-height: 297mm;
            background: var(--c-paper);
            box-shadow: 0 30px 80px rgba(45, 62, 78, 0.12);
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            page-break-inside: avoid;
        }

        /* Bordure décorative subtile en haut */
        .gift-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--c-teal) 0%, var(--c-rose) 100%);
        }

        /* HEADER : logo + eyebrow */
        .gc-header {
            padding: 36px 56px 24px;
            text-align: center;
        }

        .gc-logo { display: inline-block; margin-bottom: 18px; }
        .gc-logo img { height: 80px; width: auto; display: block; }

        .gc-eyebrow {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: var(--c-teal);
            margin-bottom: 12px;
            position: relative;
            display: inline-block;
            padding: 0 36px;
        }

        .gc-eyebrow::before,
        .gc-eyebrow::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 24px;
            height: 1px;
            background: var(--c-teal);
            opacity: 0.5;
        }
        .gc-eyebrow::before { left: 0; }
        .gc-eyebrow::after { right: 0; }

        .gc-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 52px;
            font-weight: 500;
            line-height: 1.05;
            color: var(--c-ink);
            margin-bottom: 8px;
        }

        .gc-subtitle {
            font-size: 13px;
            color: var(--c-ink-soft);
            font-style: italic;
        }

        /* VALEUR : nombre de séances */
        .gc-value {
            text-align: center;
            padding: 16px 56px 28px;
        }

        .gc-value-amount {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 84px;
            font-weight: 500;
            line-height: 1;
            color: var(--c-rose);
            margin-bottom: 4px;
        }

        .gc-value-unit {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--c-ink-soft);
        }

        /* DESTINATAIRE */
        .gc-recipient {
            margin: 0 56px 22px;
            padding: 22px 28px;
            background: linear-gradient(135deg, rgba(127, 168, 182, 0.06) 0%, rgba(207, 49, 124, 0.04) 100%);
            border-radius: 12px;
            text-align: center;
        }

        .gc-recipient-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: var(--c-teal);
            font-weight: 600;
            margin-bottom: 6px;
        }

        .gc-recipient-name {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 32px;
            font-weight: 500;
            color: var(--c-ink);
            line-height: 1.1;
        }

        /* MESSAGE PERSONNEL */
        .gc-message {
            margin: 0 56px 24px;
            padding: 18px 26px 18px 36px;
            background: var(--c-cream);
            border-left: 3px solid var(--c-rose);
            border-radius: 0 10px 10px 0;
            position: relative;
        }

        .gc-message-content {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 17px;
            font-style: italic;
            color: var(--c-ink);
            line-height: 1.55;
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        .gc-message::before {
            content: '"';
            position: absolute;
            top: 0;
            left: 14px;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 44px;
            color: var(--c-rose);
            opacity: 0.25;
            line-height: 1.1;
        }

        /* INFOS PRATIQUES */
        .gc-info {
            margin: 0 56px;
            padding: 18px 0;
            border-top: 1px solid var(--c-line);
            display: flex;
            justify-content: space-around;
            gap: 16px;
        }

        .gc-info-item { text-align: center; flex: 1; }

        .gc-info-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--c-ink-soft);
            font-weight: 500;
            margin-bottom: 4px;
            opacity: 0.8;
        }

        .gc-info-value {
            font-size: 13px;
            font-weight: 600;
            color: var(--c-ink);
        }

        /* FOOTER */
        .gc-footer {
            margin-top: auto;
            padding: 22px 56px 26px;
            background: var(--c-cream);
            border-top: 1px solid var(--c-line);
            text-align: center;
        }

        .gc-footer-note {
            font-size: 11px;
            line-height: 1.6;
            color: var(--c-ink-soft);
            max-width: 460px;
            margin: 0 auto 10px;
        }

        .gc-footer-note strong {
            color: var(--c-teal);
            font-weight: 600;
        }

        .gc-footer-divider {
            width: 24px;
            height: 1px;
            background: var(--c-rose);
            margin: 8px auto;
            opacity: 0.5;
        }

        .gc-footer-contact {
            font-size: 10px;
            color: var(--c-ink-soft);
            line-height: 1.6;
            font-style: italic;
        }

        .gc-footer-contact a {
            color: inherit;
            text-decoration: none;
        }

        /* Barre d'impression (visible uniquement à l'écran)
           position: fixed pour la sortir du flex flow de body */
        .print-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            text-align: center;
            padding: 12px 16px;
            background: var(--c-ink);
            color: white;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .print-bar p { margin: 0 0 8px; opacity: 0.9; }

        /* Espace pour ne pas que la print-bar masque le haut de la carte */
        body.has-print-bar { padding-top: 80px; }

        .btn-print {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--c-rose);
            color: #fff;
            padding: 10px 22px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-size: 13px;
            font-family: inherit;
            transition: background 0.2s ease;
        }

        .btn-print:hover { background: #b82a6a; }

        /* MOBILE — la carte se redimensionne, design reste lisible */
        @media (max-width: 768px) {
            body { padding: 8px; }
            .gift-card {
                width: 100%;
                height: auto;
                min-height: 0;
                max-height: none;
            }
            .gc-header { padding: 28px 24px 18px; }
            .gc-logo img { height: 64px; }
            .gc-title { font-size: 38px; }
            .gc-value { padding: 12px 24px 22px; }
            .gc-value-amount { font-size: 64px; }
            .gc-recipient {
                margin: 0 24px 18px;
                padding: 18px 20px;
            }
            .gc-recipient-name { font-size: 26px; }
            .gc-message {
                margin: 0 24px 20px;
                padding: 14px 18px 14px 28px;
            }
            .gc-message-content { font-size: 15px; }
            .gc-info {
                margin: 0 24px;
                flex-direction: column;
                gap: 14px;
                padding: 18px 0;
            }
            .gc-footer { padding: 20px 24px 24px; }
            .print-bar { padding: 10px 12px; font-size: 12px; }
            .btn-print { padding: 9px 18px; font-size: 12px; }
        }

        /* PRINT — strict 1 page A4 */
        @media print {
            html, body { background: #fff; padding: 0; margin: 0; }
            body { display: block; min-height: 0; }
            .gift-card {
                box-shadow: none;
                width: 210mm;
                height: 297mm;
                max-height: 297mm;
                page-break-after: avoid;
                page-break-inside: avoid;
            }
            .print-bar, .no-print { display: none !important; }
        }
    </style>
</head>
<body class="<?php echo $with_print_script ? 'has-print-bar' : ''; ?>">
    <?php if ( $with_print_script ) : ?>
    <div class="print-bar no-print">
        <p>Votre carte cadeau est prête. Cliquez pour l'imprimer ou la sauvegarder en PDF.</p>
        <button class="btn-print" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimer / Sauvegarder en PDF
        </button>
    </div>
    <?php endif; ?>

    <div class="gift-card">
        <header class="gc-header">
            <div class="gc-logo">
                <img src="<?php echo esc_url( $logo_url ); ?>" alt="Mon Pilates">
            </div>
            <p class="gc-eyebrow">Carte Cadeau</p>
            <h1 class="gc-title">Une parenthèse Pilates</h1>
            <p class="gc-subtitle">Face à la mer · Larmor-Plage</p>
        </header>

        <section class="gc-value">
            <div class="gc-value-amount"><?php echo (int) $total_sessions; ?></div>
            <div class="gc-value-unit"><?php echo $total_sessions > 1 ? 'séances de Pilates' : 'séance de Pilates'; ?></div>
        </section>

        <?php if ( ! empty( $recipient_name ) ) : ?>
        <div class="gc-recipient">
            <div class="gc-recipient-label">Offert à</div>
            <div class="gc-recipient-name"><?php echo esc_html( $recipient_name ); ?></div>
        </div>
        <?php endif; ?>

        <?php if ( ! empty( $personal_message ) ) : ?>
        <div class="gc-message">
            <div class="gc-message-content"><?php echo nl2br( esc_html( $personal_message ) ); ?></div>
        </div>
        <?php endif; ?>

        <div class="gc-info">
            <div class="gc-info-item">
                <div class="gc-info-label">Date d'achat</div>
                <div class="gc-info-value"><?php echo esc_html( $order_date ); ?></div>
            </div>
            <div class="gc-info-item">
                <div class="gc-info-label">Référence</div>
                <div class="gc-info-value">#<?php echo esc_html( $order_id ); ?></div>
            </div>
            <div class="gc-info-item">
                <div class="gc-info-label">Offert par</div>
                <div class="gc-info-value"><?php echo esc_html( $buyer_name ); ?></div>
            </div>
        </div>

        <footer class="gc-footer">
            <p class="gc-footer-note">
                Cette carte sera <strong>activée à la première séance</strong>.<br>
                Présentez-la à votre arrivée au studio, ou mentionnez la référence lors de votre réservation.
            </p>
            <div class="gc-footer-divider"></div>
            <p class="gc-footer-contact">
                Mon Pilates · Villa les Mouettes · 14 Boulevard des Dunes · 56260 Larmor-Plage<br>
                06 99 18 32 16 · <a href="mailto:contact@mon-pilates.bzh">contact@mon-pilates.bzh</a>
            </p>
        </footer>
    </div>

    <?php if ( $with_print_script ) : ?>
    <script>
        if (window.location.search.includes('print=1')) {
            window.onload = function() { window.print(); };
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
