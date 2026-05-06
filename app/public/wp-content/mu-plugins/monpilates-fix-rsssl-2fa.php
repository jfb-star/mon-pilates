<?php
/**
 * Plugin Name: Mon Pilates — Fix Really Simple Security 2FA email
 * Description: Workaround pour un bug de Really Simple Security qui bloque les routes REST API utilisées par leur propre 2FA email (`/really-simple-security/v1/two-fa/v2/...`). Le filtre `authorize_rest_api_requests` (security/wordpress/rest-api.php) refuse toute requête REST sans header Authorization OU non loggée — ce qui inclut la route qui génère et envoie le code de vérif. Résultat : on est en pleine étape 2FA (donc pas encore loggé), l'appel REST est recalé en 401, le code n'est jamais généré, l'email ne part jamais. On retire le filtre. La sécurité des routes REST critiques reste assurée par les `permission_callback` natifs de WordPress.
 * Author: JFB
 * Version: 1.0.0
 */
defined( 'ABSPATH' ) || exit;

add_action( 'plugins_loaded', function () {
	if ( function_exists( 'authorize_rest_api_requests' ) ) {
		remove_filter( 'rest_request_before_callbacks', 'authorize_rest_api_requests', 10 );
	}
}, 99 );
