<?php
/**
 * Gestion du back-office WooCommerce pour les cartes cadeaux
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

class MPGC_Admin {

    /**
     * Constructeur
     */
    public function __construct() {
        // Colonnes liste commandes
        add_filter( 'manage_edit-shop_order_columns', array( $this, 'add_order_columns' ), 20 );
        add_filter( 'manage_woocommerce_page_wc-orders_columns', array( $this, 'add_order_columns' ), 20 );
        add_action( 'manage_shop_order_posts_custom_column', array( $this, 'render_order_columns' ), 10, 2 );
        add_action( 'manage_woocommerce_page_wc-orders_custom_column', array( $this, 'render_order_columns_hpos' ), 10, 2 );

        // Filtres liste commandes
        add_action( 'restrict_manage_posts', array( $this, 'add_order_filters' ) );
        add_filter( 'request', array( $this, 'filter_orders_by_gift_card' ) );

        // Meta box détail commande
        add_action( 'add_meta_boxes', array( $this, 'add_gift_card_meta_box' ) );

        // Actions AJAX admin
        add_action( 'wp_ajax_mpgc_toggle_activation', array( $this, 'ajax_toggle_activation' ) );
        add_action( 'wp_ajax_mpgc_resend_email', array( $this, 'ajax_resend_email' ) );
        add_action( 'wp_ajax_mpgc_save_note', array( $this, 'ajax_save_note' ) );

        // Colonnes produits
        add_filter( 'manage_edit-product_columns', array( $this, 'add_product_columns' ), 20 );
        add_action( 'manage_product_posts_custom_column', array( $this, 'render_product_columns' ), 10, 2 );

        // Meta box produits
        add_action( 'woocommerce_product_options_general_product_data', array( $this, 'add_product_gift_card_options' ) );
        add_action( 'woocommerce_process_product_meta', array( $this, 'save_product_gift_card_options' ) );

        // Dashboard widget
        add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );

        // Menu admin
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
    }

    /**
     * Ajouter les colonnes à la liste des commandes
     */
    public function add_order_columns( $columns ) {
        $new_columns = array();

        foreach ( $columns as $key => $value ) {
            $new_columns[ $key ] = $value;

            // Ajouter après la colonne "order_status"
            if ( 'order_status' === $key ) {
                $new_columns['mpgc_gift_card'] = '🎁 Carte';
                $new_columns['mpgc_recipient'] = 'Destinataire';
                $new_columns['mpgc_activation'] = 'Activation';
            }
        }

        return $new_columns;
    }

    /**
     * Rendre le contenu des colonnes (classique)
     */
    public function render_order_columns( $column, $post_id ) {
        $order = wc_get_order( $post_id );
        $this->render_column_content( $column, $order );
    }

    /**
     * Rendre le contenu des colonnes (HPOS)
     */
    public function render_order_columns_hpos( $column, $order ) {
        $this->render_column_content( $column, $order );
    }

    /**
     * Contenu des colonnes
     */
    private function render_column_content( $column, $order ) {
        if ( ! $order ) {
            return;
        }

        $is_gift_card = 'yes' === $order->get_meta( '_mpgc_is_gift_card_order' );

        switch ( $column ) {
            case 'mpgc_gift_card':
                if ( $is_gift_card ) {
                    $sessions = $order->get_meta( '_mpgc_total_sessions' );
                    echo '<span class="mpgc-badge mpgc-badge--gift">🎁 ' . esc_html( $sessions ) . ' séance' . ( $sessions > 1 ? 's' : '' ) . '</span>';
                } else {
                    echo '<span class="mpgc-badge mpgc-badge--none">—</span>';
                }
                break;

            case 'mpgc_recipient':
                if ( $is_gift_card ) {
                    $email = $order->get_meta( '_mpgc_recipient_email' );
                    $name = $order->get_meta( '_mpgc_recipient_name' );

                    if ( $name ) {
                        echo '<strong>' . esc_html( $name ) . '</strong><br>';
                    }
                    echo '<small>' . esc_html( $email ) . '</small>';
                } else {
                    echo '—';
                }
                break;

            case 'mpgc_activation':
                if ( $is_gift_card ) {
                    $status = $order->get_meta( '_mpgc_activation_status' );
                    if ( 'activated' === $status ) {
                        echo '<span class="mpgc-status mpgc-status--activated">✅ Activée</span>';
                    } else {
                        echo '<span class="mpgc-status mpgc-status--pending">⏳ En attente</span>';
                    }
                } else {
                    echo '—';
                }
                break;
        }
    }

    /**
     * Ajouter les filtres de commandes
     */
    public function add_order_filters() {
        global $typenow;

        if ( 'shop_order' !== $typenow ) {
            return;
        }

        $selected = isset( $_GET['mpgc_filter'] ) ? sanitize_text_field( $_GET['mpgc_filter'] ) : '';

        ?>
        <select name="mpgc_filter">
            <option value="">Toutes les commandes</option>
            <option value="gift_cards" <?php selected( $selected, 'gift_cards' ); ?>>🎁 Cartes cadeaux uniquement</option>
            <option value="pending" <?php selected( $selected, 'pending' ); ?>>⏳ Cartes non activées</option>
            <option value="activated" <?php selected( $selected, 'activated' ); ?>>✅ Cartes activées</option>
        </select>
        <?php
    }

    /**
     * Filtrer les commandes
     */
    public function filter_orders_by_gift_card( $vars ) {
        global $typenow;

        if ( 'shop_order' !== $typenow || ! isset( $_GET['mpgc_filter'] ) ) {
            return $vars;
        }

        $filter = sanitize_text_field( $_GET['mpgc_filter'] );

        if ( empty( $filter ) ) {
            return $vars;
        }

        if ( ! isset( $vars['meta_query'] ) ) {
            $vars['meta_query'] = array();
        }

        switch ( $filter ) {
            case 'gift_cards':
                $vars['meta_query'][] = array(
                    'key'   => '_mpgc_is_gift_card_order',
                    'value' => 'yes',
                );
                break;

            case 'pending':
                $vars['meta_query'][] = array(
                    'key'   => '_mpgc_is_gift_card_order',
                    'value' => 'yes',
                );
                $vars['meta_query'][] = array(
                    'key'   => '_mpgc_activation_status',
                    'value' => 'pending',
                );
                break;

            case 'activated':
                $vars['meta_query'][] = array(
                    'key'   => '_mpgc_is_gift_card_order',
                    'value' => 'yes',
                );
                $vars['meta_query'][] = array(
                    'key'   => '_mpgc_activation_status',
                    'value' => 'activated',
                );
                break;
        }

        return $vars;
    }

    /**
     * Ajouter la meta box carte cadeau
     */
    public function add_gift_card_meta_box() {
        $screen = class_exists( '\Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController' )
            && wc_get_container()->get( \Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController::class )->custom_orders_table_usage_is_enabled()
            ? wc_get_page_screen_id( 'shop-order' )
            : 'shop_order';

        add_meta_box(
            'mpgc_gift_card_details',
            '🎁 Carte Cadeau Mon Pilates',
            array( $this, 'render_gift_card_meta_box' ),
            $screen,
            'side',
            'high'
        );
    }

    /**
     * Rendre la meta box carte cadeau
     */
    public function render_gift_card_meta_box( $post_or_order ) {
        $order = $post_or_order instanceof WP_Post
            ? wc_get_order( $post_or_order->ID )
            : $post_or_order;

        if ( ! $order ) {
            echo '<p>Commande non trouvée.</p>';
            return;
        }

        $is_gift_card = 'yes' === $order->get_meta( '_mpgc_is_gift_card_order' );

        if ( ! $is_gift_card ) {
            echo '<p style="color: #888;">Cette commande ne contient pas de carte cadeau.</p>';
            return;
        }

        $order_id = $order->get_id();
        $sessions = $order->get_meta( '_mpgc_total_sessions' );
        $recipient_email = $order->get_meta( '_mpgc_recipient_email' );
        $recipient_name = $order->get_meta( '_mpgc_recipient_name' );
        $personal_message = $order->get_meta( '_mpgc_personal_message' );
        $activation_status = $order->get_meta( '_mpgc_activation_status' );
        $internal_note = $order->get_meta( '_mpgc_internal_note' );
        $pdf_url = MPGC()->pdf->get_pdf_download_url( $order );

        wp_nonce_field( 'mpgc_admin_actions', 'mpgc_admin_nonce' );

        ?>
        <div class="mpgc-admin-box">
            <!-- Infos carte -->
            <div class="mpgc-admin-section">
                <div class="mpgc-admin-row">
                    <span class="mpgc-admin-label">Type :</span>
                    <span class="mpgc-admin-value"><strong><?php echo esc_html( $sessions ); ?> séance<?php echo $sessions > 1 ? 's' : ''; ?></strong></span>
                </div>

                <div class="mpgc-admin-row">
                    <span class="mpgc-admin-label">Destinataire :</span>
                    <span class="mpgc-admin-value"><?php echo esc_html( $recipient_email ); ?></span>
                </div>

                <?php if ( $recipient_name ) : ?>
                <div class="mpgc-admin-row">
                    <span class="mpgc-admin-label">Nom :</span>
                    <span class="mpgc-admin-value"><?php echo esc_html( $recipient_name ); ?></span>
                </div>
                <?php endif; ?>

                <?php if ( $personal_message ) : ?>
                <div class="mpgc-admin-row">
                    <span class="mpgc-admin-label">Message :</span>
                    <span class="mpgc-admin-value mpgc-admin-message"><?php echo esc_html( $personal_message ); ?></span>
                </div>
                <?php endif; ?>
            </div>

            <!-- Statut activation -->
            <div class="mpgc-admin-section">
                <div class="mpgc-admin-row">
                    <span class="mpgc-admin-label">Statut :</span>
                    <span id="mpgc-activation-status" class="mpgc-status mpgc-status--<?php echo esc_attr( $activation_status ); ?>">
                        <?php echo 'activated' === $activation_status ? '✅ Activée' : '⏳ En attente'; ?>
                    </span>
                </div>
            </div>

            <!-- Actions -->
            <div class="mpgc-admin-actions">
                <?php if ( $pdf_url ) : ?>
                <a href="<?php echo esc_url( $pdf_url ); ?>" target="_blank" class="button">
                    📄 Voir le PDF
                </a>
                <?php endif; ?>

                <button type="button" class="button" id="mpgc-resend-email" data-order-id="<?php echo esc_attr( $order_id ); ?>">
                    📧 Renvoyer email
                </button>

                <button type="button" class="button button-primary" id="mpgc-toggle-activation" data-order-id="<?php echo esc_attr( $order_id ); ?>" data-current="<?php echo esc_attr( $activation_status ); ?>">
                    <?php echo 'activated' === $activation_status ? '↩️ Désactiver' : '✅ Marquer activée'; ?>
                </button>
            </div>

            <!-- Note interne -->
            <div class="mpgc-admin-section">
                <label for="mpgc-internal-note" class="mpgc-admin-label">Note interne :</label>
                <textarea id="mpgc-internal-note" class="widefat" rows="2" placeholder="Note visible uniquement en admin..."><?php echo esc_textarea( $internal_note ); ?></textarea>
                <button type="button" class="button button-small" id="mpgc-save-note" data-order-id="<?php echo esc_attr( $order_id ); ?>" style="margin-top: 5px;">
                    💾 Sauvegarder note
                </button>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            // Toggle activation
            $('#mpgc-toggle-activation').on('click', function() {
                var btn = $(this);
                var orderId = btn.data('order-id');
                var current = btn.data('current');
                var newStatus = current === 'activated' ? 'pending' : 'activated';

                btn.prop('disabled', true).text('...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'mpgc_toggle_activation',
                        order_id: orderId,
                        status: newStatus,
                        nonce: $('#mpgc_admin_nonce').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            btn.data('current', newStatus);
                            if (newStatus === 'activated') {
                                btn.text('↩️ Désactiver');
                                $('#mpgc-activation-status').removeClass('mpgc-status--pending').addClass('mpgc-status--activated').text('✅ Activée');
                            } else {
                                btn.text('✅ Marquer activée');
                                $('#mpgc-activation-status').removeClass('mpgc-status--activated').addClass('mpgc-status--pending').text('⏳ En attente');
                            }
                        } else {
                            alert('Erreur: ' + response.data);
                        }
                    },
                    error: function() {
                        alert('Erreur de connexion');
                    },
                    complete: function() {
                        btn.prop('disabled', false);
                    }
                });
            });

            // Resend email
            $('#mpgc-resend-email').on('click', function() {
                var btn = $(this);
                var orderId = btn.data('order-id');

                if (!confirm('Renvoyer l\'email de la carte cadeau ?')) {
                    return;
                }

                btn.prop('disabled', true).text('Envoi...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'mpgc_resend_email',
                        order_id: orderId,
                        nonce: $('#mpgc_admin_nonce').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            alert('Email envoyé avec succès !');
                        } else {
                            alert('Erreur: ' + response.data);
                        }
                    },
                    error: function() {
                        alert('Erreur de connexion');
                    },
                    complete: function() {
                        btn.prop('disabled', false).text('📧 Renvoyer email');
                    }
                });
            });

            // Save note
            $('#mpgc-save-note').on('click', function() {
                var btn = $(this);
                var orderId = btn.data('order-id');
                var note = $('#mpgc-internal-note').val();

                btn.prop('disabled', true).text('...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'mpgc_save_note',
                        order_id: orderId,
                        note: note,
                        nonce: $('#mpgc_admin_nonce').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            btn.text('✓ Sauvegardé');
                            setTimeout(function() {
                                btn.text('💾 Sauvegarder note');
                            }, 2000);
                        } else {
                            alert('Erreur: ' + response.data);
                        }
                    },
                    error: function() {
                        alert('Erreur de connexion');
                    },
                    complete: function() {
                        btn.prop('disabled', false);
                    }
                });
            });
        });
        </script>

        <style>
        .mpgc-admin-box { }
        .mpgc-admin-section { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .mpgc-admin-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .mpgc-admin-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .mpgc-admin-label { color: #666; }
        .mpgc-admin-value { text-align: right; max-width: 60%; }
        .mpgc-admin-message { font-style: italic; font-size: 12px; }
        .mpgc-admin-actions { display: flex; flex-wrap: wrap; gap: 5px; margin: 15px 0; }
        .mpgc-admin-actions .button { flex: 1; text-align: center; }
        .mpgc-status { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
        .mpgc-status--pending { background: #fff3cd; color: #856404; }
        .mpgc-status--activated { background: #d4edda; color: #155724; }
        </style>
        <?php
    }

    /**
     * AJAX: Toggle activation
     */
    public function ajax_toggle_activation() {
        check_ajax_referer( 'mpgc_admin_actions', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( 'Permissions insuffisantes' );
        }

        $order_id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;
        $status = isset( $_POST['status'] ) ? sanitize_text_field( $_POST['status'] ) : '';

        if ( ! $order_id || ! in_array( $status, array( 'pending', 'activated' ), true ) ) {
            wp_send_json_error( 'Paramètres invalides' );
        }

        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            wp_send_json_error( 'Commande non trouvée' );
        }

        $order->update_meta_data( '_mpgc_activation_status', $status );

        if ( 'activated' === $status ) {
            $order->update_meta_data( '_mpgc_activation_date', current_time( 'mysql' ) );
            $order->add_order_note( '✅ Carte cadeau marquée comme activée.' );
        } else {
            $order->add_order_note( '↩️ Carte cadeau marquée comme non activée.' );
        }

        $order->save();

        wp_send_json_success();
    }

    /**
     * AJAX: Resend email
     */
    public function ajax_resend_email() {
        check_ajax_referer( 'mpgc_admin_actions', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( 'Permissions insuffisantes' );
        }

        $order_id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;

        if ( ! $order_id ) {
            wp_send_json_error( 'ID commande manquant' );
        }

        $result = MPGC()->emails->resend_gift_card_email( $order_id );

        if ( $result ) {
            wp_send_json_success();
        } else {
            wp_send_json_error( 'Échec de l\'envoi' );
        }
    }

    /**
     * AJAX: Save note
     */
    public function ajax_save_note() {
        check_ajax_referer( 'mpgc_admin_actions', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( 'Permissions insuffisantes' );
        }

        $order_id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;
        $note = isset( $_POST['note'] ) ? sanitize_textarea_field( $_POST['note'] ) : '';

        if ( ! $order_id ) {
            wp_send_json_error( 'ID commande manquant' );
        }

        $order = wc_get_order( $order_id );

        if ( ! $order ) {
            wp_send_json_error( 'Commande non trouvée' );
        }

        $order->update_meta_data( '_mpgc_internal_note', $note );
        $order->save();

        wp_send_json_success();
    }

    /**
     * Colonnes produits
     */
    public function add_product_columns( $columns ) {
        $columns['mpgc_gift_card'] = '🎁';
        return $columns;
    }

    /**
     * Contenu colonnes produits
     */
    public function render_product_columns( $column, $post_id ) {
        if ( 'mpgc_gift_card' === $column ) {
            if ( MonPilates_GiftCards::is_gift_card_product( $post_id ) ) {
                $sessions = MonPilates_GiftCards::get_product_sessions( $post_id );
                echo '<span title="Carte cadeau ' . esc_attr( $sessions ) . ' séances">🎁</span>';
            }
        }
    }

    /**
     * Options produit carte cadeau
     */
    public function add_product_gift_card_options() {
        global $post;

        echo '<div class="options_group">';

        woocommerce_wp_checkbox( array(
            'id'          => '_mpgc_is_gift_card',
            'label'       => __( 'Carte cadeau', 'monpilates-giftcards' ),
            'description' => __( 'Ce produit est une carte cadeau Mon Pilates', 'monpilates-giftcards' ),
        ) );

        woocommerce_wp_text_input( array(
            'id'                => '_mpgc_sessions',
            'label'             => __( 'Nombre de séances', 'monpilates-giftcards' ),
            'type'              => 'number',
            'custom_attributes' => array( 'min' => 1, 'step' => 1 ),
            'description'       => __( 'Nombre de séances incluses dans cette carte cadeau', 'monpilates-giftcards' ),
        ) );

        echo '</div>';
    }

    /**
     * Sauvegarder options produit
     */
    public function save_product_gift_card_options( $post_id ) {
        $is_gift_card = isset( $_POST['_mpgc_is_gift_card'] ) ? 'yes' : 'no';
        update_post_meta( $post_id, '_mpgc_is_gift_card', $is_gift_card );

        if ( isset( $_POST['_mpgc_sessions'] ) ) {
            update_post_meta( $post_id, '_mpgc_sessions', absint( $_POST['_mpgc_sessions'] ) );
        }
    }

    /**
     * Widget dashboard
     */
    public function add_dashboard_widget() {
        wp_add_dashboard_widget(
            'mpgc_dashboard_widget',
            '🎁 Cartes Cadeaux Mon Pilates',
            array( $this, 'render_dashboard_widget' )
        );
    }

    /**
     * Contenu widget dashboard
     */
    public function render_dashboard_widget() {
        global $wpdb;

        // Stats
        $total = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key = '_mpgc_is_gift_card_order' AND meta_value = 'yes'" );
        $pending = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->postmeta} pm1 INNER JOIN {$wpdb->postmeta} pm2 ON pm1.post_id = pm2.post_id WHERE pm1.meta_key = '_mpgc_is_gift_card_order' AND pm1.meta_value = 'yes' AND pm2.meta_key = '_mpgc_activation_status' AND pm2.meta_value = 'pending'" );

        ?>
        <div class="mpgc-dashboard-stats">
            <div class="mpgc-stat">
                <span class="mpgc-stat-number"><?php echo esc_html( $total ); ?></span>
                <span class="mpgc-stat-label">cartes vendues</span>
            </div>
            <div class="mpgc-stat">
                <span class="mpgc-stat-number"><?php echo esc_html( $pending ); ?></span>
                <span class="mpgc-stat-label">en attente d'activation</span>
            </div>
        </div>

        <p style="text-align: center; margin-top: 15px;">
            <a href="<?php echo admin_url( 'edit.php?post_type=shop_order&mpgc_filter=gift_cards' ); ?>" class="button">
                Voir toutes les cartes cadeaux
            </a>
        </p>

        <style>
        .mpgc-dashboard-stats { display: flex; justify-content: space-around; padding: 15px 0; }
        .mpgc-stat { text-align: center; }
        .mpgc-stat-number { display: block; font-size: 32px; font-weight: 700; color: #cf317c; }
        .mpgc-stat-label { font-size: 12px; color: #666; }
        </style>
        <?php
    }

    /**
     * Menu admin
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Cartes Cadeaux',
            '🎁 Cartes Cadeaux',
            'manage_woocommerce',
            'mpgc-gift-cards',
            array( $this, 'render_admin_page' )
        );
    }

    /**
     * Page admin
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>🎁 Cartes Cadeaux Mon Pilates</h1>

            <div class="mpgc-admin-page">
                <div class="card">
                    <h2>Accès rapides</h2>
                    <p>
                        <a href="<?php echo admin_url( 'edit.php?post_type=shop_order&mpgc_filter=gift_cards' ); ?>" class="button button-primary">
                            📋 Voir toutes les commandes cartes cadeaux
                        </a>
                    </p>
                    <p>
                        <a href="<?php echo admin_url( 'edit.php?post_type=shop_order&mpgc_filter=pending' ); ?>" class="button">
                            ⏳ Cartes en attente d'activation
                        </a>
                    </p>
                    <p>
                        <a href="<?php echo admin_url( 'edit.php?post_type=product&product_cat=cartes-cadeaux' ); ?>" class="button">
                            🛍️ Gérer les produits cartes cadeaux
                        </a>
                    </p>
                </div>

                <div class="card">
                    <h2>Configuration</h2>
                    <p>Les produits cartes cadeaux sont automatiquement créés à l'activation du plugin :</p>
                    <ul>
                        <li>Carte Cadeau - 1 séance (20€)</li>
                        <li>Carte Cadeau - 5 séances (95€)</li>
                        <li>Carte Cadeau - 10 séances (180€)</li>
                    </ul>
                    <p>Pour modifier les prix, éditez les produits dans WooCommerce > Produits.</p>
                </div>
            </div>
        </div>

        <style>
        .mpgc-admin-page { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .mpgc-admin-page .card { padding: 20px; }
        .mpgc-admin-page .card h2 { margin-top: 0; }
        .mpgc-admin-page .card ul { margin-left: 20px; }
        </style>
        <?php
    }
}
