<?php
/**
 * Plugin Name: Mon Pilates - Planning Custom
 * Description: Planning des cours avec design premium, données Bsport et réservation
 * Version: 1.0.0
 * Author: Mon Pilates
 * Text Domain: monpilates-planning
 */

if (!defined('ABSPATH')) {
    exit;
}

class MonPilates_Planning {

    private static $instance = null;

    // Configuration par défaut
    private $default_options = [
        'company_id' => 3023,
        'days_to_show' => 90, // 3 mois par défaut
        'cache_duration' => 300, // 5 minutes
        'booking_base_url' => 'https://backoffice.bsport.io/booker-module-s',
        'timezone' => 'Europe/Paris',
        'filters_enabled' => ['establishment', 'activity', 'coach'],
        'cta_text' => 'Réserver',
        'cta_full_text' => 'Complet',
        'debug_mode' => false,
    ];

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', [$this, 'init']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_shortcode('monpilates_planning', [$this, 'render_shortcode']);
    }

    public function init() {
        load_plugin_textdomain('monpilates-planning', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Migration : corriger l'ancienne booking_base_url si sauvée en BDD
        $saved = get_option('monpilates_planning_options', []);
        if ( ! empty( $saved['booking_base_url'] ) && strpos( $saved['booking_base_url'], '/booker-module-s' ) === false ) {
            $saved['booking_base_url'] = 'https://backoffice.bsport.io/booker-module-s';
            update_option( 'monpilates_planning_options', $saved );
        }
    }

    /**
     * Enqueue CSS & JS
     */
    public function enqueue_assets() {
        if (!$this->should_load_assets()) {
            return;
        }

        wp_enqueue_style(
            'monpilates-planning',
            plugin_dir_url(__FILE__) . 'assets/css/planning.css',
            [],
            '1.0.0'
        );

        wp_enqueue_script(
            'monpilates-planning',
            plugin_dir_url(__FILE__) . 'assets/js/planning.js',
            [],
            '1.0.0',
            true
        );

        // Passer les options au JS
        $options = $this->get_options();
        wp_localize_script('monpilates-planning', 'monpilatesPlanning', [
            'ajaxUrl' => rest_url('monpilates/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'companyId' => $options['company_id'],
            'daysToShow' => $options['days_to_show'],
            'bookingBaseUrl' => $options['booking_base_url'],
            'timezone' => $options['timezone'],
            'ctaText' => $options['cta_text'],
            'ctaFullText' => $options['cta_full_text'],
            'filtersEnabled' => $options['filters_enabled'],
            'i18n' => [
                'loading' => 'Chargement du planning...',
                'error' => 'Impossible de charger le planning. Veuillez réessayer.',
                'noClasses' => 'Aucun cours prévu ce jour.',
                'spots' => 'place(s) disponible(s)',
                'duration' => 'min',
                'allActivities' => 'Toutes les activités',
                'allLocations' => 'Tous les lieux',
                'allCoaches' => 'Tous les coachs',
                'today' => "Aujourd'hui",
                'tomorrow' => 'Demain',
                'filterTitle' => 'Filtrer',
                'resetFilters' => 'Réinitialiser',
            ],
            'debug' => $options['debug_mode'],
        ]);
    }

    private function should_load_assets() {
        global $post;
        if ($post && has_shortcode($post->post_content, 'monpilates_planning')) {
            return true;
        }
        return false;
    }

    /**
     * Register REST API routes (proxy pour éviter CORS)
     */
    public function register_rest_routes() {
        register_rest_route('monpilates/v1', '/offers', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_offers'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('monpilates/v1', '/establishments', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_establishments'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * API Proxy: Get offers from Bsport
     */
    public function api_get_offers(WP_REST_Request $request) {
        $options = $this->get_options();
        $company_id = $options['company_id'];

        // Timezone Europe/Paris
        $tz = new DateTimeZone('Europe/Paris');
        $now = new DateTime('now', $tz);

        // Paramètres de date - FORCER la semaine en cours
        $date_min = $request->get_param('date_min') ?: $now->format('Y-m-d');
        $date_max_obj = clone $now;
        $date_max_obj->modify('+' . $options['days_to_show'] . ' days');
        $date_max = $request->get_param('date_max') ?: $date_max_obj->format('Y-m-d');

        // Clé de cache
        $cache_key = 'monpilates_offers_' . md5($company_id . $date_min . $date_max);
        $cached = get_transient($cache_key);

        if ($cached !== false && !$options['debug_mode']) {
            return new WP_REST_Response($cached, 200);
        }

        // Appel API Bsport
        $all_offers = [];
        $page = 1;
        $max_pages = 10; // Sécurité

        // Debug info
        $debug_info = [
            'date_min' => $date_min,
            'date_max' => $date_max,
            'server_time' => $now->format('Y-m-d H:i:s T'),
        ];

        do {
            // Bsport API: utilise "min_date" et "max_date" (pas date_min/date_max)
            $api_url = sprintf(
                'https://api.production.bsport.io/api/v1/offer/?company=%d&min_date=%s&max_date=%s&page=%d&o=date_start',
                $company_id,
                $date_min,
                $date_max,
                $page
            );

            $response = wp_remote_get($api_url, [
                'timeout' => 15,
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]);

            if (is_wp_error($response)) {
                return new WP_REST_Response([
                    'error' => true,
                    'message' => $response->get_error_message(),
                ], 500);
            }

            $body = json_decode(wp_remote_retrieve_body($response), true);

            if (!isset($body['results'])) {
                break;
            }

            $all_offers = array_merge($all_offers, $body['results']);

            $has_next = !empty($body['next_page']);
            $page++;

        } while ($has_next && $page <= $max_pages);

        // Transformer les données pour le frontend
        $transformed = $this->transform_offers($all_offers);

        // Ajouter debug info si activé
        if ($options['debug_mode']) {
            $transformed['debug'] = $debug_info;
            $transformed['debug']['api_url_sample'] = $api_url;
            $transformed['debug']['raw_count'] = count($all_offers);
        }

        // Cache
        set_transient($cache_key, $transformed, $options['cache_duration']);

        return new WP_REST_Response($transformed, 200);
    }

    /**
     * API Proxy: Get establishments from Bsport
     */
    public function api_get_establishments(WP_REST_Request $request) {
        $options = $this->get_options();
        $company_id = $options['company_id'];

        $cache_key = 'monpilates_establishments_' . $company_id;
        $cached = get_transient($cache_key);

        if ($cached !== false && !$options['debug_mode']) {
            return new WP_REST_Response($cached, 200);
        }

        $api_url = sprintf(
            'https://api.production.bsport.io/api/v1/establishment/?company=%d',
            $company_id
        );

        $response = wp_remote_get($api_url, [
            'timeout' => 15,
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        if (is_wp_error($response)) {
            return new WP_REST_Response([
                'error' => true,
                'message' => $response->get_error_message(),
            ], 500);
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $establishments = $body['results'] ?? [];

        // Transformer
        $transformed = array_map(function($est) {
            return [
                'id' => $est['id'],
                'name' => $est['title'] ?? $est['name'] ?? 'Lieu ' . $est['id'],
                'address' => $est['address'] ?? '',
                'city' => $est['city'] ?? '',
            ];
        }, $establishments);

        // Cache 1 heure pour les établissements (changent rarement)
        set_transient($cache_key, $transformed, 3600);

        return new WP_REST_Response($transformed, 200);
    }

    /**
     * Transform Bsport offers to frontend format
     */
    private function transform_offers($offers) {
        $transformed = [];

        foreach ($offers as $offer) {
            // Parser la date
            $date_start = new DateTime($offer['date_start']);
            $date_start->setTimezone(new DateTimeZone('Europe/Paris'));

            // Calculer les places disponibles
            $capacity = $offer['effectif'] ?? 0;
            $booked = $offer['validated_booking_count'] ?? 0;
            $spots_left = max(0, $capacity - $booked);

            $transformed[] = [
                'id' => $offer['id'],
                'activity_name' => $offer['activity_name'] ?? 'Cours',
                'date' => $date_start->format('Y-m-d'),
                'time' => $date_start->format('H:i'),
                'datetime' => $date_start->format('c'),
                'duration' => $offer['duration_minute'] ?? 60,
                'coach_id' => $offer['coach'] ?? null,
                'coach_name' => $offer['coach_name'] ?? null, // Peut être null
                'establishment_id' => $offer['establishment'] ?? null,
                'establishment_name' => $offer['establishment_name'] ?? null,
                'capacity' => $capacity,
                'booked' => $booked,
                'spots_left' => $spots_left,
                'is_full' => $offer['full'] ?? ($spots_left === 0),
                'is_available' => $offer['available'] ?? true,
                'has_waitlist' => !($offer['is_waiting_list_full'] ?? true),
                'level' => $offer['level_name'] ?? null,
                'meta_activity' => $offer['meta_activity'] ?? null,
            ];
        }

        return [
            'offers' => $transformed,
            'count' => count($transformed),
            'generated_at' => current_time('c'),
        ];
    }

    /**
     * Render shortcode
     */
    public function render_shortcode($atts) {
        $atts = shortcode_atts([
            'days' => null,
            'establishment' => null,
            'activity' => null,
            'header' => 'false', // Désactivé par défaut (la page a souvent son propre contenu)
            'title' => 'Réservez votre séance de Pilates à Larmor-Plage',
            'subtitle' => 'Consultez le planning et réservez facilement votre cours, adapté à votre niveau.',
        ], $atts);

        $show_header = filter_var($atts['header'], FILTER_VALIDATE_BOOLEAN);

        // Contenu SEO + fallback no-JS
        ob_start();

        // Header optionnel
        if ($show_header) {
            ?>
            <header class="mp-page-header">
                <div class="mp-page-header__inner">
                    <h1 class="mp-page-header__title"><?php echo esc_html($atts['title']); ?></h1>
                    <p class="mp-page-header__subtitle"><?php echo esc_html($atts['subtitle']); ?></p>
                </div>
            </header>
            <?php
        }
        ?>
        <section class="monpilates-planning-section" aria-label="Planning des cours de Pilates">
            <noscript>
                <div class="monpilates-noscript">
                    <p>JavaScript est nécessaire pour afficher le planning interactif.</p>
                    <p><a href="<?php echo esc_url($this->get_options()['booking_base_url']); ?>" target="_blank" rel="noopener">
                        Consulter le planning sur Bsport
                    </a></p>
                </div>
            </noscript>

            <div id="monpilates-planning"
                 class="monpilates-planning"
                 data-days="<?php echo esc_attr($atts['days'] ?? ''); ?>"
                 data-establishment="<?php echo esc_attr($atts['establishment'] ?? ''); ?>"
                 data-activity="<?php echo esc_attr($atts['activity'] ?? ''); ?>"
                 aria-live="polite">

                <!-- Skeleton loading -->
                <div class="monpilates-skeleton" aria-hidden="true">
                    <div class="skeleton-header">
                        <div class="skeleton-tabs">
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                            <span class="skeleton-tab"></span>
                        </div>
                    </div>
                    <div class="skeleton-cards">
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                    </div>
                </div>

            </div>
        </section>
        <?php
        return ob_get_clean();
    }

    /**
     * Admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'Mon Pilates Planning',
            'Mon Pilates Planning',
            'manage_options',
            'monpilates-planning',
            [$this, 'render_admin_page']
        );
    }

    public function register_settings() {
        register_setting('monpilates_planning_options', 'monpilates_planning_options', [
            'sanitize_callback' => [$this, 'sanitize_options'],
        ]);
    }

    public function sanitize_options($input) {
        $sanitized = [];
        $sanitized['company_id'] = absint($input['company_id'] ?? 3023);
        $sanitized['days_to_show'] = min(90, max(1, absint($input['days_to_show'] ?? 90)));
        $sanitized['cache_duration'] = min(3600, max(60, absint($input['cache_duration'] ?? 300)));
        $sanitized['booking_base_url'] = esc_url_raw($input['booking_base_url'] ?? '');
        $sanitized['cta_text'] = sanitize_text_field($input['cta_text'] ?? 'Réserver');
        $sanitized['cta_full_text'] = sanitize_text_field($input['cta_full_text'] ?? 'Complet');
        $sanitized['debug_mode'] = !empty($input['debug_mode']);
        return $sanitized;
    }

    public function render_admin_page() {
        $options = $this->get_options();
        ?>
        <div class="wrap">
            <h1>Mon Pilates - Configuration du Planning</h1>

            <form method="post" action="options.php">
                <?php settings_fields('monpilates_planning_options'); ?>

                <table class="form-table">
                    <tr>
                        <th scope="row">Company ID Bsport</th>
                        <td>
                            <input type="number" name="monpilates_planning_options[company_id]"
                                   value="<?php echo esc_attr($options['company_id']); ?>" class="regular-text">
                            <p class="description">ID de votre entreprise sur Bsport (actuellement: 3023)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Jours à afficher</th>
                        <td>
                            <input type="number" name="monpilates_planning_options[days_to_show]"
                                   value="<?php echo esc_attr($options['days_to_show']); ?>" min="1" max="90">
                            <p class="description">Nombre de jours à afficher (1-90, soit jusqu'à 3 mois)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Durée du cache (secondes)</th>
                        <td>
                            <input type="number" name="monpilates_planning_options[cache_duration]"
                                   value="<?php echo esc_attr($options['cache_duration']); ?>" min="60" max="3600">
                            <p class="description">Durée de mise en cache des données (60-3600 sec)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">URL de réservation Bsport</th>
                        <td>
                            <input type="url" name="monpilates_planning_options[booking_base_url]"
                                   value="<?php echo esc_url($options['booking_base_url']); ?>" class="large-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Texte bouton réservation</th>
                        <td>
                            <input type="text" name="monpilates_planning_options[cta_text]"
                                   value="<?php echo esc_attr($options['cta_text']); ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Texte bouton complet</th>
                        <td>
                            <input type="text" name="monpilates_planning_options[cta_full_text]"
                                   value="<?php echo esc_attr($options['cta_full_text']); ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Mode debug</th>
                        <td>
                            <label>
                                <input type="checkbox" name="monpilates_planning_options[debug_mode]" value="1"
                                       <?php checked($options['debug_mode']); ?>>
                                Activer (désactive le cache)
                            </label>
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>

            <hr>

            <h2>Cache</h2>
            <?php
            // Handle cache clear
            if (isset($_POST['monpilates_clear_cache']) && wp_verify_nonce($_POST['monpilates_cache_nonce'] ?? '', 'monpilates_clear_cache')) {
                global $wpdb;
                $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_monpilates_%' OR option_name LIKE '_transient_timeout_monpilates_%'");
                echo '<div class="notice notice-success"><p>Cache vidé avec succès !</p></div>';
            }
            ?>
            <form method="post">
                <?php wp_nonce_field('monpilates_clear_cache', 'monpilates_cache_nonce'); ?>
                <input type="hidden" name="monpilates_clear_cache" value="1">
                <?php submit_button('Vider le cache', 'secondary', 'submit', false); ?>
            </form>

            <hr>

            <h2>Utilisation</h2>
            <p>Ajoutez ce shortcode dans votre page :</p>
            <code>[monpilates_planning]</code>

            <h3>Options du shortcode</h3>
            <ul>
                <li><code>[monpilates_planning days="14"]</code> - Afficher 14 jours</li>
                <li><code>[monpilates_planning establishment="10821"]</code> - Filtrer par établissement</li>
                <li><code>[monpilates_planning header="false"]</code> - Masquer le header intégré</li>
                <li><code>[monpilates_planning title="Mon titre" subtitle="Ma description"]</code> - Personnaliser le header</li>
            </ul>

            <h3>Exemple complet</h3>
            <pre>[monpilates_planning
    header="true"
    title="Réservez votre séance de Pilates à Larmor-Plage"
    subtitle="Consultez le planning et réservez facilement votre cours, adapté à votre niveau."
]</pre>

            <hr>

            <h2>Test API</h2>
            <p>
                <a href="<?php echo esc_url(rest_url('monpilates/v1/offers')); ?>" target="_blank" class="button">
                    Tester l'endpoint /offers
                </a>
                <a href="<?php echo esc_url(rest_url('monpilates/v1/establishments')); ?>" target="_blank" class="button">
                    Tester l'endpoint /establishments
                </a>
            </p>

            <?php if ($options['debug_mode']): ?>
            <h3>Debug Info</h3>
            <pre><?php print_r($options); ?></pre>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Get merged options
     */
    private function get_options() {
        $saved = get_option('monpilates_planning_options', []);
        return array_merge($this->default_options, $saved);
    }
}

// Initialize
MonPilates_Planning::get_instance();
