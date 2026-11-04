<?php
/**
 * Plugin Name: Mon Pilates — Mesure d'audience soumise au consentement
 * Description: Google Analytics, Jetpack Stats, WooCommerce Analytics et l'attribution des commandes WooCommerce ne se lancent qu'après accord dans le bandeau Complianz.
 *
 * Pourquoi un mu-plugin plutôt que le bloqueur de Complianz :
 * le bloqueur (« enable_cookie_blocker ») n'a jamais été activé et l'activer en bloc
 * bloquerait aussi Google Fonts, les cartes, etc. Ici on ne touche qu'aux traceurs,
 * avec le balisage natif de Complianz : <script type="text/plain" data-category="…">,
 * que complianz.js réactive lui-même dès que la catégorie est acceptée (y compris au
 * chargement des pages suivantes, quand le cookie de consentement existe déjà).
 *
 * Tout se décide côté navigateur : compatible avec le cache de pages (WP Fastest Cache).
 */

defined( 'ABSPATH' ) || exit;

const MONPILATES_GA_ID = 'G-EWPT46BDTM';

/**
 * Google Analytics 4 — chargé uniquement après accord « statistiques ».
 * - Consent Mode v2 : tout refusé par défaut, accordé quand le bloc bloqué s'exécute.
 * - Google Signals et la personnalisation publicitaire coupés.
 */
add_action(
	'wp_head',
	function () {
		if ( is_admin() ) {
			return;
		}
		$id = esc_js( MONPILATES_GA_ID );
		?>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
</script>
<script type="text/plain" data-category="statistics">
gtag('consent', 'update', {analytics_storage: 'granted'});
gtag('js', new Date());
gtag('config', '<?php echo $id; ?>', {allow_google_signals: false, allow_ad_personalization_signals: false});
</script>
<script type="text/plain" data-category="statistics" async data-cmplz-src="https://www.googletagmanager.com/gtag/js?id=<?php echo rawurlencode( MONPILATES_GA_ID ); ?>"></script>
		<?php
	},
	2
);

/**
 * Jetpack Stats et WooCommerce Analytics : on neutralise la balise <script src>
 * (les petits scripts inline qui préparent les files _stq / _wca restent, ils ne
 * posent aucun cookie) et Complianz la lance après accord « statistiques ».
 */
add_filter(
	'script_loader_tag',
	function ( $tag, $handle ) {
		$gated = array( 'jetpack-stats', 'woocommerce-analytics', 'woocommerce-analytics-client' );
		if ( is_admin() || ! in_array( $handle, $gated, true ) ) {
			return $tag;
		}
		// Ne réécrire que la balise qui porte un src (pas les blocs inline before/after).
		return preg_replace_callback(
			'#<script\b([^>]*?)\ssrc=(["\'])([^"\']+)\2([^>]*)>#i',
			function ( $m ) {
				$attrs = $m[1] . $m[4];
				$attrs = preg_replace( '#\stype=(["\'])[^"\']*\1#i', '', $attrs );
				return '<script type="text/plain" data-category="statistics"' . $attrs . ' data-cmplz-src="' . $m[3] . '">';
			},
			$tag
		);
	},
	20,
	2
);

/**
 * Attribution des commandes WooCommerce (cookies sbjs_*) : désactivée par défaut,
 * réactivée côté navigateur quand la catégorie « marketing » est acceptée
 * (c'est la catégorie que WooCommerce associe à cette fonction).
 */
add_filter( 'wc_order_attribution_allow_tracking', '__return_false' );

add_action(
	'wp_footer',
	function () {
		if ( is_admin() ) {
			return;
		}
		?>
<script>
(function () {
	function allow() {
		if (window.wc_order_attribution && typeof window.wc_order_attribution.setOrderTracking === 'function') {
			window.wc_order_attribution.setOrderTracking(true);
			return true;
		}
		return false;
	}
	document.addEventListener('cmplz_fire_categories', function (e) {
		var cats = (e.detail && e.detail.categories) || [];
		if (cats.indexOf('marketing') === -1) { return; }
		if (!allow()) { window.addEventListener('load', allow); }
	});
})();
</script>
		<?php
	},
	5
);
