<?php
/**
 * Plugin Name: Mon Pilates - Cartes Cadeaux
 * Plugin URI: https://monpilates.fr
 * Description: Système complet de cartes cadeaux pour Mon Pilates : vente, PDF, emails, back-office.
 * Version: 1.0.0
 * Author: Mon Pilates
 * Author URI: https://monpilates.fr
 * Text Domain: monpilates-giftcards
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

// Constantes du plugin
define( 'MPGC_VERSION', '1.0.0' );
define( 'MPGC_PLUGIN_FILE', __FILE__ );
define( 'MPGC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MPGC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'MPGC_UPLOADS_DIR', wp_upload_dir()['basedir'] . '/monpilates-giftcards/' );
define( 'MPGC_UPLOADS_URL', wp_upload_dir()['baseurl'] . '/monpilates-giftcards/' );

// Couleurs Mon Pilates
define( 'MPGC_COLOR_OCEAN', '#7FA8B6' );
define( 'MPGC_COLOR_ROSE', '#CF317C' );
define( 'MPGC_COLOR_DARK', '#2c3e50' );

/**
 * Classe principale du plugin
 */
final class MonPilates_GiftCards {

    /**
     * Instance unique
     */
    private static $instance = null;

    /**
     * Modules du plugin
     */
    public $checkout;
    public $pdf;
    public $emails;
    public $admin;
    public $resend;

    /**
     * Obtenir l'instance unique
     */
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructeur
     */
    private function __construct() {
        $this->check_requirements();
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Vérifier les prérequis
     */
    private function check_requirements() {
        if ( ! class_exists( 'WooCommerce' ) ) {
            add_action( 'admin_notices', function() {
                echo '<div class="error"><p><strong>Mon Pilates Cartes Cadeaux</strong> nécessite WooCommerce pour fonctionner.</p></div>';
            });
            return false;
        }
        return true;
    }

    /**
     * Inclure les fichiers nécessaires
     */
    private function includes() {
        require_once MPGC_PLUGIN_DIR . 'includes/class-mp-giftcard-checkout.php';
        require_once MPGC_PLUGIN_DIR . 'includes/class-mp-giftcard-pdf.php';
        require_once MPGC_PLUGIN_DIR . 'includes/class-mp-giftcard-emails.php';
        require_once MPGC_PLUGIN_DIR . 'includes/class-mp-giftcard-admin.php';
        require_once MPGC_PLUGIN_DIR . 'includes/class-mp-giftcard-resend.php';
    }

    /**
     * Initialiser les hooks
     */
    private function init_hooks() {
        add_action( 'init', array( $this, 'init' ), 0 );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );

        // Créer le dossier uploads au besoin
        register_activation_hook( MPGC_PLUGIN_FILE, array( $this, 'activate' ) );
    }

    /**
     * Initialisation
     */
    public function init() {
        // Charger les modules
        $this->checkout = new MPGC_Checkout();
        $this->pdf      = new MPGC_PDF();
        $this->emails   = new MPGC_Emails();
        $this->admin    = new MPGC_Admin();
        $this->resend   = new MPGC_Resend();

        // Shortcodes
        add_shortcode( 'mpgc_gift_cards', array( $this, 'shortcode_gift_cards' ) );
        add_shortcode( 'mpgc_resend_form', array( $this, 'shortcode_resend_form' ) );

        // Vérifier si les produits existent, sinon les créer
        // (cas où WooCommerce a été installé après l'activation du plugin)
        $this->maybe_create_products_on_init();
    }

    /**
     * Créer les produits si manquants (appelé à chaque init)
     */
    private function maybe_create_products_on_init() {
        if ( ! class_exists( 'WooCommerce' ) ) {
            return;
        }

        // Ne vérifier qu'une fois par session admin
        if ( ! is_admin() ) {
            return;
        }

        // Vérifier si les produits existent déjà
        $existing = get_posts( array(
            'post_type'      => 'product',
            'posts_per_page' => 1,
            'meta_query'     => array(
                array(
                    'key'   => '_mpgc_is_gift_card',
                    'value' => 'yes',
                ),
            ),
        ) );

        if ( empty( $existing ) ) {
            $this->maybe_create_products();
        }
    }

    /**
     * Activation du plugin
     */
    public function activate() {
        // Créer le dossier pour les PDFs
        if ( ! file_exists( MPGC_UPLOADS_DIR ) ) {
            wp_mkdir_p( MPGC_UPLOADS_DIR );
        }

        // Fichier .htaccess pour sécuriser (toujours vérifier)
        $htaccess = MPGC_UPLOADS_DIR . '.htaccess';
        if ( ! file_exists( $htaccess ) ) {
            file_put_contents( $htaccess, "Options -Indexes\nDeny from all\n" );
        }

        // Index.php vide (toujours vérifier)
        $index = MPGC_UPLOADS_DIR . 'index.php';
        if ( ! file_exists( $index ) ) {
            file_put_contents( $index, "<?php\n// Silence is golden." );
        }

        // Créer les produits cartes cadeaux si inexistants
        $this->maybe_create_products();

        flush_rewrite_rules();
    }

