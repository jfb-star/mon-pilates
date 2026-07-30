<?php
/**
 * Plugin Name: Mon Pilates — Bandeau d'information
 * Description: Bandeau en haut de chaque page pour annoncer une fermeture du studio. Il se retire tout seul à la date de fin, se referme d'un clic côté visiteuse, et peut être coupé depuis Réglages → Général. La période est évaluée dans le navigateur pour rester juste malgré le cache de pages (WP Fastest Cache).
 * Author: JFB
 * Version: 1.0.0
 */
defined( 'ABSPATH' ) || exit;

/** Nom de l'option qui porte l'interrupteur manuel. */
const MONPILATES_BANDEAU_OPTION = 'monpilates_bandeau_actif';

/** Clé `localStorage` mémorisant que la visiteuse a fermé le bandeau. */
const MONPILATES_BANDEAU_CLE_MASQUAGE = 'mp-notice-dismissed';

/**
 * Le message et sa période — le seul endroit à modifier.
 *
 * Pour couper le bandeau :
 *   1. tout seul        : plus rien à faire après `fin`, il disparaît ;
 *   2. sans déploiement : Réglages → Général → décocher « Bandeau d'information » ;
 *   3. par la visiteuse : le bouton « × » le masque définitivement sur son
 *                         appareil (mémorisé sous la clé `id`).
 *
 * Pour réutiliser le bandeau plus tard : changer `id` (sinon les visiteuses qui
 * avaient fermé l'ancien message ne verront pas le nouveau), les dates, les textes.
 *
 * Les dates sont lues en heure de Paris explicitement, sans dépendre du réglage
 * de fuseau de WordPress : « le lundi 10 août à 00h00 » doit valoir minuit à
 * Larmor-Plage, pas minuit UTC.
 */
function monpilates_bandeau_config(): array {
	return array(
		'id'     => 'fermeture-estivale-aout-2026',
		// Affiché dès maintenant, pour prévenir avant la fermeture…
		'debut'  => '2026-07-30 00:00:00',
		// …et retiré automatiquement le jour de la reprise.
		'fin'    => '2026-08-10 00:00:00',
		'titre'  => 'Fermeture estivale du lundi 3 au samedi 8 août',
		'detail' => 'Reprise des cours le lundi 10 août',
		// Version courte pour les petits écrans : deux lignes maximum.
		'court'  => 'Studio fermé du 3 au 8 août — reprise le lundi 10',
	);
}

/**
 * Convertit une date de la config en millisecondes epoch, comparables à
 * `Date.now()` côté navigateur quel que soit le fuseau de l'appareil.
 */
function monpilates_bandeau_horodatage( string $date ): int {
	$paris = new DateTimeImmutable( $date, new DateTimeZone( 'Europe/Paris' ) );

	return $paris->getTimestamp() * 1000;
}

/**
 * Faut-il envoyer le bandeau dans la page ?
 *
 * On ne teste ici que ce qui ne peut pas mentir dans une page mise en cache :
 * l'interrupteur manuel, et le fait que la période ne soit pas déjà passée. Le
 * créneau exact est vérifié côté navigateur (voir monpilates_bandeau_head), car
 * une page servie depuis le cache a pu être générée des jours plus tôt.
 */
function monpilates_bandeau_a_envoyer(): bool {
	if ( is_admin() || is_feed() || wp_doing_ajax() ) {
		return false;
	}

	if ( ! get_option( MONPILATES_BANDEAU_OPTION, '1' ) ) {
		return false;
	}

	$config = monpilates_bandeau_config();

	return time() * 1000 < monpilates_bandeau_horodatage( $config['fin'] );
}

/**
 * Styles + script d'amorçage, injectés en fin de <head> (priorité 100) pour
 * passer APRÈS les feuilles de style du thème : à spécificité égale c'est le
 * dernier déclaré qui gagne, et nos règles doivent écraser `.mp-header{top:0}`.
 *
 * Le script pose `data-mp-notice="on"` sur <html> avant le premier affichage,
 * ce qui évite tout saut visuel : le bandeau est peint dans son état final.
 */
