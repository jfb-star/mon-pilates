<?php
/**
 * Plugin Name: Mon Pilates — Fix Really Simple Security 2FA email
 * Description: Workaround pour un bug de Really Simple Security qui bloque les routes REST API utilisées par leur propre 2FA email (`/really-simple-security/v1/two-fa/v2/...`). Le filtre `authorize_rest_api_requests` (security/wordpress/rest-api.php) refuse toute requête REST sans header Authorization OU non loggée — y compris la route qui génère et envoie le code de vérif. On le retire sur plusieurs hooks pour couvrir tous les timings de chargement de RSSSL.
 * Author: JFB
 * Version: 1.1.0
 */
defined( 'ABSPATH' ) || exit;

/**
 * Retire le filtre RSSSL inconditionnel. Idempotent — on peut l'appeler
 * plusieurs fois, le filtre est juste retiré s'il existe.
 */
function monpilates_drop_rsssl_rest_filter(): void {
	if ( function_exists( 'authorize_rest_api_requests' ) ) {
		remove_filter( 'rest_request_before_callbacks', 'authorize_rest_api_requests', 10 );
	}
}

// On essaie sur plusieurs hooks parce qu'on ne sait pas avec certitude quand
// RSSSL inclut son fichier rest-api.php (c'est probablement après plugins_loaded).
add_action( 'plugins_loaded', 'monpilates_drop_rsssl_rest_filter', PHP_INT_MAX );
add_action( 'init', 'monpilates_drop_rsssl_rest_filter', PHP_INT_MAX );
add_action( 'rest_api_init', 'monpilates_drop_rsssl_rest_filter', 1 );