    /**
     * Créer les produits WooCommerce
     */
    private function maybe_create_products() {
        if ( ! class_exists( 'WooCommerce' ) ) {
            return;
        }

        $products = array(
            array(
                'name'     => 'Carte Cadeau - 1 séance',
                'slug'     => 'carte-cadeau-1-seance',
                'price'    => '20',
                'sessions' => 1,
                'desc'     => 'Offrez une séance découverte de Pilates face à la mer.',
            ),
            array(
                'name'     => 'Carte Cadeau - 5 séances',
                'slug'     => 'carte-cadeau-5-seances',
                'price'    => '95',
                'sessions' => 5,
                'desc'     => 'Offrez 5 séances de Pilates pour un vrai parcours bien-être.',
            ),
            array(
                'name'     => 'Carte Cadeau - 10 séances',
                'slug'     => 'carte-cadeau-10-seances',
                'price'    => '180',
                'sessions' => 10,
                'desc'     => 'Offrez 10 séances de Pilates pour une transformation complète.',
            ),
        );

        foreach ( $products as $prod_data ) {
            // Vérifier si le produit existe déjà
            $existing = get_page_by_path( $prod_data['slug'], OBJECT, 'product' );
            if ( $existing ) {
                continue;
            }

            $product = new WC_Product_Simple();
            $product->set_name( $prod_data['name'] );
            $product->set_slug( $prod_data['slug'] );
            $product->set_regular_price( $prod_data['price'] );
            $product->set_description( $prod_data['desc'] );
            $product->set_short_description( $prod_data['desc'] );
            $product->set_catalog_visibility( 'visible' );
            $product->set_status( 'publish' );
            $product->set_virtual( true ); // Pas de livraison
            $product->set_sold_individually( false );

            $product_id = $product->save();

            // Ajouter les métadonnées
            update_post_meta( $product_id, '_mpgc_is_gift_card', 'yes' );
            update_post_meta( $product_id, '_mpgc_sessions', $prod_data['sessions'] );

            // Catégorie
            $cat_id = $this->get_or_create_category();
            if ( $cat_id ) {
                wp_set_object_terms( $product_id, $cat_id, 'product_cat' );
            }
        }
    }

    /**
     * Obtenir ou créer la catégorie "Cartes Cadeaux"
     */
    private function get_or_create_category() {
        $term = get_term_by( 'slug', 'cartes-cadeaux', 'product_cat' );
        if ( $term ) {
            return $term->term_id;
        }

        $result = wp_insert_term( 'Cartes Cadeaux', 'product_cat', array(
            'slug' => 'cartes-cadeaux',
            'description' => 'Nos cartes cadeaux Pilates',
        ) );

        if ( ! is_wp_error( $result ) ) {
            return $result['term_id'];
        }

        return false;
    }

    /**
     * Assets frontend
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'mpgc-frontend',
            MPGC_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            MPGC_VERSION
        );

        wp_enqueue_script(
            'mpgc-frontend',
            MPGC_PLUGIN_URL . 'assets/js/frontend.js',
            array( 'jquery' ),
            MPGC_VERSION,
            true
        );

        wp_localize_script( 'mpgc-frontend', 'mpgc_ajax', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce'    => wp_create_nonce( 'mpgc_nonce' ),
        ) );
    }

    /**
     * Assets admin
     */
    public function enqueue_admin_assets( $hook ) {
        if ( 'edit.php' === $hook || 'post.php' === $hook ) {
            wp_enqueue_style(
                'mpgc-admin',
                MPGC_PLUGIN_URL . 'assets/css/admin.css',
                array(),
                MPGC_VERSION
            );
        }
    }

    /**
     * Shortcode : Afficher les cartes cadeaux
     */
    public function shortcode_gift_cards( $atts ) {
        ob_start();
        include MPGC_PLUGIN_DIR . 'templates/gift-cards-display.php';
        return ob_get_clean();
    }

    /**
     * Shortcode : Formulaire de renvoi
     */
    public function shortcode_resend_form( $atts ) {
        ob_start();
        include MPGC_PLUGIN_DIR . 'templates/resend-form.php';
        return ob_get_clean();
    }

    /**
     * Vérifier si un produit est une carte cadeau
     */
    public static function is_gift_card_product( $product_id ) {
        return 'yes' === get_post_meta( $product_id, '_mpgc_is_gift_card', true );
    }

    /**
     * Vérifier si une commande contient des cartes cadeaux
     */
    public static function order_has_gift_cards( $order ) {
        if ( ! $order ) {
            return false;
        }

        foreach ( $order->get_items() as $item ) {
            if ( self::is_gift_card_product( $item->get_product_id() ) ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Obtenir le nombre de séances d'une carte cadeau
     */
    public static function get_product_sessions( $product_id ) {
        return (int) get_post_meta( $product_id, '_mpgc_sessions', true );
    }
}

/**
 * Fonction globale pour accéder au plugin
 */
function MPGC() {
    return MonPilates_GiftCards::instance();
}

// Démarrer le plugin après le chargement des plugins
add_action( 'plugins_loaded', 'MPGC', 10 );
