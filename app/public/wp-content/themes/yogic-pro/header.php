<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Yogic Pro
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
<meta name="viewport" content="width=device-width">
<link rel="profile" href="https://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link rel="icon" type="image/x-icon" href="https://mon-pilates.bzh/wp-content/uploads/2024/09/favicon.ico">
<!--[if lt IE 9]>
<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/ie.css" type="text/css" media="all" />
<![endif]-->
<?php
	wp_head();
	$themename = wp_get_theme();
	$themename = preg_replace("/\W/", "_", strtolower($themename) );
	if( !get_option( $themename ) ) {
	require get_template_directory() . '/index-default.php';
	exit;
	}
?>
	<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-EWPT46BDTM">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-EWPT46BDTM');
</script>
</head>

<body id="top" <?php body_class(); ?>>
<div class="sitewrapper <?php if( of_get_option('boxlayout', true) != '' ) { ?>boxlayout<?php } ?>">

  <!-- ============================================================
       NAVIGATION PREMIUM MON PILATES
       Menu signature inspiré de l'océan et du bien-être
       ============================================================ -->

  <header class="mp-header" data-state="top" role="banner">
    <div class="mp-header__inner">

      <!-- Logo avec animation respiration au hover -->
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="mp-logo" aria-label="<?php esc_attr_e( 'Accueil Mon Pilates', 'yogic-pro' ); ?>">
        <div class="mp-logo__breath"></div>
        <?php
        $logo_url = mp_get_logo_url();
        if ( $logo_url ) : ?>
          <img src="<?php echo esc_url( $logo_url ); ?>"
               alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?> - Cours de Pilates à Larmor-Plage"
               class="mp-logo__image">
        <?php else : ?>
          <span class="mp-logo__text"><?php bloginfo( 'name' ); ?></span>
        <?php endif; ?>
      </a>

      <!-- Navigation principale -->
      <nav class="mp-nav" role="navigation" aria-label="<?php esc_attr_e( 'Menu principal', 'yogic-pro' ); ?>">
        <?php
        // Utiliser le menu par son nom pour bypasser Max Mega Menu
        wp_nav_menu( array(
          'menu'            => 'Primary Menu',  // Nom du menu directement
          'container'       => false,
          'menu_class'      => 'mp-nav__list menu',
          'menu_id'         => 'mp-primary-menu',
          'walker'          => new MP_Nav_Walker(),
          'fallback_cb'     => false,
          'depth'           => 3,
          'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
        ) );
        ?>
      </nav>

      <!-- Lien secondaire Cartes cadeaux -->
      <a href="<?php echo esc_url( mp_get_gift_card_url() ); ?>" class="mp-cta-secondary">
        <?php esc_html_e( 'Cartes cadeaux', 'yogic-pro' ); ?>
      </a>

      <!-- Espace Membre - Bouton personnalisé -->
      <button class="mp-member-btn" aria-label="<?php esc_attr_e( 'Espace membre', 'yogic-pro' ); ?>">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span><?php esc_html_e( 'Mon compte', 'yogic-pro' ); ?></span>
      </button>

      <!-- CTA Principal - Voir le planning -->
      <a href="<?php echo esc_url( mp_get_planning_url() ); ?>" class="mp-cta">
        <svg class="mp-cta__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span class="mp-cta__text"><?php esc_html_e( 'Voir le planning', 'yogic-pro' ); ?></span>
      </a>

      <!-- Toggle mobile - Burger élégant 2 lignes -->
      <button class="mp-toggle"
              aria-expanded="false"
              aria-controls="mp-mobile-menu"
              aria-label="<?php esc_attr_e( 'Ouvrir le menu', 'yogic-pro' ); ?>">
        <span class="mp-toggle__line"></span>
        <span class="mp-toggle__line"></span>
      </button>

    </div>
  </header>

  <!-- Menu mobile - Overlay depuis la droite -->
  <div class="mp-mobile-menu" id="mp-mobile-menu" aria-hidden="true">
    <div class="mp-mobile-menu__backdrop"></div>
    <div class="mp-mobile-menu__panel">
      <!-- Bouton fermer -->
      <button class="mp-mobile-menu__close" aria-label="<?php esc_attr_e( 'Fermer le menu', 'yogic-pro' ); ?>"></button>
      <nav class="mp-mobile-menu__nav" aria-label="<?php esc_attr_e( 'Menu mobile', 'yogic-pro' ); ?>">
        <?php
        wp_nav_menu( array(
          'theme_location'  => 'primary',
          'container'       => false,
          'menu_class'      => 'mp-mobile-nav__list',
          'menu_id'         => 'mp-mobile-primary-menu',
          'fallback_cb'     => false,
          'depth'           => 2,
        ) );
        ?>
      </nav>
      <a href="<?php echo esc_url( mp_get_planning_url() ); ?>" class="mp-mobile-menu__cta">
        <?php esc_html_e( 'Voir le planning', 'yogic-pro' ); ?>
      </a>
      <a href="<?php echo esc_url( mp_get_gift_card_url() ); ?>" class="mp-mobile-menu__cta-secondary">
        <?php esc_html_e( 'Cartes cadeaux', 'yogic-pro' ); ?>
      </a>
      <!-- Espace Membre Mobile - Bouton personnalisé -->
      <button class="mp-member-btn mp-member-btn--mobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span><?php esc_html_e( 'Mon compte', 'yogic-pro' ); ?></span>
      </button>
    </div>
  </div>

  <!-- Widget Bsport caché (déclenché par nos boutons) -->
  <div id="bsport-widget-hidden" style="position:absolute;left:-9999px;opacity:0;pointer-events:none;"></div>

  <!-- Spacer pour compenser le header fixe -->
  <!-- <div class="mp-header-spacer"></div> -->

  <!-- Ancien header masqué pour compatibilité (certains JS peuvent le chercher) -->
  <!-- <div class="header" style="display: none !important;" aria-hidden="true"></div> -->

