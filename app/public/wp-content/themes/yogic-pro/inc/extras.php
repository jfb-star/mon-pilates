<?php
/**
 * Custom functions that act independently of the theme templates
 *
 * Eventually, some of the functionality here could be replaced by core features
 *
 * @package Yogic Pro
 */

/**
 * Get our wp_nav_menu() fallback, wp_page_menu(), to show a home link.
 */
function yogic_pro_page_menu_args( $args ) {
	$args['show_home'] = true;
	return $args;
}
add_filter( 'wp_page_menu_args', 'yogic_pro_page_menu_args' );

/**
 * Adds custom classes to the array of body classes.
 */
function yogic_pro_body_classes( $classes ) {
	// Adds a class of group-blog to blogs with more than 1 published author
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Ajouter les classes WordPress standard pour les pages
	if ( is_page() ) {
		global $post;

		// Ajouter page-id-{ID}
		$classes[] = 'page-id-' . $post->ID;

		// Ajouter page-{slug}
		$classes[] = 'page-' . $post->post_name;

		// Ajouter page-template si un template custom est utilisé
		$template_slug = get_page_template_slug( $post->ID );
		if ( $template_slug ) {
			$template_slug = str_replace( array( '.php', '/' ), array( '', '-' ), $template_slug );
			$classes[] = 'page-template-' . $template_slug;
		}
	}

	return $classes;
}
add_filter( 'body_class', 'yogic_pro_body_classes' );

/**
 * Filter in a link to a content ID attribute for the next/previous image links on image attachment pages
 */
function yogic_pro_enhanced_image_navigation( $url, $id ) {
	if ( ! is_attachment() && ! wp_attachment_is_image( $id ) )
		return $url;

	$image = get_post( $id );
	if ( ! empty( $image->post_parent ) && $image->post_parent != $id )
		$url .= '#main';

	return $url;
}
add_filter( 'attachment_link', 'yogic_pro_enhanced_image_navigation', 10, 2 );