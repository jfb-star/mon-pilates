<?php
/**
 * Yogic Pro functions and definitions
 *
 * @package Yogic Pro
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 */
function content($limit) {
$content = explode(' ', get_the_excerpt(), $limit);
if (count($content)>=$limit) {
array_pop($content);
$content = implode(" ",$content).'...';
} else {
$content = implode(" ",$content);
}	
$content = preg_replace('/\[.+\]/','', $content);
$content = apply_filters('the_content', $content);
$content = str_replace(']]>', ']]&gt;', $content);
return $content;
}
//Excerpt limit function
function custom_excerpt_length( $length ) {
	return 100;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

if ( ! function_exists( 'yogic_pro_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 */
function yogic_pro_setup() {

	if ( ! isset( $content_width ) )
		$content_width = 640; /* pixels */

	load_theme_textdomain( 'yogic-pro', get_template_directory() . '/languages' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'title-tag' );
	add_filter('widget_text', 'do_shortcode');
	add_image_size('homepage-thumb',240,145,true);	
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'yogic-pro' ),
		'yoga-classes' => __( 'Yoga Classes', 'yogic-pro' ),
		'quick-links' => __( 'Quick Links', 'yogic-pro' ),
	) );
	add_theme_support( 'custom-background', array(
		'default-color' => 'ffffff'
	) );
	add_editor_style( 'editor-style.css' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
endif; // yogic_pro_setup
add_action( 'after_setup_theme', 'yogic_pro_setup' );

function yogic_pro_widgets_init() {

	register_sidebar( array(
		'name'          => __( 'Blog Sidebar', 'yogic-pro' ),
		'description'   => __( 'Appears on blog page sidebar', 'yogic-pro' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Sidebar Main', 'yogic-pro' ),
		'description'   => __( 'Appears on page sidebar', 'yogic-pro' ),
		'id'            => 'sidebar-main',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	register_sidebar( array(
		'name'          => __( 'Header Widget', 'yogic-pro' ),
		'description'   => __( 'Appears on header', 'yogic-pro' ),
		'id'            => 'header-widget',
		'before_widget' => '<aside id="%1$s" class="header_right headerinfo %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h5 class="headwidjet">',
		'after_title'   => '</h5>',
	) );	
	
	register_sidebar( array(
		'name'          => __( 'Footer Widget 1', 'yogic-pro' ),
		'description'   => __( 'Appears on footer', 'yogic-pro' ),
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="widget-column-1">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5>',
		'after_title'   => '</h5>',
	) );
	
	register_sidebar( array(
		'name'          => __( 'Footer Widget 2', 'yogic-pro' ),
		'description'   => __( 'Appears on footer', 'yogic-pro' ),
		'id'            => 'footer-2',
		'before_widget' => '<div id="%1$s" class="widget-column-2">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5>',
		'after_title'   => '</h5>',
	) );
	
	register_sidebar( array(
		'name'          => __( 'Footer Widget 3', 'yogic-pro' ),
		'description'   => __( 'Appears on footer', 'yogic-pro' ),
		'id'            => 'footer-3',
		'before_widget' => '<div id="%1$s" class="widget-column-3">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5>',
		'after_title'   => '</h5>',
	) );
	
	register_sidebar( array(
		'name'          => __( 'Footer Widget 4', 'yogic-pro' ),
		'description'   => __( 'Appears on footer', 'yogic-pro' ),
		'id'            => 'footer-4',
		'before_widget' => '<div id="%1$s" class="widget-column-4">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5>',
		'after_title'   => '</h5>',
	) );
	
	
	register_sidebar( array(
		'name'          => __( 'Sidebar Contact Page', 'yogic-pro' ),
		'description'   => __( 'Appears on contact page', 'yogic-pro' ),
		'id'            => 'sidebar-contact',
		'before_widget' => '<aside class="widget-contact %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="contactinfo-title">',
		'after_title'   => '</h3>',
	) );

}
add_action( 'widgets_init', 'yogic_pro_widgets_init' );

define( 'OPTIONS_FRAMEWORK_DIRECTORY', get_template_directory_uri() . '/inc/' );
require_once get_template_directory() . '/inc/options-framework.php';

function yogic_pro_scripts() {	
	wp_enqueue_style( 'yogic-pro-gfonts-lato', '//fonts.googleapis.com/css?family=Lato:400,300,300italic,400italic,700,700italic' );	

	if( of_get_option('bodyfontface',true) != '' ){
		wp_enqueue_style( 'yogic-pro-gfonts-body', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('bodyfontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin' );
	}
	if( of_get_option('logofontface',true) != '' ){
		wp_enqueue_style( 'yogic-pro-gfonts-logo', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('logofontface',true)).'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin' );
	}
	if ( of_get_option('navfontface', true) != '' ) {
		wp_enqueue_style( 'yogic-pro-gfonts-nav', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('navfontface',true)).'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin' );
	}
	if ( of_get_option('headfontface', true) != '' ) {
		wp_enqueue_style( 'yogic-pro-gfonts-heading', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('headfontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin');
	}
	if ( of_get_option('sectiontitlefontface', true) != '' ) {
		wp_enqueue_style( 'economicspro-gfonts-sectiontitle', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('sectiontitlefontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin');
	} 
	if ( of_get_option('slidetitlefontface', true) != '' ) {
		wp_enqueue_style( 'economicspro-gfonts-slidetitle', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('slidetitlefontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin');
	} 
	if ( of_get_option('slidesubtitlefontface', true) != '' ) {
		wp_enqueue_style( 'economicspro-gfonts-slidetitle', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('slidesubtitlefontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin');
	}
	if ( of_get_option('slidedesfontface', true) != '' ) {
		wp_enqueue_style( 'economicspro-gfonts-slidedes', '//fonts.googleapis.com/css?family='.rawurlencode(of_get_option('slidedesfontface',true)) .'&subset=cyrillic,arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,latin-ext,tamil,telugu,thai,vietnamese,latin');
	}  	

	wp_enqueue_style( 'yogic-pro-basic-style', get_stylesheet_uri() );
	wp_enqueue_style( 'yogic-pro-editor-style', get_template_directory_uri().'/editor-style.css' );
	wp_enqueue_style( 'yogic-pro-base-style', get_template_directory_uri().'/css/default.css' );	
	if ( is_home() || is_front_page() ) { 
	wp_enqueue_style( 'yogic-pro-nivo-style', get_template_directory_uri().'/css/nivo-slider.css' );
	wp_enqueue_script( 'yogic-pro-nivo-slider', get_template_directory_uri() . '/js/jquery.nivo.slider.js', array('jquery') );
	}	

	wp_enqueue_script( 'yogic-pro-customscripts', get_template_directory_uri() . '/js/custom.js', array('jquery') );	
	wp_enqueue_style( 'yogic-pro-fontawesome-all-style', get_template_directory_uri().'/fontsawesome/css/fontawesome-all.css' );
	wp_enqueue_style( 'yogic-pro-animation', get_template_directory_uri().'/css/animation.css' );
	wp_enqueue_style( 'yogic-pro-hover', get_template_directory_uri().'/css/hover.css' );
	wp_enqueue_style( 'yogic-pro-hover-min', get_template_directory_uri().'/css/hover-min.css' );
	wp_enqueue_script( 'yogic-pro-testimonialsminjs', get_template_directory_uri().'/testimonialsrotator/js/jquery.quovolver.min.js', array('jquery') );	
	wp_enqueue_style( 'yogic-pro-testimonialslider-style', get_template_directory_uri().'/testimonialsrotator/js/tm-rotator.css' );	
	wp_enqueue_style( 'yogic-pro-responsive-style', get_template_directory_uri().'/css/responsive.css' );		
	wp_enqueue_style( 'yogic-pro-owl-style', get_template_directory_uri().'/testimonialsrotator/js/owl.carousel.css' );
	wp_enqueue_script( 'yogic-pro-owljs', get_template_directory_uri().'/testimonialsrotator/js/owl.carousel.js', array('jquery') );
	
	// Style personnalisé Mon Pilates
	wp_enqueue_style( 'yogic-pro-custom-monpilates', get_template_directory_uri().'/css/custom-monpilates-style.css' );

	// Navigation Premium Mon Pilates (sans plugin)
	wp_enqueue_style( 'mp-navigation', get_template_directory_uri().'/css/mp-navigation.css', array('yogic-pro-custom-monpilates'), '1.0.0' );
	wp_enqueue_script( 'mp-navigation', get_template_directory_uri() . '/js/mp-navigation.js', array(), '1.0.0', true );

	// Footer Premium Mon Pilates
	wp_enqueue_style( 'mp-footer', get_template_directory_uri().'/css/mp-footer.css', array('yogic-pro-custom-monpilates'), '1.0.0' );

	// WooCommerce Custom Styles (checkout, cart, etc.)
	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style( 'mp-woocommerce', get_template_directory_uri().'/css/mp-woocommerce.css', array('yogic-pro-custom-monpilates'), '2.0.0' );
	}

	// Style page Contact (chargé uniquement sur la page contact)
	if ( is_page('contact') || is_page(1972) ) {
		wp_enqueue_style( 'yogic-pro-contact-page', get_template_directory_uri().'/css/contact-page-styles.css', array('yogic-pro-custom-monpilates') );
	}

	// Style page "Comment se passe une séance" (chargé sur les pages utilisant ce template)
	if ( is_page_template('template-parts/template-seance.php') || is_page('comment-se-passe-une-seance') || is_page('seance') ) {
		wp_enqueue_style( 'yogic-pro-seance-page', get_template_directory_uri().'/css/seance-page-styles.css', array('yogic-pro-custom-monpilates') );
	}

	// Style pages premium "Le studio" et "Pour qui" (chargé sur les pages utilisant ces templates)
	if ( is_page_template('template-parts/template-studio.php') || is_page_template('template-parts/template-pour-qui.php')
		|| is_page('le-studio') || is_page('studio') || is_page('pour-qui') || is_page('pour-qui-est-le-pilates') ) {
		wp_enqueue_style( 'yogic-pro-premium-pages', get_template_directory_uri().'/css/mp-premium-pages.css', array('yogic-pro-custom-monpilates') );
	}

	// Style pages "Séances individuelles" et "Séances en petit groupe"
	if ( is_page_template('template-parts/template-seance-individuelle.php') || is_page_template('template-parts/template-seance-groupe.php')
		|| is_page('seances-individuelles') || is_page('seance-individuelle') || is_page('individuel')
		|| is_page('seances-petit-groupe') || is_page('petit-groupe') || is_page('seances-groupe') ) {
		wp_enqueue_style( 'yogic-pro-seances-pages', get_template_directory_uri().'/css/mp-seances-styles.css', array('yogic-pro-custom-monpilates') );
	}

	// Style page "Tarifs & Formules" premium
	if ( is_page_template('template-parts/template-tarifs.php')
		|| is_page('tarifs') || is_page('cours-de-pilates-larmor-plage-tarifs') || is_page('formules') || is_page('prix') ) {
		wp_enqueue_style( 'yogic-pro-tarifs-page', get_template_directory_uri().'/css/mp-tarifs-styles.css', array('yogic-pro-custom-monpilates') );
	}

	// Style page "Cartes Cadeaux" premium
	if ( is_page_template('template-parts/template-cartes-cadeaux.php')
		|| is_page('cartes-cadeaux') || is_page('carte-cadeau') || is_page('offrez-du-bien-etre-avec-nos-cartes-cadeaux-pilates-a-larmor-plage-pres-de-lorient') ) {
		wp_enqueue_style( 'yogic-pro-cartes-cadeaux', get_template_directory_uri().'/css/mp-cartes-cadeaux.css', array('yogic-pro-custom-monpilates') );
	}

	// Style pages locales SEO (Pilates Lorient, Pilates Ploemeur)
	if ( is_page_template('template-parts/template-pilates-lorient.php') || is_page_template('template-parts/template-pilates-ploemeur.php')
		|| is_page('pilates-lorient') || is_page('pilates-ploemeur') ) {
		wp_enqueue_style( 'yogic-pro-premium-pages', get_template_directory_uri().'/css/mp-premium-pages.css', array('yogic-pro-custom-monpilates') );
	}

	// Style pages légales (Mentions légales, Confidentialité, CGV)
	if ( is_page_template('template-parts/template-mentions-legales.php')
		|| is_page_template('template-parts/template-politique-confidentialite.php')
		|| is_page_template('template-parts/template-cgv.php')
		|| is_page('mentions-legales') || is_page('politique-de-confidentialite') || is_page('conditions-generales-de-vente') ) {
		wp_enqueue_style( 'mp-legal-pages', get_template_directory_uri().'/css/mp-legal-pages.css', array('yogic-pro-custom-monpilates'), '1.0.0' );
	}

	wp_enqueue_script( 'yogic-pro-counterup', get_template_directory_uri().'/counter/js/jquery.counterup.min.js', array('jquery') );
	wp_enqueue_script( 'yogic-pro-waypoints', get_template_directory_uri().'/counter/js/waypoints.min.js', array('jquery') );
	
	// mixitup script
	wp_enqueue_style( 'yogic-pro-mixitup-style', get_template_directory_uri().'/mixitup/style-mixitup.css' );
	wp_enqueue_script( 'yogic-pro-jquery_013-script', get_template_directory_uri() . '/mixitup/jquery_013.js', array('jquery') );
	wp_enqueue_script( 'yogic-pro-jquery_003-script', get_template_directory_uri() . '/mixitup/jquery_003.js', array('jquery') );
	wp_enqueue_script( 'yogic-pro-screen-script', get_template_directory_uri() . '/mixitup/screen.js', array('jquery') );
	// prettyPhoto script
	wp_enqueue_style( 'yogic-pro-prettyphoto-style', get_template_directory_uri().'/mixitup/prettyPhotoe735.css' );
	wp_enqueue_script( 'yogic-pro-prettyphoto-script', get_template_directory_uri() . '/mixitup/jquery.prettyPhoto5152.js', array('jquery') );
	
	//Client Logo Rotator
	wp_enqueue_style( 'yogic-pro-flexiselcss', get_template_directory_uri().'/css/flexiselcss.css' );	
	wp_enqueue_script( 'yogic-pro-flexisel', get_template_directory_uri() . '/js/jquery.flexisel.js', array('jquery') );
	
	//Popup Video
	wp_enqueue_style( 'yogic-pro-youtube-popup', get_template_directory_uri().'/popupvideo/grt-youtube-popup.css' );	
	wp_enqueue_script( 'yogic-pro-youtube-popup', get_template_directory_uri() . '/popupvideo/grt-youtube-popup.js', array('jquery') );	
	
	
	if( of_get_option('scrollanimation',true) != true) {
		wp_enqueue_style( 'yogic-pro-animation-style', get_template_directory_uri().'/css/animation-style.css' );
		wp_enqueue_script( 'yogic-pro-custom-animation', get_template_directory_uri() . '/js/custom-animation.js', array('jquery') );	
	}
	
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'yogic_pro_scripts' );

function media_css_hook(){
	
	?>
    	
    	<script>
		jQuery(window).bind('scroll', function() {
	var wwd = jQuery(window).width();
	if( wwd > 939 ){
		var navHeight = 100; // Déclencher plus tôt pour le style Mon Pilates
		<?php if( of_get_option('headstick',true) == true) { ?>
		if (jQuery(window).scrollTop() > navHeight) {
			jQuery(".header").addClass('fixed scrolled');
		}else {
			jQuery(".header").removeClass('fixed scrolled');
		}
		<?php } else { ?>
		// Style Mon Pilates - header transparent qui devient blanc au scroll
		if (jQuery(window).scrollTop() > navHeight) {
			jQuery(".header").addClass('scrolled');
		}else {
			jQuery(".header").removeClass('scrolled');
		}
		<?php } ?>
	}
});		
					
jQuery(window).load(function() {   
  jQuery('.owl-carousel').owlCarousel({
    loop:true,	
	autoplay: <?php echo of_get_option('testimonialsautoplay',true); ?>,
	autoplayTimeout: <?php echo of_get_option('testimonialsrotatingspeed',true); ?>,
    margin:30,
    nav:false,
	dots: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})
    
  });


jQuery(document).ready(function() {
  
  jQuery('.link').on('click', function(event){
    var $this = jQuery(this);
    if($this.hasClass('clicked')){
      $this.removeAttr('style').removeClass('clicked');
    } else{
      $this.css('background','#7fc242').addClass('clicked');
    }
  });
 
});
</script>

<?php if ( is_home() || is_front_page() ) { ?>        
<script>
		jQuery(window).load(function() {
        jQuery('#slider').nivoSlider({
        	effect:'<?php echo of_get_option('slideefect',true); ?>', //sliceDown, sliceDownLeft, sliceUp, sliceUpLeft, sliceUpDown, sliceUpDownLeft, fold, fade, random, slideInRight, slideInLeft, boxRandom, boxRain, boxRainReverse, boxRainGrow, boxRainGrowReverse
		  	animSpeed: <?php echo of_get_option('slideanim',true); ?>,
			pauseTime: <?php echo of_get_option('slidepause',true); ?>,
			directionNav: <?php echo of_get_option('slidenav',true); ?>,
			controlNav: <?php echo of_get_option('slidepage',true); ?>,
			pauseOnHover: <?php echo of_get_option('slidepausehover',true); ?>,
    });
});
</script>
<?php } ?>


<?php      
}
add_action('wp_head','media_css_hook'); 


function yogic_pro_custom_head_codes() { 
	if ( function_exists('of_get_option') ){
		if ( of_get_option('style2', true) != '' ) {
			echo "<style>". esc_html( of_get_option('style2', true) ) ."</style>";
		}
		echo "<style>";		
		if ( of_get_option('bodyfontcolor', true) != '' ) {
			echo 'body, .contact-form-section .address{color:'. esc_html( of_get_option('bodyfontcolor', true) ) .';}';
		}
		if( of_get_option('bodyfontface', true) != '' || of_get_option('bodyfontsize',true) != ''){
			echo "body{font-family:".of_get_option('bodyfontface')."; font-size:".of_get_option('bodyfontsize',true).";}";
		}
		if( of_get_option('logofontface',true) != '' || of_get_option('logofontcolor',true) != '' || of_get_option('logofontsize',true) != ''){
			echo ".logo h1 {font-family:".of_get_option('logofontface').";color:".of_get_option('logofontcolor',true).";font-size:".of_get_option('logofontsize',true)."}";
		}
		if( of_get_option('logotaglinecolor',true) != '' ){
			echo ".tagline{color:".of_get_option('logotaglinecolor',true).";}";
		}
		if( of_get_option('logoheight',true) != '' ){
			echo ".logo img{height:".of_get_option('logoheight',true)."px;}";
		}
		
		if( of_get_option('logowidth',true) != '' ){
			echo ".logo{width:".of_get_option('logowidth',true)."}";
		}				
		
		
		 
		if( of_get_option('sectiontitlefontface',true) != '' || of_get_option('sectitlesize',true) != '' || of_get_option('sectitlecolor',true) != '' ){
			echo "h2.section_title, .sec_content_main_title{ font-family:".of_get_option('sectiontitlefontface',true)."; font-size:".of_get_option('sectitlesize',true)."; color:".of_get_option('sectitlecolor',true)."; }";
		}
		
		if( of_get_option('sectitlecolor',true) != '' ){
			echo "h2.section_title::after{ border-color:".of_get_option('sectitlecolor',true)."; }";
		}		
			
		
		if ( of_get_option('linkhovercolor', true) != '' ) {
			echo 'a:hover, .slide_toggle a:hover{color:'. esc_html( of_get_option('linkhovercolor', true) ) .';}';
		}			
		if( of_get_option('foottitlecolor', true) != '' || of_get_option('ftfontsize', true) != ''  ){
			echo ".footer h5{color:".of_get_option('foottitlecolor', true)."; font-size:".of_get_option('ftfontsize', true)."; }";
		}
										
		
		if( of_get_option('designcolor', true) != ''){
			echo ".designby{color:".of_get_option('designcolor',true)."}";
		}		
				
		if ( of_get_option('headertopfontcolor', true) != '' ) {
			echo ".infobox, .infobox a{ color:".of_get_option('headertopfontcolor',true).";}";
		}
				
		
				
		if( of_get_option('btntxtcolor', true) != ''){
			echo ".button, #commentform input#submit, input.search-submit, .post-password-form input[type=submit], p.read-more a, .pagination ul li span, .pagination ul li a, .wpcf7 form input[type='submit'], #sidebar .search-form input.search-submit{ color:". of_get_option('btntxtcolor', true) ."; }";
		}
		if( of_get_option('btntxthvcolor', true) != '' ){
			echo ".button:hover, #commentform input#submit:hover, input.search-submit:hover, .post-password-form input[type=submit]:hover, .pagination ul li .current, .pagination ul li a:hover, .wpcf7 form input[type='submit']:hover{ color:". esc_html( of_get_option('btntxthvcolor', true) ) .";}";
		}		
		if( of_get_option('btntxtcolor', true) != ''){
			echo "a.morebutton{ color:". of_get_option('btntxtcolor', true) ."; }";
		}
		if( of_get_option('btntxthvcolor', true) != '' ){
			echo "a.morebutton:hover{ color:". esc_html( of_get_option('btntxthvcolor', true) ) .";}";
		}
		
		if( of_get_option('btnbghvcolor',true) != '' || of_get_option('btntxthvcolor', true) != ''){
			echo "a.buttonstyle1{background-color:".of_get_option('btnbghvcolor',true)."; color:". of_get_option('btntxthvcolor', true) ."; }";
		}
		if( of_get_option('btntxtcolor', true) != '' ){
			echo "a.buttonstyle1:hover{ color:". esc_html( of_get_option('btntxtcolor', true) ) .";}";
		}
			
		if ( of_get_option('widgetboxbgcolor', true) != '' || of_get_option('widgetboxfontcolor', true) != '' ) {
		echo "#sidebar .search-form input.search-field{ background-color:".of_get_option('widgetboxbgcolor', true)."; color:".of_get_option('widgetboxfontcolor', true).";  }";
		}			
		if ( of_get_option('wdgttitleccolor', true) != '' ) {
			echo "h3.widget-title{ color:".of_get_option('wdgttitleccolor', true).";}";
		}				
		if ( of_get_option('footerbgcolor', true) != '' || of_get_option('footdesccolor', true) != '' ) {
		echo "#footer-wrapper{background-color:".of_get_option('footerbgcolor', true)."; color:".of_get_option('footdesccolor', true).";}";
		}						
		
		if ( of_get_option('footdesccolor', true) != '' ) {
			echo ".contactdetail a{color:".of_get_option('footdesccolor', true)."; }";
		}
		
		if( of_get_option('footercoprbgcolor',true) != ''){
			echo ".copyright-wrapper{background-color:".of_get_option('footercoprbgcolor',true)."}";
		}			
			
		
		if( of_get_option('sldpagebg',true) != ''){
			echo ".nivo-controlNav a{background-color:".of_get_option('sldpagebg',true)."}";
		}
		
		if( of_get_option('sidebarliaborder', true) != '' ){
			echo "#sidebar ul li{border-color:".of_get_option('sidebarliaborder',true)."}";
		}	
		if( of_get_option('sidebarfontcolor',true) != '' ){
			echo "#sidebar ul li a{color:".of_get_option('sidebarfontcolor',true)."; }";
		}		
		
		if ( of_get_option('slidetitlefontface', true) != '' || of_get_option('slidetitlecolor', true) != '' || of_get_option('slidetitlefontsize', true) != '') {
		echo ".nivo-caption h1{ font-family:".of_get_option('slidetitlefontface', true)."; color:".of_get_option('slidetitlecolor', true)."; font-size:".of_get_option('slidetitlefontsize', true).";  }";
		}
		
		
		if ( of_get_option('slidedesfontface', true) != '' || of_get_option('slidedesccolor', true) != '' || of_get_option('slidedescfontsize', true) != '') {
		echo ".nivo-caption p{font-family:".of_get_option('slidedesfontface', true)."; color:".of_get_option('slidedesccolor', true)."; font-size:".of_get_option('slidedescfontsize', true).";}";
		}
		
			
		if ( of_get_option('copylinkshover', true) != '' ) {
		echo ".copyright-wrapper a:hover{ color: ".of_get_option('copylinkshover', true)."; }";
		}	
		
		if ( of_get_option('togglemenucolor', true) != '' ) {
		echo ".toggle a{ color:".of_get_option('togglemenucolor', true)."; }";
		}		
		
/* Heading */
		if( of_get_option('headfontface', true) != '' ){
			echo "h1,h2,h3,h4,h5,h6{ font-family:".of_get_option('headfontface',true)."; }";
		}		
		if ( of_get_option('h1fontsize', true) != '' || of_get_option('h1fontcolor', true) != '' ) {
			echo "h1{ font-size:".of_get_option('h1fontsize', true)."; color:".of_get_option('h1fontcolor', true).";}";
		}
		if ( of_get_option('h2fontsize', true) != '' || of_get_option('h2fontcolor', true) != '' ) {
			echo "h2{ font-size:".of_get_option('h2fontsize', true)."; color:".of_get_option('h2fontcolor', true).";}";
		}		
		if ( of_get_option('h3fontsize', true) != '' || of_get_option('h3fontcolor', true) != '' ) {
			echo "h3{ font-size:".of_get_option('h3fontsize', true)."; color:".of_get_option('h3fontcolor', true).";}";
		}		
		if ( of_get_option('h4fontsize', true) != '' || of_get_option('h4fontcolor', true) != '' ) {
			echo "h4{ font-size:".of_get_option('h4fontsize', true)."; color:".of_get_option('h4fontcolor', true).";}";
		}		
		if ( of_get_option('h5fontsize', true) != '' || of_get_option('h5fontcolor', true) != '' ) {
			echo "h5{font-size:".of_get_option('h5fontsize', true)."; color:".of_get_option('h5fontcolor', true).";}";
		}		
		if ( of_get_option('h6fontsize', true) != '' || of_get_option('h6fontcolor', true) != '' ) {
			echo "h6{ font-size:".of_get_option('h6fontsize', true)."; color:".of_get_option('h6fontcolor', true).";}";
		}
/* Custom editable */
			
		if ( of_get_option('footsocialcolor', true) != '' ) {
			echo ".footer .social-icons a{ color:".of_get_option('footsocialcolor', true)."; }";
		}		
		
		$sliderarrowhex = of_get_option('sldarrowbg',true); 
		list($r,$g,$b) = sscanf($sliderarrowhex,'#%02x%02x%02x');
		if ( of_get_option('sldarrowbg', true) != '' ) {
			echo ".nivo-directionNav a{background-color:rgba(".$r.",".$g.",".$b.",".of_get_option('sldarrowopacity',true).");}";
		}
				
		if ( of_get_option('galleryfilter', true) != '' || of_get_option('galleryfiltercolor', true) != '' || of_get_option('galleryfilterbdr', true) != '' ) {
			echo "ul.portfoliofilter li a{ background-color:".of_get_option('galleryfilter', true).";  color:".of_get_option('galleryfiltercolor', true)."; border-color:".of_get_option('galleryfilterbdr', true).";}";
		}
		
		if ( of_get_option('galleryfiltercolorhv', true) != '' ) {
			echo "ul.portfoliofilter li a.selected, ul.portfoliofilter li a:hover,ul.portfoliofilter li:hover a{ color:".of_get_option('galleryfiltercolorhv', true)."; }";
		}		
		
		if ( of_get_option('gallerytitlecolorhv', true) != '' ) {
			echo ".holderwrap h5{ color:".of_get_option('gallerytitlecolorhv', true)."; }";
		}
		if ( of_get_option('gallerytitlecolorhv', true) != '' ) {
			echo ".holderwrap h5::after{ background-color:".of_get_option('gallerytitlecolorhv', true)."; }";
		}		
				
		if ( of_get_option('teamttlfontcolor', true) != '' ) {
			echo ".teammember-list span.title a{ color:".of_get_option('teamttlfontcolor', true)."; }";
		}
		if ( of_get_option('teamdegigfontcolor', true) != '' ) {
			echo ".teammember-list cite{ color:".of_get_option('teamdegigfontcolor', true)."; }";
		}			
				
		$headerhex = of_get_option('headerbgcolor',true); 
		list($r,$g,$b) = sscanf($headerhex,'#%02x%02x%02x');
		if ( of_get_option('headerbgcolor', true) != '' ) {
			echo ".ppmenubg{background-color:rgba(".$r.",".$g.",".$b.",".of_get_option('headerbgopacity',true).");}";
		}		
				
		if ( of_get_option('testidotsbgcolor', true) != '' ) {
			echo ".owl-controls .owl-dot{ background-color:".of_get_option('testidotsbgcolor', true)."; }";
		}		
		
		if ( of_get_option('testimonialdescriptioncolor', true) != '' ) {
			echo "#clienttestiminials .item{ color:".of_get_option('testimonialdescriptioncolor', true)."; }";
		}				
		
		if ( of_get_option('navfontface', true) != '' || of_get_option('navfontsize',true) != '' ) {
			echo '.sitenav ul{font-family:\''. esc_html( of_get_option('navfontface', true) ) .'\', sans-serif;font-size:'.of_get_option('navfontsize',true).'}';
		}		
		
		if ( of_get_option('navfontcolor', true) != '' ) {
			echo '.sitenav ul li a, .sitenav ul li.current_page_item ul.sub-menu li a, .sitenav ul li.current-menu-parent ul.sub-menu li a, .sitenav ul li.current-menu-parent ul.sub-menu li ul.sub-menu li a{color:'. esc_html( of_get_option('navfontcolor', true) ) .';}';
		}
			
		
		//Color scheme for one click background color
		if ( of_get_option('colorscheme', true) != '' ) {
			echo ".green_button:hover,
			.logo,
			.pink_button,
			.benifit_column:hover .benefit_iconbx,
			.button, 
			a.morebutton:hover,
			.nivo-caption .slidermore,
			#commentform input#submit, 
			input.search-submit, 
			.post-password-form input[type='submit'],			
			p.read-more a, 			
			.pagination ul li span, 
			.pagination ul li a, 			
			.wpcf7 form input[type='submit'],			
			#sidebar .search-form input.search-submit,
			.nivo-controlNav a.active,	
			ul.portfoliofilter li a.selected, 
			ul.portfoliofilter li a:hover,
			ul.portfoliofilter li:hover a,
			.holderwrap,
			.pricing_table .price_col.highlight .tf a,
			.msndesc,
			.faq_left,
			.faq_left::after,
			.wel3box_services:hover,
			.classes_column .classimg_bx,		
			.owl-controls .owl-dot.active,		   		
			input.search-submit:hover, 
			.post-password-form input[type=submit]:hover, 			
			.pagination ul li .current, 
			.pagination ul li a:hover,			
			.wpcf7 form input[type='submit']:hover,			
			h3.widget-title,		
			.toggle a,
			.black_button:hover,
			.services_3box:hover .black_button,
			.services_3box .thumbbx,			
			a.buttonstyle1:hover,			
			.news-box .postdt,			
			.news-box .news-thumb,						
			.owl-prev:hover, .owl-next:hover,
			.most_video_bg i,
			.videobox,			
			h2.section_title::after{ background-color:".of_get_option('colorscheme', true)."; }";
		}
			
		
		
		//Color scheme for one click font color
		if ( of_get_option('colorscheme', true) != '' ) {
			echo "a,
			.pp_topstrip .social-icons a:hover,			
			.sitenav ul li a:hover, 
			.sitenav ul li.current_page_item a, 
			.sitenav ul li.current_page_item ul li a:hover,
			.sitenav ul li.current-menu-parent a, 
			.sitenav ul li:hover,
			.sitenav ul li.current_page_item ul.sub-menu li a:hover, 
			.sitenav ul li.current-menu-parent ul.sub-menu li a:hover,
			.sitenav ul li.current-menu-parent ul.sub-menu li ul.sub-menu li a:hover,
			.sitenav ul li.current-menu-parent ul.sub-menu li.current_page_item a,	
			.contactdetail a:hover, 
			.wel3box_desc h6,
			.classes_column:hover .titlebox h4 a,
			.benifit_column:hover h4 a,					
			.contactdetail p span,			
			.counter-column span,			
			div.recent-post a:hover,			
			.copyright-wrapper a,
			#sidebar ul li::before,			
			.services_3box:hover h3,
			.infobox a:hover,
			.slide_toggle a, 
			ul.recent-post li .footerdate,
			.news-box h6 a:hover,
			#sidebar ul li a:hover,
			.teammember-content span,			
			.news-box .poststyle:hover,		
			#clienttestiminials h6,
			.post-title a:hover,
			.bloggridlayout h3.post-title a:hover,			
			#clienttestiminials .item:hover h6{ color:".of_get_option('colorscheme', true)."; }";
		}
		
			
		
		//Color scheme for one click border color
		if ( of_get_option('colorscheme', true) != '' ) {
			echo "ul.portfoliofilter li a.selected, 
			ul.portfoliofilter li a:hover,
			ul.portfoliofilter li:hover a,					
			#clienttestiminials .item span::after,			
			a.borderbutton:hover
			{ border-color:".of_get_option('colorscheme', true)."; }";
		}
		
		if ( of_get_option('colorscheme', true) != '' ) {
			echo "h3.widget-title:after, .msndesc:after{ border-top-color:".of_get_option('colorscheme', true).";}";
		}
		
		
		if ( of_get_option('secondcolorofsite', true) != '' ) {
			echo ".green_button,
			.pink_button:hover,
			.button:hover, 
			a.morebutton,
			.teammember-list .thumnailbx,
			.member-social-icon a:hover,	
			.nivo-caption .slidermore:hover,
			#commentform input#submit:hover, 
			input.search-submit:hover, 
			.post-password-form input[type=submit]:hover, 			
			.videobox i,
			p.read-more a:hover, 
			.pricing_table .tf a,
			.benefit_iconbx, 
			.owl-prev, .owl-next,
			.pagination ul li .current, 
			.pagination ul li a:hover,		
			.footer .social-icons a:hover,
			.hvr-radial-out:before,
			.wpcf7 form input[type='submit']:hover{ background-color:".of_get_option('secondcolorofsite', true)."; }";
		}	
		
		if ( of_get_option('secondcolorofsite', true) != '' ) {
			echo ".pp_topstrip .infobox a:hover,
			.counterlist .counter,
			.designby a,
			.footer ul li a:hover, 
			.footer ul li.current_page_item a,  
			.teammember-list:hover span.title a,
			.welcome_leftbox h5{ color:".of_get_option('secondcolorofsite', true)."; }";
		}	
		
		if ( of_get_option('secondcolorofsite', true) != '' ) {
			echo "#section8 .subtitle,
			.footer .social-icons a
			{ border-color:".of_get_option('secondcolorofsite', true)."; }";
		}
		
		if ( of_get_option('secondcolorofsite', true) != '' ) {
			echo ".pricing_table .th::after
			{ background-image: linear-gradient(to bottom, transparent 0%, ".of_get_option('secondcolorofsite', true)." 100%); }";
		}
		
		if ( of_get_option('colorscheme', true) != '' ) {
			echo ".pricing_table .highlight .th::after
			{ background-image: linear-gradient(to bottom, transparent 0%, ".of_get_option('colorscheme', true)." 100%); }";
		}		
		
		
		echo "</style>";
	}
}
add_action('wp_head', 'yogic_pro_custom_head_codes');


function yogic_pro_pagination() {
	global $wp_query;
	$big = 12345678;
	$page_format = paginate_links( array(
	    'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
	    'format' => '?paged=%#%',
	    'current' => max( 1, get_query_var('paged') ),
	    'total' => $wp_query->max_num_pages,
	    'type'  => 'array'
	) );
	if( is_array($page_format) ) {
		$paged = ( get_query_var('paged') == 0 ) ? 1 : get_query_var('paged');
		echo '<div class="pagination"><div><ul>';
		echo '<li><span>'. $paged . ' of ' . $wp_query->max_num_pages .'</span></li>';
		foreach ( $page_format as $page ) {
			echo "<li>$page</li>";
		}
		echo '</ul></div></div>';
	}
}
/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';


/**
 * Load custom functions file.
 */
require get_template_directory() . '/inc/custom-functions.php';

function yogic_pro_custom_blogpost_pagination( $wp_query ){
	$big = 999999999; // need an unlikely integer
	if ( get_query_var('paged') ) { $pageVar = 'paged'; }
	elseif ( get_query_var('page') ) { $pageVar = 'page'; }
	else { $pageVar = 'paged'; }
	$pagin = paginate_links( array(
		'base' 			=> str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
		'format' 		=> '?'.$pageVar.'=%#%',
		'current' 		=> max( 1, get_query_var($pageVar) ),
		'total' 		=> $wp_query->max_num_pages,
		'prev_text'		=> '&laquo; Prev',
		'next_text' 	=> 'Next &raquo;',
		'type'  => 'array'
	) ); 
	if( is_array($pagin) ) {
		$paged = ( get_query_var('paged') == 0 ) ? 1 : get_query_var('paged');
		echo '<div class="pagination"><div><ul>';
		echo '<li><span>'. $paged . ' of ' . $wp_query->max_num_pages .'</span></li>';
		foreach ( $pagin as $page ) {
			echo "<li>$page</li>";
		}
		echo '</ul></div></div>';
	} 
}
// get slug by id
function yogic_pro_get_slug_by_id($id) {
	$post_data = get_post($id, ARRAY_A);
	$slug = $post_data['post_name'];
	return $slug; 
}

function enqueue_owl_assets() {
    wp_enqueue_style('owl-carousel', 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
    wp_enqueue_style('owl-theme', 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
    wp_enqueue_script('owl-carousel', 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js', array('jquery'), null, true);
    wp_add_inline_script('owl-carousel', '
        jQuery(document).ready(function(){
            jQuery(".owl-carousel").owlCarousel({
                items:1,
                loop:true,
                margin:10,
                nav:true,
                dots:true,
		autoplay: true,           // 👈 ajoute ceci
                autoplayTimeout: 5000,    // 👈 intervalle (en ms)
                autoplayHoverPause: true,
		animateOut: "fadeOut",   // 👈 transition en fondu
                animateIn: "fadeIn",     // 👈 optionnel si tu veux aussi une entrée en fondu
                smartSpeed: 600          // 👈 durée de la transition (ms)
            });
        });
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_owl_assets');

/**
 * C1 : Désactiver le shortcode [contactform] du thème (vulnérable : pas de nonce,
 * pas de sanitisation, mail() natif, XSS, header injection).
 * Le formulaire de contact sécurisé est dans template-contact-premium.php.
 */
add_action( 'init', function() {
    remove_shortcode( 'contactform' );
}, 20 );

/**
 * =============================================================================
 * FORMULAIRE CONTACT CUSTOM - Handler sécurisé
 * =============================================================================
 */

// Traitement du formulaire de contact
function mp_handle_contact_form() {
    // Vérifier le nonce
    if (!isset($_POST['mp_contact_nonce']) || !wp_verify_nonce($_POST['mp_contact_nonce'], 'mp_contact_form')) {
        wp_redirect(home_url('/contact/?contact=error'));
        exit;
    }

    // Sanitize les données
    $prenom = sanitize_text_field($_POST['mp_prenom'] ?? '');
    $nom = sanitize_text_field($_POST['mp_nom'] ?? '');
    $email = sanitize_email($_POST['mp_email'] ?? '');
    $telephone = sanitize_text_field($_POST['mp_telephone'] ?? '');
    $message = sanitize_textarea_field($_POST['mp_message'] ?? '');
    $rgpd = isset($_POST['mp_rgpd']) ? true : false;

    // Validation
    if (empty($prenom) || empty($nom) || empty($email) || empty($message) || !$rgpd) {
        wp_redirect(home_url('/contact/?contact=error'));
        exit;
    }

    if (!is_email($email)) {
        wp_redirect(home_url('/contact/?contact=error'));
        exit;
    }

    // Préparer l'email
    $to = get_option('admin_email'); // Email de l'admin WordPress
    $subject = '[Mon Pilates] Nouveau message de ' . $prenom . ' ' . $nom;

    $body = "Nouveau message depuis le formulaire de contact\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "Prénom : " . $prenom . "\n";
    $body .= "Nom : " . $nom . "\n";
    $body .= "Email : " . $email . "\n";
    $body .= "Téléphone : " . ($telephone ?: 'Non renseigné') . "\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "Message :\n\n" . $message . "\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "Consentement RGPD : Oui\n";
    $body .= "Date : " . date_i18n('d/m/Y à H:i') . "\n";
    $body .= "IP : " . sanitize_text_field( $_SERVER['REMOTE_ADDR'] ) . "\n";

    // R4 : Nettoyer CRLF pour empêcher header injection dans Reply-To
    $safe_reply_name = str_replace( array( "\r", "\n", "\t" ), '', $prenom . ' ' . $nom );
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: Mon Pilates <noreply@mon-pilates.bzh>',
        'Reply-To: ' . $safe_reply_name . ' <' . $email . '>'
    );

    // Envoyer l'email
    $sent = wp_mail($to, $subject, $body, $headers);

    if ($sent) {
        // Email de confirmation au visiteur
        $confirm_subject = 'Merci pour votre message - Mon Pilates';
        $confirm_body = "Bonjour " . $prenom . ",\n\n";
        $confirm_body .= "Nous avons bien reçu votre message et nous vous en remercions.\n";
        $confirm_body .= "Nous vous répondrons dans les plus brefs délais.\n\n";
        $confirm_body .= "À très bientôt,\n";
        $confirm_body .= "L'équipe Mon Pilates\n\n";
        $confirm_body .= "---\n";
        $confirm_body .= "Mon Pilates - Villa les mouettes\n";
        $confirm_body .= "14 Boulevard des dunes, 56260 Larmor-Plage\n";
        $confirm_body .= "Tél : 06 99 18 32 16\n";

        $confirm_headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: Mon Pilates <contact@mon-pilates.bzh>'
        );

        wp_mail($email, $confirm_subject, $confirm_body, $confirm_headers);

        wp_redirect(home_url('/contact/?contact=success'));
    } else {
        wp_redirect(home_url('/contact/?contact=error'));
    }
    exit;
}
add_action('admin_post_mp_contact_submit', 'mp_handle_contact_form');
add_action('admin_post_nopriv_mp_contact_submit', 'mp_handle_contact_form');

/**
 * ==========================================================================
 * NAVIGATION PREMIUM MON PILATES
 * Walker personnalisé pour le menu avec classes BEM
 * ==========================================================================
 */

if ( ! class_exists( 'MP_Nav_Walker' ) ) :

class MP_Nav_Walker extends Walker_Nav_Menu {

    /**
     * Démarre le niveau de sous-menu
     */
    public function start_lvl( &$output, $depth = 0, $args = null ) {
        $indent = str_repeat( "\t", $depth );
        $classes = array( 'sub-menu', 'mp-nav__submenu' );

        if ( $depth === 0 ) {
            $classes[] = 'mp-nav__submenu--level-1';
        } else {
            $classes[] = 'mp-nav__submenu--level-' . ( $depth + 1 );
        }

        $class_names = implode( ' ', $classes );
        $output .= "\n{$indent}<ul class=\"{$class_names}\">\n";
    }

    /**
     * Termine le niveau de sous-menu
     */
    public function end_lvl( &$output, $depth = 0, $args = null ) {
        $indent = str_repeat( "\t", $depth );
        $output .= "{$indent}</ul>\n";
    }

    /**
     * Démarre un élément de menu
     */
    public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;

        // Classes BEM
        $classes[] = 'mp-nav__item';

        if ( $depth === 0 ) {
            $classes[] = 'mp-nav__item--top';
        } else {
            $classes[] = 'mp-nav__item--child';
        }

        // Item actif
        if ( in_array( 'current-menu-item', $classes ) ) {
            $classes[] = 'mp-nav__item--active';
        }

        // Item avec sous-menu
        if ( in_array( 'menu-item-has-children', $classes ) ) {
            $classes[] = 'mp-nav__item--has-children';
        }

        $class_names = implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
        $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

        $id_attr = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
        $id_attr = $id_attr ? ' id="' . esc_attr( $id_attr ) . '"' : '';

        $output .= $indent . '<li' . $id_attr . $class_names . '>';

        // Attributs du lien
        $atts = array();
        $atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
        $atts['target'] = ! empty( $item->target ) ? $item->target : '';
        $atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';

        // Les items parents (avec enfants) au niveau 0 ne sont pas des liens
        $has_children = in_array( 'menu-item-has-children', (array) $item->classes );
        if ( $has_children && $depth === 0 ) {
            $atts['href']        = '#';
            $atts['aria-haspopup'] = 'true';
        } else {
            $atts['href'] = ! empty( $item->url ) ? $item->url : '';
        }

        // Classe BEM pour le lien
        $link_classes = array( 'mp-nav__link' );

        if ( $depth === 0 ) {
            $link_classes[] = 'mp-nav__link--top';
        } else {
            $link_classes[] = 'mp-nav__link--child';
        }

        if ( $has_children && $depth === 0 ) {
            $link_classes[] = 'mp-nav__link--parent';
        }

        $atts['class'] = implode( ' ', $link_classes );

        $atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) ) {
                $value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $title = apply_filters( 'the_title', $item->title, $item->ID );
        $title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

        $item_output = isset( $args->before ) ? $args->before : '';
        $item_output .= '<a' . $attributes . '>';
        $item_output .= ( isset( $args->link_before ) ? $args->link_before : '' ) . $title . ( isset( $args->link_after ) ? $args->link_after : '' );
        $item_output .= '</a>';
        $item_output .= isset( $args->after ) ? $args->after : '';

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }

    /**
     * Termine un élément de menu
     */
    public function end_el( &$output, $item, $depth = 0, $args = null ) {
        $output .= "</li>\n";
    }
}

endif; // class_exists

/**
 * Fonction helper pour obtenir l'URL du CTA "Cartes cadeaux"
 */
function mp_get_gift_card_url() {
    // Slugs possibles pour la page cartes cadeaux
    $slugs = array(
        'offrez-du-bien-etre-avec-nos-cartes-cadeaux-pilates-a-larmor-plage-pres-de-lorient',
        'cartes-cadeaux',
        'carte-cadeau',
    );

    foreach ( $slugs as $slug ) {
        $page = get_page_by_path( $slug );
        if ( $page ) {
            return get_permalink( $page->ID );
        }
    }

    // Fallback : URL par défaut
    return home_url( '/offrez-du-bien-etre-avec-nos-cartes-cadeaux-pilates-a-larmor-plage-pres-de-lorient/' );
}

/**
 * Fonction helper pour obtenir l'URL du planning/réservation
 */
function mp_get_planning_url() {
    // Slugs possibles pour la page planning/réservation
    $slugs = array(
        'planning-des-cours-de-pilates-larmor-plage',
        'planning-reservation',
        'planning',
        'reservation',
    );

    foreach ( $slugs as $slug ) {
        $page = get_page_by_path( $slug );
        if ( $page ) {
            return get_permalink( $page->ID );
        }
    }

    // Fallback : URL par défaut
    return home_url( '/planning-des-cours-de-pilates-larmor-plage/' );
}

/**
 * Fonction helper pour obtenir l'URL de la page contact
 */
function mp_get_contact_url() {
    $page = get_page_by_path( 'contact' );
    if ( $page ) {
        return get_permalink( $page->ID );
    }

    // Fallback : URL par défaut
    return home_url( '/contact/' );
}

/**
 * Fonction helper pour obtenir l'URL de la page séances individuelles
 */
function mp_get_seances_individuelles_url() {
    $page = get_page_by_path( 'seances-individuelles' );
    if ( $page ) {
        return get_permalink( $page->ID );
    }

    // Fallback : URL par défaut
    return home_url( '/seances-individuelles/' );
}

/**
 * Fonction helper pour obtenir l'URL de la page séances en petit groupe
 */
function mp_get_seances_groupe_url() {
    $page = get_page_by_path( 'seances-petit-groupe' );
    if ( $page ) {
        return get_permalink( $page->ID );
    }

    // Fallback : URL par défaut
    return home_url( '/seances-petit-groupe/' );
}

/**
 * Fonction helper pour obtenir l'URL du logo
 */
function mp_get_logo_url() {
    if ( function_exists( 'of_get_option' ) && of_get_option( 'sitelogo', true ) != '' ) {
        return esc_url( of_get_option( 'sitelogo', true ) );
    }

    // Fallback custom logo WordPress
    $custom_logo_id = get_theme_mod( 'custom_logo' );
    if ( $custom_logo_id ) {
        return wp_get_attachment_image_url( $custom_logo_id, 'full' );
    }

    return '';
}

/**
 * Désactiver Max Mega Menu pour notre nouveau menu
 * Max Mega Menu utilise un filtre sur wp_nav_menu_args pour prendre le contrôle
 * On le désactive quand on utilise notre walker MP_Nav_Walker
 */
add_filter( 'wp_nav_menu_args', 'mp_disable_megamenu_for_custom_nav', 99999 );
function mp_disable_megamenu_for_custom_nav( $args ) {
    // Si on utilise notre walker personnalisé, désactiver Max Mega Menu
    if ( isset( $args['walker'] ) && $args['walker'] instanceof MP_Nav_Walker ) {
        // Empêcher Max Mega Menu de remplacer notre walker
        $args['mega_menu_enabled'] = false;
    }

    // Aussi désactiver pour nos IDs de menu spécifiques
    if ( isset( $args['menu_id'] ) && in_array( $args['menu_id'], array( 'mp-primary-menu', 'mp-mobile-primary-menu' ) ) ) {
        $args['mega_menu_enabled'] = false;
    }

    return $args;
}

/**
 * Filtre plus agressif : retirer complètement Max Mega Menu du menu principal
 * quand on utilise le nouveau header
 */
add_filter( 'megamenu_is_enabled_for_location', 'mp_disable_megamenu_location', 10, 2 );
function mp_disable_megamenu_location( $enabled, $location ) {
    // Désactiver Max Mega Menu pour l'emplacement 'primary'
    // Le nouveau menu gère tout lui-même
    if ( $location === 'primary' ) {
        return false;
    }
    return $enabled;
}

/**
 * ==========================================================================
 * BSPORT WIDGET - Espace Membre
 * Bouton personnalisé qui déclenche le widget Bsport (caché)
 * ==========================================================================
 */

/**
 * Charger le script CDN Bsport et le bouton personnalisé
 */
function mp_enqueue_bsport_widget() {
    // Script CDN Bsport
    wp_enqueue_script(
        'bsport-widget-cdn',
        'https://cdn.bsport.io/scripts/widget.js',
        array(),
        null,
        true
    );

    // Script pour monter le widget caché et gérer le clic sur nos boutons custom
    $mount_script = "
        (function() {
            function MountBsportWidget(config, repeat) {
                repeat = repeat || 1;
                if (repeat > 50) { return; }
                if (!window.BsportWidget) {
                    return setTimeout(function() {
                        MountBsportWidget(config, repeat + 1);
                    }, 100 * repeat);
                }
                BsportWidget.mount(config);
            }

            document.addEventListener('DOMContentLoaded', function() {
                // Monter le widget caché
                MountBsportWidget({
                    'parentElement': 'bsport-widget-hidden',
                    'companyId': 3023,
                    'franchiseId': null,
                    'dialogMode': 0,
                    'widgetType': 'loginButton',
                    'language': 'fr',
                    'showFab': false,
                    'fullScreenPopup': false,
                    'styles': undefined,
                    'config': {
                        'loginButton': {
                            'openMemberProfile': true
                        }
                    }
                });

                // Gérer les clics sur nos boutons personnalisés
                document.querySelectorAll('.mp-member-btn').forEach(function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();

                        // Si c'est le bouton mobile, fermer le menu d'abord
                        if (btn.classList.contains('mp-member-btn--mobile')) {
                            var mobileMenu = document.getElementById('mp-mobile-menu');
                            var toggle = document.querySelector('.mp-toggle');
                            if (mobileMenu) {
                                mobileMenu.setAttribute('aria-hidden', 'true');
                            }
                            if (toggle) {
                                toggle.setAttribute('aria-expanded', 'false');
                            }
                            document.body.classList.remove('mp-menu-open');
                        }

                        // Cliquer sur le vrai bouton Bsport caché
                        var hiddenBtn = document.querySelector('#bsport-widget-hidden button');
                        if (hiddenBtn) {
                            hiddenBtn.click();
                        }
                    });
                });
            });
        })();
    ";

    wp_add_inline_script( 'bsport-widget-cdn', $mount_script );
}
add_action( 'wp_enqueue_scripts', 'mp_enqueue_bsport_widget' );

/**
 * ==========================================================================
 * WOOCOMMERCE CUSTOMIZATIONS - Mon Pilates
 * Panier & Checkout premium pour cartes cadeaux
 * ==========================================================================
 */

/* --- Forcer shortcodes classiques --- */
add_filter( 'the_content', 'mp_force_classic_woocommerce_shortcodes', 1 );
function mp_force_classic_woocommerce_shortcodes( $content ) {
    if ( function_exists( 'is_cart' ) && is_cart() ) return '[woocommerce_cart]';
    if ( function_exists( 'is_checkout' ) && is_checkout() && ! is_order_received_page() ) return '[woocommerce_checkout]';
    return $content;
}

add_action( 'wp_enqueue_scripts', 'mp_dequeue_wc_blocks_styles', 100 );
function mp_dequeue_wc_blocks_styles() {
    if ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() ) ) {
        wp_dequeue_style( 'wc-blocks-style' );
        wp_dequeue_style( 'wc-blocks-vendors-style' );
    }
}

/* --- Vider le panier avant ajout carte cadeau --- */
add_filter( 'woocommerce_add_to_cart_validation', 'mp_clear_cart_before_gift_card', 10, 3 );
function mp_clear_cart_before_gift_card( $passed, $product_id, $quantity ) {
    if ( 'yes' === get_post_meta( $product_id, '_mpgc_is_gift_card', true ) ) {
        WC()->cart->empty_cart();
    }
    return $passed;
}

/* --- Rediriger directement vers le checkout (skip panier) --- */
add_filter( 'woocommerce_add_to_cart_redirect', 'mp_redirect_to_checkout' );
function mp_redirect_to_checkout( $url ) {
    return wc_get_checkout_url();
}

/* --- Simplifier le checkout pour les cartes cadeaux --- */
add_filter( 'woocommerce_checkout_fields', 'mp_simplify_checkout_fields' );
function mp_simplify_checkout_fields( $fields ) {
    $has_gift_cards = false;
    if ( WC()->cart ) {
        foreach ( WC()->cart->get_cart() as $cart_item ) {
            if ( 'yes' === get_post_meta( $cart_item['product_id'], '_mpgc_is_gift_card', true ) ) {
                $has_gift_cards = true;
                break;
            }
        }
    }
    if ( $has_gift_cards ) {
        $fields['billing']['billing_address_1']['required'] = false;
        $fields['billing']['billing_city']['required'] = false;
        $fields['billing']['billing_postcode']['required'] = false;
        unset( $fields['billing']['billing_address_2'] );
        unset( $fields['billing']['billing_company'] );
        unset( $fields['shipping'] );
    }
    return $fields;
}

/* --- Vider le panier via URL --- */
add_action( 'wp_loaded', 'mp_clear_cart_url' );
function mp_clear_cart_url() {
    if ( isset( $_GET['empty_cart'] ) && 'yes' === $_GET['empty_cart'] ) {
        WC()->cart->empty_cart();
        wp_redirect( remove_query_arg( 'empty_cart' ) );
        exit;
    }
}

/* --- Lien vider panier --- */
add_action( 'woocommerce_after_cart_totals', 'mp_add_clear_cart_link' );
function mp_add_clear_cart_link() {
    echo '<a href="' . esc_url( add_query_arg( 'empty_cart', 'yes' ) ) . '">Vider le panier</a>';
}

/* =============================================
   HERO HEADERS
   ============================================= */

add_action( 'woocommerce_before_cart', 'mp_cart_hero', 5 );
function mp_cart_hero() {
    ?>
    <div class="mp-wc-hero">
        <div class="mp-wc-hero__icon">🎁</div>
        <h1 class="mp-wc-hero__title">Votre carte cadeau Pilates</h1>
        <p class="mp-wc-hero__subtitle">
            Vous êtes à une étape d'offrir un moment de bien-être.
        </p>
    </div>
    <?php
}

add_action( 'woocommerce_before_checkout_form', 'mp_checkout_hero', 5 );
function mp_checkout_hero() {
    ?>
    <div class="mp-wc-hero">
        <div class="mp-wc-hero__icon">🎁</div>
        <h1 class="mp-wc-hero__title">Finaliser votre cadeau</h1>
        <p class="mp-wc-hero__subtitle">
            Après paiement, la carte cadeau sera envoyée par email,<br>prête à imprimer et à offrir.
        </p>
    </div>
    <?php
}

/* =============================================
   CART REASSURANCE
   ============================================= */

add_action( 'woocommerce_after_cart_totals', 'mp_cart_reassurance', 20 );
function mp_cart_reassurance() {
    mp_render_reassurance_badges( 'mp-cart-reassurance' );
}

add_action( 'woocommerce_review_order_after_payment', 'mp_checkout_reassurance' );
function mp_checkout_reassurance() {
    mp_render_reassurance_badges( 'mp-checkout-reassurance' );
}

function mp_render_reassurance_badges( $class ) {
    ?>
    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $class ); ?>__item">
            <div class="<?php echo esc_attr( $class ); ?>__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <span class="<?php echo esc_attr( $class ); ?>__text">Paiement sécurisé</span>
        </div>
        <div class="<?php echo esc_attr( $class ); ?>__item">
            <div class="<?php echo esc_attr( $class ); ?>__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 22-7z"/></svg>
            </div>
            <span class="<?php echo esc_attr( $class ); ?>__text">Envoi immédiat</span>
        </div>
        <div class="<?php echo esc_attr( $class ); ?>__item">
            <div class="<?php echo esc_attr( $class ); ?>__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span class="<?php echo esc_attr( $class ); ?>__text">PDF imprimable</span>
        </div>
    </div>
    <?php
}

/* =============================================
   TEXTES & TRADUCTIONS
   ============================================= */

add_filter( 'woocommerce_order_button_text', 'mp_custom_order_button_text' );
function mp_custom_order_button_text() {
    return 'Payer et recevoir la carte cadeau';
}

add_filter( 'woocommerce_proceed_to_checkout', 'mp_custom_checkout_button' );
function mp_custom_checkout_button() {
    return '<a href="' . esc_url( wc_get_checkout_url() ) . '" class="checkout-button button alt wc-forward">Finaliser l\'achat de la carte cadeau</a>';
}

add_filter( 'gettext', 'mp_translate_woocommerce', 20, 3 );
add_filter( 'ngettext', 'mp_translate_woocommerce', 20, 3 );
function mp_translate_woocommerce( $translated, $text, $domain ) {
    if ( $domain !== 'woocommerce' ) return $translated;

    $t = array(
        'Checkout'              => 'Paiement',
        'Cart'                  => 'Panier',
        'Cart totals'           => 'Récapitulatif',
        'Order summary'         => 'Récapitulatif',
        'Your order'            => 'Votre commande',
        'Billing details'       => 'Vos coordonnées',
        'Billing address'       => 'Adresse de facturation',
        'Contact information'   => 'Vos coordonnées',
        'Payment'               => 'Paiement',
        'Place order'           => 'Payer',
        'Proceed to checkout'   => 'Passer au paiement',
        'Proceed to Checkout'   => 'Passer au paiement',
        'Update cart'           => 'Mettre à jour',
        'Apply coupon'          => 'Appliquer',
        'Coupon code'           => 'Code promo',
        'Add coupons'           => 'Code promo',
        'Subtotal'              => 'Sous-total',
        'Estimated total'       => 'Total estimé',
        'Total'                 => 'Total',
        'Product'               => 'Produit',
        'Price'                 => 'Prix',
        'Quantity'              => 'Quantité',
        'Remove this item'      => 'Retirer',
        'Remove item'           => 'Retirer',
        'First name'            => 'Prénom',
        'Last name'             => 'Nom',
        'Email address'         => 'Email',
        'Phone'                 => 'Téléphone',
        'Country / Region'      => 'Pays',
        'Street address'        => 'Adresse',
        'Town / City'           => 'Ville',
        'Postcode / ZIP'        => 'Code postal',
        'Order notes'           => 'Notes',
        'Or continue below'     => 'Ou continuer ci-dessous',
        'Express Checkout'      => 'Paiement rapide',
        'OR'                    => 'OU',
        'CART TOTALS'           => 'RÉCAPITULATIF',
        // Thank you / Order received
        'Thank you. Your order has been received.' => 'Merci ! Votre commande a bien été reçue.',
        'Order number:'         => 'N° de commande :',
        'Date:'                 => 'Date :',
        'Email:'                => 'Email :',
        'Total:'                => 'Total :',
        'Payment method:'       => 'Moyen de paiement :',
        'Order details'         => 'Détails de la commande',
        'Produit'               => 'Produit',
        'Credit / Debit Card'   => 'Carte bancaire',
        'Credit card / debit card' => 'Carte bancaire',
        'Note:'                 => 'Note :',
        'Subtotal:'             => 'Sous-total :',
    );

    return isset( $t[ $text ] ) ? $t[ $text ] : $translated;
}

/* =============================================
   VALIDITÉ PRODUIT DANS LE PANIER
   ============================================= */

add_filter( 'woocommerce_cart_item_name', 'mp_add_validity_to_cart_item', 10, 3 );
function mp_add_validity_to_cart_item( $product_name, $cart_item, $cart_item_key ) {
    $product_id = $cart_item['product_id'];
    if ( 'yes' !== get_post_meta( $product_id, '_mpgc_is_gift_card', true ) ) return $product_name;

    $sessions = (int) get_post_meta( $product_id, '_mpgc_sessions', true );
    $validity = array( 1 => '3 mois', 5 => '4 mois', 10 => '6 mois' );
    $v = isset( $validity[ $sessions ] ) ? $validity[ $sessions ] : '6 mois';

    return $product_name . '<span class="mp-cart-validity">Valable ' . $v . ' après activation</span>';
}

/* =============================================
   CHECKOUT WIZARD - Step indicators
   ============================================= */

add_action( 'woocommerce_before_checkout_form', 'mp_checkout_step_indicators', 6 );
function mp_checkout_step_indicators() {
    ?>
    <div class="mp-checkout-steps">
        <div class="mp-checkout-step-indicator is-active" data-step="1">
            <div class="mp-step-dot"><span class="mp-step-number">1</span></div>
            <span class="mp-step-label">Le cadeau</span>
        </div>
        <div class="mp-checkout-step-indicator" data-step="2">
            <div class="mp-step-dot"><span class="mp-step-number">2</span></div>
            <span class="mp-step-label">Bénéficiaire</span>
        </div>
        <div class="mp-checkout-step-indicator" data-step="3">
            <div class="mp-step-dot"><span class="mp-step-number">3</span></div>
            <span class="mp-step-label">Coordonnées</span>
        </div>
        <div class="mp-checkout-step-indicator" data-step="4">
            <div class="mp-step-dot"><span class="mp-step-number">4</span></div>
            <span class="mp-step-label">Paiement</span>
        </div>
    </div>
    <?php
}

/* =============================================
   CHECKOUT WIZARD - Enqueue JS
   ============================================= */

/* =============================================
   RGPD — Case à cocher au checkout
   ============================================= */

add_action( 'woocommerce_review_order_before_submit', 'mp_rgpd_checkout_consent' );
function mp_rgpd_checkout_consent() {
    ?>
    <div class="mp-checkout-rgpd">
        <p class="mp-rgpd-notice">
            Vos données sont utilisées pour traiter votre commande, générer votre carte cadeau et vous envoyer la confirmation par email.
            Le paiement est sécurisé par Stripe. Consultez notre <a href="<?php echo esc_url( home_url( '/politique-de-confidentialite/' ) ); ?>" target="_blank">politique de confidentialité</a>.
        </p>
        <label class="mp-rgpd-checkbox">
            <input type="checkbox" name="rgpd_checkout_consent" id="rgpd_checkout_consent" required>
            <span>J'ai lu et j'accepte la <a href="<?php echo esc_url( home_url( '/politique-de-confidentialite/' ) ); ?>" target="_blank">politique de confidentialité</a> et les conditions de vente.</span>
        </label>
    </div>
    <?php
}

add_action( 'woocommerce_checkout_process', 'mp_rgpd_checkout_validation' );
function mp_rgpd_checkout_validation() {
    if ( ! isset( $_POST['rgpd_checkout_consent'] ) ) {
        wc_add_notice( 'Veuillez accepter la politique de confidentialité pour poursuivre votre commande.', 'error' );
    }
}

add_action( 'wp_enqueue_scripts', 'mp_enqueue_checkout_wizard' );
function mp_enqueue_checkout_wizard() {
    if ( ! function_exists( 'is_checkout' ) || ! is_checkout() || is_order_received_page() ) {
        return;
    }

    wp_enqueue_script(
        'mp-checkout-wizard',
        get_template_directory_uri() . '/js/mp-checkout-wizard.js',
        array( 'jquery' ),
        '1.0.1',
        true
    );
}






// === SECURITY HARDENING v2 ===

// Masquer la version WordPress partout
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

// Masquer la version WooCommerce
add_filter('woocommerce_hide_invisible_variations', '__return_true');
remove_action('wp_head', array($GLOBALS['woocommerce'] ?? new stdClass(), 'generator'));
add_filter('style_loader_src', 'mp_remove_version_query', 9999);
add_filter('script_loader_src', 'mp_remove_version_query', 9999);
function mp_remove_version_query($src) {
    if (strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}

// Bloquer les pages auteur (enumeration login)
add_action('template_redirect', function() {
    if (is_author()) {
        wp_redirect(home_url('/'), 301);
        exit;
    }
});

// Restreindre la REST API aux utilisateurs connectes (sauf oembed et contact form)
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) return $result;
    if (!is_user_logged_in()) {
        $route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';
        // Autoriser : oembed, contact-form-7, wpforms, wc/store (panier public),
        // monpilates (plugins maison), llar (Limit Login Attempts MFA — sans
        // ça la double-auth email du panel admin reste bloquée en 401),
        // really-simple-security (RSSSL 2FA si jamais on l'active un jour).
        $allowed = array(
            '/oembed/',
            '/contact-form-7/',
            '/wpforms/',
            '/wc/store',
            '/monpilates/',
            '/llar/',
            '/really-simple-security/',
        );
        foreach ($allowed as $prefix) {
            if (strpos($route, $prefix) !== false) return $result;
        }
        return new WP_Error('rest_not_logged_in', 'REST API restricted.', array('status' => 401));
    }
    return $result;
});
// Headers de securite HTTP
add_action('send_headers', function() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
});

// Supprimer le generator WooCommerce
add_action('init', function() {
    if (class_exists('WooCommerce')) {
        remove_action('wp_head', 'wc_generator_tag');
    }
});