<?php if ( is_home() || is_front_page() ) { ?>
<?php if( of_get_option('customslider',true) == ''){ ?>
    <div class="slider-main monpilates-hero">
       <?php
		// Charger toutes les images des slides pour le slider
		$slAr = array();
		$m = 0;
		for ($i=1; $i<11; $i++) {
			if ( of_get_option('slide'.$i, true) != "" ) {
				$imgSrc 	= of_get_option('slide'.$i, true);
				if ( strlen($imgSrc) > 10 ) {
					$slAr[$m]['image_src'] = of_get_option('slide'.$i, true);
					$m++;
				}
			}
		}
		if( $slAr > 0 ){
			$n = 0;?>
                <div id="slider" class="nivoSlider">
                <?php
                foreach( $slAr as $sv ){
                    $n++; ?><img src="<?php echo esc_url($sv['image_src']); ?>" alt="Mon Pilates - Pratique du Pilates à Larmor-Plage avec séances de bien-être et remise en forme"/><?php
                }
                ?>
                </div>

                <div class="monpilates-hero-content">
                    <div class="monpilates-hero-logo">
                        <?php if( of_get_option( 'sitelogo', true ) != '' ) { ?>
                            <img src="<?php echo esc_url( of_get_option( 'sitelogo', true )); ?>" alt="<?php bloginfo('name'); ?>"/>
                        <?php } ?>
                    </div>

                    <?php
                    // Utiliser les paramètres du premier slide
                    $slogan = of_get_option('slidedesc1', true);
                    $title = of_get_option('slidetitle1', true);
                    $subtitle = of_get_option('slidesubtitle1', true);
                    $buttonUrl = of_get_option('slideurl1', true);
                    $buttonText = of_get_option('slidebutton1', true);

                    // Valeurs par défaut si vide
                    if(empty($slogan)) $slogan = 'VOTRE STUDIO PILATES FACE À LA MER';
                    if(empty($title)) $title = strtoupper(get_bloginfo('name'));
                    if(empty($subtitle)) $subtitle = 'Chez <strong>Mon Pilates à Larmor-Plage</strong>, profitez de <strong>cours de Pilates toute l\'année</strong> dans un cadre unique <strong>face à l\'océan</strong>. Résidents de <strong>Larmor-Plage, Ploemeur ou Lorient</strong>, vacanciers de passage : venez bouger à votre rythme selon vos disponibilités.';
                    if(empty($buttonUrl)) $buttonUrl = mp_get_planning_url();
                    if(empty($buttonText)) $buttonText = 'Réservez votre séance';

                    // Paramètres pour les autres boutons - SANS valeurs par défaut
                    $giftCardUrl = of_get_option('slideurl2', true);
                    $giftCardText = of_get_option('slidebutton2', true);
                    $phoneNumber = of_get_option('slidedesc2', true);
                    ?>

                    <div class="monpilates-hero-slogan">
                        <?php echo do_shortcode($slogan); ?>
                    </div>

                    <h1 class="monpilates-hero-title">
                        <?php echo esc_html( $title ); ?>
                    </h1>

                    <h2 class="monpilates-hero-subtitle">
                        <?php echo do_shortcode($subtitle); ?>
                    </h2>

                    <div class="monpilates-hero-buttons">
                        <?php if(!empty($buttonUrl) && !empty($buttonText)) { ?>
                        <a href="<?php echo esc_url($buttonUrl); ?>" class="hero-btn hero-btn-primary">
                            <span class="hero-btn-icon">📅</span>
                            <?php echo esc_html( $buttonText ); ?>
                        </a>
                        <?php } ?>

                        <?php if(!empty($giftCardUrl) ) { ?>
                        <a href="<?php echo esc_url($giftCardUrl); ?>" class="hero-btn hero-btn-secondary">
                            <span class="hero-btn-icon">💬</span>
                            <?php echo esc_html( $giftCardText ); ?>
                        </a>
                        <?php } ?>

                        <?php if(!empty($phoneNumber)) { ?>
                        <a href="tel:<?php echo esc_attr( str_replace(' ', '', $phoneNumber) ); ?>" class="hero-btn hero-btn-phone">
                            <span class="hero-btn-icon">📞</span>
                            <?php echo esc_html( $phoneNumber ); ?>
                        </a>
                        <?php } ?>
                    </div>
                </div>
             <?php } ?>
    </div><!-- slider -->

<?php } else {
 $short_code = of_get_option('customslider');
 echo do_shortcode($short_code);
 } ?>
	<?php } else {
		if( of_get_option('innerpagebanner',true) == '') { $cls = 'style="display:none"'; } else { $cls = ''; }
	?>
		<div class="innerbanner" <?php echo $cls; ?>>
          <?php
			$header_image = get_header_image();

			if( is_single() || is_archive() || is_category() || is_author()|| is_search()) {
				if(!empty($header_image)){
					echo '<img src="'.esc_url( $header_image ).'" width="'.get_custom_header()->width.'" height="'.get_custom_header()->height.'" alt="'.esc_attr( get_bloginfo('name') . ' - Bannière' ).'" />';
				} elseif( of_get_option('innerpagebanner',true) != '') {
        			echo '<img src="'.esc_url( of_get_option( 'innerpagebanner', true )).'" alt="Mon Pilates - Bannière">';
				}
			}
			elseif( has_post_thumbnail() ) {
				$src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
				$thumbnailSrc = $src[0];
				echo '<img src="'.esc_url($thumbnailSrc).'" alt="'.esc_attr( get_the_title() ).'">';
			}
			elseif ( ! empty( $header_image ) ) {
				echo '<img src="'.esc_url( $header_image ).'" width="'.get_custom_header()->width.'" height="'.get_custom_header()->height.'" alt="'.esc_attr( get_bloginfo('name') . ' - Bannière' ).'" />';
            }
			elseif( of_get_option('innerpagebanner',true) != '') {
            	echo '<img src="'.esc_url( of_get_option( 'innerpagebanner', true )).'" alt="Mon Pilates - Bannière">';
		    } ?>
        </div>
	<?php }	?>
  <?php include ('section-pagecolumn.php'); ?>
