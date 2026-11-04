<?php
/**
 * Plugin Name: Mon Pilates — SEO (redirections)
 * Description: Redirections 301 des anciennes URL et des pages sans valeur pour Google.
 *
 * Les URL ci-dessous renvoyaient une 404, faisaient doublon avec une page
 * plus récente ou n'avaient pas de contenu propre (boutique vide, témoignages
 * intitulés « Google »). Une 301 transmet leur éventuel historique à la bonne page.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'template_redirect', function () {
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return;
	}

	$path = trailingslashit( strtolower( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH ) ) );

	$gift = '/offrez-du-bien-etre-avec-nos-cartes-cadeaux-pilates-a-larmor-plage-pres-de-lorient/';

	$map = array(
		'/nouvelle-salle-pilates-larmor-plage/' => '/seances-individuelles/',
		'/cours-de-pilates-ploemeur-tarifs/'    => '/cours-de-pilates-larmor-plage-tarifs/',
		'/cours-prives/'                        => '/seances-individuelles/',
		'/shop/'                                => $gift,
		'/testimonials/'                        => '/',
	);

	$target = $map[ $path ] ?? null;

	// Pages individuelles de témoignages (/testimonials/flavie/…)
	if ( ! $target && 0 === strpos( $path, '/testimonials/' ) ) {
		$target = '/';
	}

	if ( $target ) {
		wp_safe_redirect( home_url( $target ), 301, 'Mon Pilates SEO' );
		exit;
	}
}, 1 );