function monpilates_bandeau_head(): void {
	if ( ! monpilates_bandeau_a_envoyer() ) {
		return;
	}

	$config = monpilates_bandeau_config();
	?>
<style id="mp-notice-css">
/* Hauteur du bandeau : 0 quand il n'y a rien à annoncer, ce qui rend toutes les
   règles ci-dessous sans effet. Affinée au pixel par le script du pied de page. */
:root{--mp-notice-h:0px}
html[data-mp-notice="on"]{--mp-notice-h:52px}
/* 56px = deux lignes de texte court + les marges, cas le plus haut sous 640px. */
@media (max-width:640px){html[data-mp-notice="on"]{--mp-notice-h:56px}}

/* Toujours présent dans le HTML, masqué jusqu'à ce que le script valide la
   période : une page servie depuis le cache reste ainsi correcte. */
.mp-notice{display:none;position:fixed;top:0;left:0;right:0;z-index:9985;
	background:#2c3e50;color:#fff;
	font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
html[data-mp-notice="on"] .mp-notice{display:block}

/* Barre admin WP (32px, 46px en mobile) : le bandeau se glisse dessous. */
body.admin-bar .mp-notice{top:32px}
@media screen and (max-width:782px){body.admin-bar .mp-notice{top:46px}}

/* L'en-tête fixe du thème descend de la hauteur du bandeau… */
html[data-mp-notice="on"] .mp-header{top:var(--mp-notice-h)}
html[data-mp-notice="on"] body.admin-bar .mp-header{top:calc(32px + var(--mp-notice-h))}
@media screen and (max-width:782px){
	html[data-mp-notice="on"] body.admin-bar .mp-header{top:calc(46px + var(--mp-notice-h))}
}
/* …et le contenu suit. Un padding sur .sitewrapper s'ajoute à ce que la page
   prévoit déjà (body{padding-top:85px} sur les pages internes, 0 sur l'accueil),
   sans avoir à connaître ces valeurs. */
html[data-mp-notice="on"] .sitewrapper{padding-top:var(--mp-notice-h)}

.mp-notice__inner{position:relative;box-sizing:border-box;max-width:1200px;margin:0 auto;
	min-height:52px;padding:11px 52px 11px 20px;
	display:flex;align-items:center;justify-content:center;text-align:center}
.mp-notice__text{margin:0;font-size:14px;line-height:1.35;letter-spacing:.01em}
.mp-notice__titre{font-weight:600}
.mp-notice__sep{opacity:.4;margin:0 7px}
.mp-notice__detail{color:#a8c5cf}
.mp-notice__court{display:none}
.mp-notice__close{position:absolute;top:50%;right:8px;transform:translateY(-50%);
	width:38px;height:38px;padding:0;border:0;border-radius:50%;
	background:transparent;color:rgba(255,255,255,.72);
	font-size:22px;line-height:1;cursor:pointer;
	display:flex;align-items:center;justify-content:center;
	transition:background-color .2s,color .2s}
.mp-notice__close:hover{background:rgba(255,255,255,.14);color:#fff}
.mp-notice__close:focus-visible{outline:2px solid #fff;outline-offset:2px}

/* Sous 640px la phrase complète tiendrait sur quatre lignes : on bascule sur la
   version courte. */
@media (max-width:640px){
	.mp-notice__inner{min-height:56px;padding:10px 46px 10px 16px}
	.mp-notice__text{font-size:13px}
	.mp-notice__long{display:none}
	.mp-notice__court{display:block}
}
@media (prefers-reduced-motion:reduce){
	.mp-notice__close{transition:none}
	html[data-mp-notice="on"] .mp-header{transition:none}
}
</style>
<?php
	// Amorçage : décide de la visibilité avant le premier affichage.
	printf(
		'<script id="mp-notice-gate">(function(){try{var n=Date.now();if(n<%1$d||n>=%2$d)return;try{if(localStorage.getItem(%3$s)===%4$s)return}catch(e){}document.documentElement.setAttribute("data-mp-notice","on")}catch(e){}})();</script>' . "\n",
		monpilates_bandeau_horodatage( $config['debut'] ),
		monpilates_bandeau_horodatage( $config['fin'] ),
		wp_json_encode( MONPILATES_BANDEAU_CLE_MASQUAGE ),
		wp_json_encode( $config['id'] )
	);
}
add_action( 'wp_head', 'monpilates_bandeau_head', 100 );

/**
 * Balisage du bandeau, puis script de mesure et de fermeture.
 *
 * Rendu en pied de page : le bandeau étant `position: fixed`, sa place dans le
 * DOM n'a aucune incidence sur l'affichage, et cela évite de toucher au thème
 * (`header.php` n'appelle pas `wp_body_open()`).
 */
function monpilates_bandeau_footer(): void {
	if ( ! monpilates_bandeau_a_envoyer() ) {
		return;
	}

	$config = monpilates_bandeau_config();
	?>
<div class="mp-notice" id="mp-notice" role="region" aria-label="Information du studio">
	<div class="mp-notice__inner">
		<p class="mp-notice__text mp-notice__long">
			<span class="mp-notice__titre"><?php echo esc_html( $config['titre'] ); ?></span>
			<span class="mp-notice__sep" aria-hidden="true">·</span>
			<span class="mp-notice__detail"><?php echo esc_html( $config['detail'] ); ?></span>
		</p>
		<p class="mp-notice__text mp-notice__court"><?php echo esc_html( $config['court'] ); ?></p>
		<button type="button" class="mp-notice__close" aria-label="Fermer ce message">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
</div>
<?php
	// Mesure la hauteur réelle (le texte peut passer sur deux lignes) et câble le
	// bouton de fermeture.
	printf(
		'<script id="mp-notice-js">(function(){var bar=document.getElementById("mp-notice");if(!bar)return;var root=document.documentElement;'
		. 'function mesure(){if(root.getAttribute("data-mp-notice")!=="on")return;root.style.setProperty("--mp-notice-h",bar.offsetHeight+"px")}'
		. 'mesure();if(window.ResizeObserver){new ResizeObserver(mesure).observe(bar)}window.addEventListener("resize",mesure);'
		. 'var f=bar.querySelector(".mp-notice__close");if(f){f.addEventListener("click",function(){'
		. 'try{localStorage.setItem(%1$s,%2$s)}catch(e){}root.removeAttribute("data-mp-notice");root.style.removeProperty("--mp-notice-h")})}'
		. '})();</script>' . "\n",
		wp_json_encode( MONPILATES_BANDEAU_CLE_MASQUAGE ),
		wp_json_encode( $config['id'] )
	);
}
add_action( 'wp_footer', 'monpilates_bandeau_footer' );

/**
 * Interrupteur dans Réglages → Général, pour couper le bandeau sans déploiement.
 */
function monpilates_bandeau_reglages(): void {
	register_setting(
		'general',
		MONPILATES_BANDEAU_OPTION,
		array(
			'type'              => 'string',
			'default'           => '1',
			// La case décochée n'est pas envoyée par le formulaire : options.php
			// appelle alors update_option() avec null, d'où le test sur la valeur.
			'sanitize_callback' => 'monpilates_bandeau_sanitize',
		)
	);

	add_settings_field(
		MONPILATES_BANDEAU_OPTION,
		'Bandeau d&rsquo;information',
		'monpilates_bandeau_champ',
		'general',
		'default'
	);
}
add_action( 'admin_init', 'monpilates_bandeau_reglages' );

/**
 * Normalise la case à cocher en '1' (affiché) ou '' (masqué).
 *
 * @param mixed $valeur Valeur postée, ou null quand la case est décochée.
 */
function monpilates_bandeau_sanitize( $valeur ): string {
	return $valeur ? '1' : '';
}

/** Rendu de la case à cocher dans Réglages → Général. */
function monpilates_bandeau_champ(): void {
	$config  = monpilates_bandeau_config();
	$actif   = (bool) get_option( MONPILATES_BANDEAU_OPTION, '1' );
	$fin_sec = (int) ( monpilates_bandeau_horodatage( $config['fin'] ) / 1000 );
	?>
	<label for="<?php echo esc_attr( MONPILATES_BANDEAU_OPTION ); ?>">
		<input type="checkbox"
			id="<?php echo esc_attr( MONPILATES_BANDEAU_OPTION ); ?>"
			name="<?php echo esc_attr( MONPILATES_BANDEAU_OPTION ); ?>"
			value="1"
			<?php checked( $actif ); ?>>
		Afficher le bandeau en haut du site
	</label>
	<p class="description">
		Message actuel : «&nbsp;<?php echo esc_html( $config['titre'] ); ?> &middot;
		<?php echo esc_html( $config['detail'] ); ?>&nbsp;».<br>
		Il s&rsquo;efface tout seul le <?php echo esc_html( wp_date( 'j F Y', $fin_sec ) ); ?>.
		D&eacute;cocher ci-dessus permet de le retirer avant.
	</p>
	<?php
}

/**
 * Vider le cache de pages quand on bascule l'interrupteur : sans ça, les pages
 * déjà en cache continueraient à contenir le bandeau et la case décochée
 * semblerait sans effet.
 */
function monpilates_bandeau_vider_cache(): void {
	do_action( 'wpfc_clear_all_cache', true );
}
add_action( 'update_option_' . MONPILATES_BANDEAU_OPTION, 'monpilates_bandeau_vider_cache' );
add_action( 'add_option_' . MONPILATES_BANDEAU_OPTION, 'monpilates_bandeau_vider_cache' );
