<?php
/**
 * @package Yogic Pro
 * Setup the WordPress core custom functions feature.
 *
*/

add_action('yogic_pro_optionsframework_custom_scripts', 'yogic_pro_optionsframework_custom_scripts');
function yogic_pro_optionsframework_custom_scripts() { ?>
	<script type="text/javascript">
    jQuery(document).ready(function() {
    
        jQuery('#example_showhidden').click(function() {
            jQuery('#section-example_text_hidden').fadeToggle(400);
        });
        
        if (jQuery('#example_showhidden:checked').val() !== undefined) {
            jQuery('#section-example_text_hidden').show();
        }
        
    });
    </script><?php
}

// get_the_content format text
function get_the_content_format( $str ){
	$raw_content = apply_filters( 'the_content', $str );
	$content = str_replace( ']]>', ']]&gt;', $raw_content );
	return $content;
}
// the_content format text
function the_content_format( $str ){
	echo get_the_content_format( $str );
}

function is_google_font( $font ){
	$notGoogleFont = array( 'Arial', 'Comic Sans MS', 'FreeSans', 'Georgia', 'Lucida Sans Unicode', 'Palatino Linotype', 'Symbol', 'Tahoma', 'Trebuchet MS', 'Verdana' );
	if( in_array($font, $notGoogleFont) ){
		return false;
	}else{
		return true;
	}
}

// subhead section function
function sub_head_section( $more ) {
	$pgs = 0;
	do {
		$pgs++;
	} while ($more > $pgs);
	return $pgs;
}

//[clear]
function clear_func() {
	$clr = '<div class="clear"></div>';
	return $clr;
}
add_shortcode( 'clear', 'clear_func' );


//[column_content]Your content here...[/column_content]
function column_content_func( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'type' => '',	
	), $atts ) );
	$colPos = strpos($type, '_last');
	if($colPos === false){
		$cnt = '<div class="'.$type.'">'.do_shortcode($content).'</div>';
	}else{
		$type = substr($type,0,$colPos);
		$cnt = '<div class="'.$type.' last_column">'.do_shortcode($content).'</div>';
	}
	return $cnt;
}
add_shortcode( 'column_content', 'column_content_func' );


//[hr]
function hrule_func() {
	$hrule = '<div class="hr"></div>';
	return $hrule;
}
add_shortcode( 'hr', 'hrule_func' );

//[hr_top]
function back_to_top_func() {
	$back_top = '<div id="back-top">
		<a title="Top of Page" href="#top"><span></span></a>
	</div>';
	return $back_top;
}
add_shortcode( 'back-to-top', 'back_to_top_func' );


// [searchform]
function searchform_shortcode_func( $atts ){
	return get_search_form( false );
}
add_shortcode( 'searchform', 'searchform_shortcode_func' );

// accordion
function accordion_func( $atts, $content = null ) {
	$acc = '<div style="margin-top:10px;">'.get_the_content_format( do_shortcode($content) ).'<div class="clear"></div></div>';
	return $acc;
}
add_shortcode( 'accordion', 'accordion_func' );
function accordion_content_func( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => 'Accordion Title',
	), $atts ) );
	$content = wpautop(trim($content));
	$acn = '<div class="accordion-box"><h2>'.$title.'</h2>
			<div class="acc-content">'.$content.'</div><div class="clear"></div></div>';
	return $acn;
}
add_shortcode( 'accordion_content', 'accordion_content_func' );


// remove excerpt more
function new_excerpt_more( $more ) {
	return '... ';
}
add_filter('excerpt_more', 'new_excerpt_more');

// get post categories function
function getPostCategories(){
	$categories = get_the_category();
	$catOut = '';
	$separator = ', ';
	$catOutput = '';
	if($categories){
		foreach($categories as $category) {
			$catOutput .= '<a href="'.get_category_link( $category->term_id ).'" title="' . esc_attr( sprintf( __( "View all posts in %s", 'yogic-pro' ), $category->name ) ) . '">'.$category->cat_name.'</a>'.$separator;
		}
		$catOut = ''.trim($catOutput, $separator);
	}
	return $catOut;
}

// replace last occurance of a string.
function str_lreplace($search, $replace, $subject){
	$pos = strrpos($subject, $search);
	if($pos !== false){
		$subject = substr_replace($subject, $replace, $pos, strlen($search));
	}
	return $subject;
}

// custom post type for Testimonials
function my_custom_post_testimonials() {
	$labels = array(
		'name'               => __( 'Testimonial','yogic-pro'),
		'singular_name'      => __( 'Testimonial','yogic-pro'),
		'add_new'            => __( 'Add Testimonial','yogic-pro'),
		'add_new_item'       => __( 'Add New Testimonial','yogic-pro'),
		'edit_item'          => __( 'Edit Testimonial','yogic-pro'),
		'new_item'           => __( 'New Testimonial','yogic-pro'),
		'all_items'          => __( 'All Testimonials','yogic-pro'),
		'view_item'          => __( 'View Testimonial','yogic-pro'),
		'search_items'       => __( 'Search Testimonials','yogic-pro'),
		'not_found'          => __( 'No testimonials found','yogic-pro'),
		'not_found_in_trash' => __( 'No testimonials found in the Trash','yogic-pro'), 
		'parent_item_colon'  => '',
		'menu_name'          => 'Testimonials'
	);
	$args = array(
		'labels'        => $labels,
		'description'   => 'Manage Testimonials',
		'public'        => true,
		'menu_icon'		=> 'dashicons-format-quote',
		'menu_position' => null,
		'supports'      => array( 'title', 'editor', 'thumbnail'),
		'has_archive'   => true,
	);
	register_post_type( 'testimonials', $args );	
}
add_action( 'init', 'my_custom_post_testimonials' );

// add meta box to testimonials
add_action( 'admin_init', 'my_testimonials_admin_function' );
function my_testimonials_admin_function() {
    add_meta_box( 'testimonials_meta_box',
        'Testimonials Info',
        'display_testimonials_meta_box',
        'testimonials', 'normal', 'high'
    );
}
// add meta box form to testimonials
function display_testimonials_meta_box( $testimonials ) {
    // Retrieve current name of the Director and Movie Rating based on review ID
    $designation = esc_html( get_post_meta( $testimonials->ID, 'designation', true ) );   
    ?>
    <table width="100%">
        <tr>
            <td width="20%">client info (designation) </td>
            <td width="80%"><input type="text" name="designation" value="<?php echo $designation; ?>" /></td>
        </tr>      
    </table>
    <?php      
}
// save testimonials meta box form data
add_action( 'save_post', 'add_testimonials_fields_function', 10, 2 );
function add_testimonials_fields_function( $testimonials_id, $testimonials ) {
    // Check post type for testimonials
    if ( $testimonials->post_type == 'testimonials' ) {
        // Store data in post meta table if present in post data
        if ( isset($_POST['designation']) ) {
            update_post_meta( $testimonials_id, 'designation', sanitize_text_field( $_POST['designation'] ) );
        }        
    }
}


//Testimonials function
function testimonials_output_func( $atts ){
	extract( shortcode_atts( array( 
	'show' => '',
	),
	$atts ) ); 		
	wp_reset_query();
 	query_posts('post_type=testimonials&posts_per_page='.$show);
	if ( have_posts() ) :
	 $testimonialoutput = '<div id="clienttestiminials"><div class="owl-carousel">';	
		while ( have_posts() ) : the_post();
		if ( has_post_thumbnail()) {
				$large_imgSrc = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large');
				$imgUrl = $large_imgSrc[0];
		}else{
				$imgUrl = get_template_directory_uri().'/images/img_404.png';
				$imgUrl = 'https://mon-pilates.bzh/wp-content/uploads/2024/08/atelier_spe.webp';
		}	
		$designation = esc_html( get_post_meta( get_the_ID(), 'designation', true ) );		   
			$testimonialoutput .= '
				 <div class="item">
				 <div class="arrow_box">
				     <div class="tmthumb"><img src="'.$imgUrl.'" alt=" " /></div>	
					<p>'.wp_trim_words( get_the_content(), of_get_option('testimonialsexcerptlength'), '' ).'</p>				
					<div class="clear"></div>
									
					<div class="leftttl">
					 <h6>'.get_the_title().'<span>- '.$designation.'</span></h6>						 
					 </div>
					 
					 </div>
					 
				</div>';
		endwhile;
		 $testimonialoutput .= '</div></div>';
	else:
	  $testimonialoutput = 'client testimonials is empty';			
	  endif;  
	wp_reset_query();	
	return $testimonialoutput;
}
add_shortcode( 'testimonials', 'testimonials_output_func' );



//Testimonials function
function testimonials_listing_output_func( $atts ){
	extract( shortcode_atts( array( 
	'show' => '',
	),
	$atts ) ); 		
	wp_reset_query();
 	query_posts('post_type=testimonials&posts_per_page='.$show);
	if ( have_posts() ) :
	 $testimonialoutput = '<div id="Tmnllist">';	
		while ( have_posts() ) : the_post();
		if ( has_post_thumbnail()) {
				$large_imgSrc = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full');
				$imgUrl = $large_imgSrc[0];
			}else{
				$imgUrl = get_template_directory_uri().'/images/img_404.png';
			}	
		$designation = esc_html( get_post_meta( get_the_ID(), 'designation', true ) );		   
			$testimonialoutput .= '
			    <div class="tmnllisting">
			 	<div class="tmnlthumb"><a href="'.get_permalink().'"><img src="'.$imgUrl.'" alt=" " /></a></div>
				 <h6><a href="'.get_permalink().'">'.get_the_title().'</a></h6>	
				 <span>'.$designation.'</span>
				 <p>'.wp_trim_words( get_the_content(), of_get_option('testimonialsexcerptlength'), '' ).'</p>				
				</div>	';
		endwhile;
		 $testimonialoutput .= '</div>';
	else:
	  $testimonialoutput = '<div id="Tmnllist"> 
           
              <div class="tmnllisting">
                <div class="tmnlthumb"><a href="#"><img src="'.get_template_directory_uri()."/images/team1.jpg".'" alt="" /></a></div>
                   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>
				   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
               </div>
			  
                <div class="tmnllisting">
                <div class="tmnlthumb"><a href="#"><img src="'.get_template_directory_uri()."/images/team2.jpg".'" alt="" /></a></div>
                   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>
				   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
               </div>
			  
			     <div class="tmnllisting">
                <div class="tmnlthumb"><a href="#"><img src="'.get_template_directory_uri()."/images/team3.jpg".'" alt="" /></a></div>
                   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>
				   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
               </div>
			  
			    <div class="tmnllisting">
                <div class="tmnlthumb"><a href="#"><img src="'.get_template_directory_uri()."/images/team4.jpg".'" alt="" /></a></div>
                   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>
				   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
               </div>
			               
           
  </div>';			
	  endif;  
	wp_reset_query();	
	return $testimonialoutput;
}
add_shortcode( 'testimonials-listing', 'testimonials_listing_output_func' );


//Testimonials function
function testimonials_rotator_output_func( $atts ){
	extract( shortcode_atts( array( 
	'show' => '',
	),
	$atts ) ); 		
	wp_reset_query();
 	query_posts('post_type=testimonials&posts_per_page='.$show);
	if ( have_posts() ) :
	 $testimonialoutput = '<div id="testimonials"><div class="quotes">';	
		while ( have_posts() ) : the_post();	
		$designation = esc_html( get_post_meta( get_the_ID(), 'designation', true ) );		   
			$testimonialoutput .= '
			  <div> '.content( of_get_option('testimonialsexcerptlength') ).'
				  <h6><a href="'.get_permalink().'">'.get_the_title().'</a></h6>
				  <span>'.$designation.'</span>					
              </div>
			';
		endwhile;
		 $testimonialoutput .= '</div></div>';
	else:
	  $testimonialoutput = '<div id="testimonials"><div class="quotes">
           
               <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
				   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>				  
               </div>
			  
                 <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet magna diam, id ullamcorper lacus suscipit vehicula. In porta vehicula lacus, ac viverra ipsum volutpat quis. Aenean dapibus, nisl in efficitur iaculis.</p>
				   <h6><a href="#">Brandon Doe</a></h6>
				   <span>Ceo & Founder</span>				  
               </div>
           
  </div></div>';			
	  endif;  
	wp_reset_query();	
	return $testimonialoutput;
}
add_shortcode( 'sidebar-testimonials', 'testimonials_rotator_output_func' );


//custom post type for Our Team
function my_custom_post_team() {
	$labels = array(
		'name'               => __( 'Our Team', 'yogic-pro' ),
		'singular_name'      => __( 'Our Team', 'yogic-pro' ),
		'add_new'            => __( 'Add New', 'yogic-pro' ),
		'add_new_item'       => __( 'Add New Team Member', 'yogic-pro' ),
		'edit_item'          => __( 'Edit Team Member', 'yogic-pro' ),
		'new_item'           => __( 'New Member', 'yogic-pro' ),
		'all_items'          => __( 'All Members', 'yogic-pro' ),
		'view_item'          => __( 'View Members', 'yogic-pro' ),
		'search_items'       => __( 'Search Team Members', 'yogic-pro' ),
		'not_found'          => __( 'No Team members found', 'yogic-pro' ),
		'not_found_in_trash' => __( 'No Team members found in the Trash', 'yogic-pro' ), 
		'parent_item_colon'  => '',
		'menu_name'          => 'Our Team'
	);
	$args = array(
		'labels'        => $labels,
		'description'   => 'Manage Team',
		'public'        => true,
		'menu_position' => null,
		'menu_icon'		=> 'dashicons-groups',
		'supports'      => array( 'title', 'editor', 'thumbnail' ),
		'rewrite' => array('slug' => 'our-team'),
		'has_archive'   => true,
	);
	register_post_type( 'team', $args );
}
add_action( 'init', 'my_custom_post_team' );

// add meta box to team
add_action( 'admin_init', 'my_team_admin_function' );
function my_team_admin_function() {
    add_meta_box( 'team_meta_box',
        'Member Info',
        'display_team_meta_box',
        'team', 'normal', 'high'
    );
}
// add meta box form to team
function display_team_meta_box( $team ) {
    // Retrieve current name of the Director and Movie Rating based on review ID
    $designation = esc_html( get_post_meta( $team->ID, 'designation', true ) );
    $facebook = get_post_meta( $team->ID, 'facebook', true );
	$facebooklink = esc_url( get_post_meta( $team->ID, 'facebooklink', true ) );
    $twitter = get_post_meta( $team->ID, 'twitter', true );
	$twitterlink = esc_url( get_post_meta( $team->ID, 'twitterlink', true ) );
    $linkedin = get_post_meta( $team->ID, 'linkedin', true );
	$linkedinlink = esc_url( get_post_meta( $team->ID, 'linkedinlink', true ) );
	$pint = get_post_meta( $team->ID, 'google', true );
	$googlelink = esc_url( get_post_meta( $team->ID, 'googlelink', true ) );
    $dribbble = get_post_meta( $team->ID, 'dribbble', true );
	$dribbblelink = get_post_meta( $team->ID, 'dribbblelink', true );
    ?>
    <table width="100%">
        <tr>
            <td width="20%">Designation </td>
            <td width="80%"><input type="text" name="designation" value="<?php echo $designation; ?>" /></td>
        </tr>
        <tr>
            <td width="20%">Social link 1</td>
            <td width="40%"><input type="text" name="facebook" value="<?php echo $facebook; ?>" /></td>
            <td width="40%"><input style="width:500px;" type="text" name="facebooklink" value="<?php echo $facebooklink; ?>" /></td>
        </tr>
        <tr>
            <td width="20%">Social Link 2</td>
            <td width="40%"><input type="text" name="twitter" value="<?php echo $twitter; ?>" /></td>
            <td width="40%"><input style="width:500px;" type="text" name="twitterlink" value="<?php echo $twitterlink; ?>" /></td>
        </tr>
        <tr>
            <td width="20%">Social Link 3</td>
            <td width="40%"><input type="text" name="linkedin" value="<?php echo $linkedin; ?>" /></td>
            <td width="40%"><input style="width:500px;" type="text" name="linkedinlink" value="<?php echo $linkedinlink; ?>" /></td>
        </tr>
        <tr>
            <td width="20%">Social Link 4</td>
            <td width="40%"><input type="text" name="dribbble" value="<?php echo $dribbble; ?>" /></td>
            <td width="40%"><input style="width:500px;" type="text" name="dribbblelink" value="<?php echo $dribbblelink; ?>" /></td>
        </tr>
        <tr>
            <td width="20%">Social Link 5</td>
            <td width="40%"><input type="text" name="google" value="<?php echo $pint; ?>" /></td>
            <td width="40%"><input style="width:500px;" type="text" name="googlelink" value="<?php echo $googlelink; ?>" /></td>
        </tr>
        <tr>
        	<td width="100%" colspan="3"><label style="font-size:12px;"><strong>Note:</strong> Icon name should be in lowercase without space. More social icons can be found at: <a href="https://fontawesome.com/icons" target="_blank">https://fontawesome.com/icons</a></label> </td>
        </tr>
    </table>
    <?php                     
}
// save team meta box form data
add_action( 'save_post', 'add_team_fields_function', 10, 2 );
function add_team_fields_function( $team_id, $team ) {
    // Check post type for testimonials
    if ( $team->post_type == 'team' ) {
        // Store data in post meta table if present in post data
        if ( isset($_POST['designation']) ) {
            update_post_meta( $team_id, 'designation', $_POST['designation'] );
        }
        if ( isset($_POST['facebook']) ) {
            update_post_meta( $team_id, 'facebook', $_POST['facebook'] );
        }
		if ( isset($_POST['facebooklink']) ) {
            update_post_meta( $team_id, 'facebooklink', $_POST['facebooklink'] );
        }
        if ( isset($_POST['twitter']) ) {
            update_post_meta( $team_id, 'twitter', $_POST['twitter'] );
        }
		if ( isset($_POST['twitterlink']) ) {
            update_post_meta( $team_id, 'twitterlink', $_POST['twitterlink'] );
        }
        if ( isset($_POST['linkedin']) ) {
            update_post_meta( $team_id, 'linkedin', $_POST['linkedin'] );
        }
		if ( isset($_POST['linkedinlink']) ) {
            update_post_meta( $team_id, 'linkedinlink', $_POST['linkedinlink'] );
        }
        if ( isset($_POST['dribbble']) ) {
            update_post_meta( $team_id, 'dribbble', $_POST['dribbble'] );
        }
		if ( isset($_POST['dribbblelink']) ) {
            update_post_meta( $team_id, 'dribbblelink', $_POST['dribbblelink'] );
        }
		if ( isset($_POST['google']) ) {
            update_post_meta( $team_id, 'google', $_POST['google'] );
        }
		if ( isset($_POST['googlelink']) ) {
            update_post_meta( $team_id, 'googlelink', $_POST['googlelink'] );
        }
    }
}

function our_teamposts_func( $atts ) {
   extract( shortcode_atts( array(
		'show' => '',
	), $atts ) );
	  extract( shortcode_atts( array( 'show' => '',), $atts ) ); 
	$bposts = '<div id="team_members">';
	$args = array( 'post_type' => 'team', 'posts_per_page' => $show, 'post__not_in' => get_option('sticky_posts'), 'orderby' => 'date', 'order' => 'desc' );
	query_posts( $args );
	$posts = query_posts( $args );
	$count = count($posts);	
	$n = 0;
	if ( have_posts() ) {
		while ( have_posts() ) { 
			the_post();
			$n++; if( $n%2 == 0 ) $nomargn = ' lastcols'; else $nomargn = '';
			$designation = esc_html( get_post_meta( get_the_ID(), 'designation', true ) );
			$facebook = get_post_meta( get_the_ID(), 'facebook', true );
			$facebooklink = get_post_meta( get_the_ID(), 'facebooklink', true );
			$twitter = get_post_meta( get_the_ID(), 'twitter', true );
			$twitterlink = get_post_meta( get_the_ID(), 'twitterlink', true );
			$linkedin = get_post_meta( get_the_ID(), 'linkedin', true );
			$linkedinlink = get_post_meta( get_the_ID(), 'linkedinlink', true );
			$dribbble = get_post_meta( get_the_ID(), 'dribbble', true );
			$dribbblelink = get_post_meta( get_the_ID(), 'dribbblelink', true );
			$pint = get_post_meta( get_the_ID(), 'google', true );
			$googlelink = get_post_meta( get_the_ID(), 'googlelink', true );				
			
			$bposts .= '<div class="teammember-list'.$nomargn.'">';	
			$bposts .= '<div class="thumnailbx"><a class="hvr-grow" href="'.get_the_permalink().'">'. get_the_post_thumbnail().'</a>';
			$bposts .= '</div>';
			
			$bposts .= '<div class="titledesbox">
				            <span class="title">'.get_the_title().'</span>
							<cite>'.$designation.'</cite>							
							</div>';
			$bposts .= '<div class="member-social-icon">';
								if( $facebook != '' ){
									$bposts .= '<a href="'.$facebooklink.'" target="_blank"><i class="'.$facebook.' fa-lg"></i></a>';
								}
								if( $twitter != '' ){
									$bposts .= '<a href="'.$twitterlink.'" target="_blank"><i class="'.$twitter.' fa-lg"></i></a>';
								}
								if( $linkedin != '' ){
									$bposts .= '<a href="'.$linkedinlink.'" target="_blank"><i class="'.$linkedin.' fa-lg"></i></a>';
								}
								if( $dribbble != '' ){
									$bposts .= '<a href="'.$dribbblelink.'" target="_blank"><i class="'.$dribbble.' fa-lg"></i></a>';
								}
								if( $pint != '' ){
									$bposts .= '<a href="'.$googlelink.'" target="_blank"><i class="'.$pint.' fa-lg"></i></a><div class="clear"></div>';
								}
			$bposts .= '</div>';
			$bposts .= '</div>';
		}
	}else{
		$bposts .= 'There are not found our team members';
	}
	wp_reset_query();
	$bposts .= '</div><div class="clear"></div>';
    return $bposts;
}
add_shortcode( 'our-team', 'our_teamposts_func' );


function our_teamposts_four_column_func( $atts ) {
   extract( shortcode_atts( array(
		'show' => '',
	), $atts ) );
	  extract( shortcode_atts( array( 'show' => '',), $atts ) ); 
	$bposts = '<div id="team_members">';
	$args = array( 'post_type' => 'team', 'posts_per_page' => $show, 'post__not_in' => get_option('sticky_posts'), 'orderby' => 'date', 'order' => 'desc' );
	query_posts( $args );
	$posts = query_posts( $args );
	$count = count($posts);	
	$n = 0;
	if ( have_posts() ) {
		while ( have_posts() ) { 
			the_post();
			$n++; if( $n%4 == 0 ) $nomargn = ' lastcols'; else $nomargn = '';
			$designation = esc_html( get_post_meta( get_the_ID(), 'designation', true ) );
			$facebook = get_post_meta( get_the_ID(), 'facebook', true );
			$facebooklink = get_post_meta( get_the_ID(), 'facebooklink', true );
			$twitter = get_post_meta( get_the_ID(), 'twitter', true );
			$twitterlink = get_post_meta( get_the_ID(), 'twitterlink', true );
			$linkedin = get_post_meta( get_the_ID(), 'linkedin', true );
			$linkedinlink = get_post_meta( get_the_ID(), 'linkedinlink', true );
			$dribbble = get_post_meta( get_the_ID(), 'dribbble', true );
			$dribbblelink = get_post_meta( get_the_ID(), 'dribbblelink', true );
			$pint = get_post_meta( get_the_ID(), 'google', true );
			$googlelink = get_post_meta( get_the_ID(), 'googlelink', true );				
			
			$bposts .= '<div class="teammember-list'.$nomargn.'">';	
			$bposts .= '<div class="thumnailbx"><a class="hvr-grow" href="'.get_the_permalink().'">'. get_the_post_thumbnail().'</a>';
			$bposts .= '</div>';
			
			$bposts .= '<div class="titledesbox">
				            <span class="title"><a href="'.get_the_permalink().'">'.get_the_title().'</a></span>
							<cite>'.$designation.'</cite>							
							</div>';
			$bposts .= '<div class="member-social-icon">';
								if( $facebook != '' ){
									$bposts .= '<a href="'.$facebooklink.'" title="'.$facebook.'" target="_blank"><i class="'.$facebook.' fa-lg"></i></a>';
								}
								if( $twitter != '' ){
									$bposts .= '<a href="'.$twitterlink.'" title="'.$twitter.'" target="_blank"><i class="'.$twitter.' fa-lg"></i></a>';
								}
								if( $linkedin != '' ){
									$bposts .= '<a href="'.$linkedinlink.'" title="'.$linkedin.'" target="_blank"><i class="'.$linkedin.' fa-lg"></i></a>';
								}
								if( $dribbble != '' ){
									$bposts .= '<a href="'.$dribbblelink.'" title="'.$dribbble.'" target="_blank"><i class="'.$dribbble.' fa-lg"></i></a>';
								}
								if( $pint != '' ){
									$bposts .= '<a href="'.$googlelink.'" title="'.$pint.'" target="_blank"><i class="'.$pint.' fa-lg"></i></a><div class="clear"></div>';
								}
			$bposts .= '</div>';
			$bposts .= '</div>';
		}
	}else{
		$bposts .= '';
	}
	wp_reset_query();
	$bposts .= '</div><div class="clear"></div>';
    return $bposts;
}
add_shortcode( 'our-team', 'our_teamposts_four_column_func' );


// Social Icon Shortcodes 
function yogic_pro_social_area($atts,$content = null){
  return '<div class="social-icons">'.do_shortcode($content).'</div>';
 }
add_shortcode('social_area','yogic_pro_social_area');

function yogic_pro_social($atts){
 extract(shortcode_atts(array(
  'icon' => '',
  'link' => ''
 ),$atts));
  return '<a href="'.$link.'" target="_blank" class="'.$icon.'"></a>';
 }
add_shortcode('social','yogic_pro_social');


function contactform_func( $atts ) {
    $atts = shortcode_atts( array(
        'to_email' => get_bloginfo('admin_email'),
		'title' => 'Contact enquiry - '.home_url( '/' ),
    ), $atts );

	$cform = "<div class=\"main-form-area\" id=\"contactform_main\">";

	$cerr = array();
	if( isset($_POST['c_submit']) && $_POST['c_submit']=='Submit' ){
		$name 			= trim( $_POST['c_name'] );
		$email 			= trim( $_POST['c_email'] );	
		$comments 		= trim( $_POST['c_comments'] );
		$captcha 		= trim( $_POST['c_captcha'] );
		$captcha_cnf	= trim( $_POST['c_captcha_confirm'] );

		if( !$name )
			$cerr['name'] = 'Please enter your name.';
		if( ! filter_var($email, FILTER_VALIDATE_EMAIL) ) 
			$cerr['email'] = 'Please enter a valid email.';		
		if( !$comments )
			$cerr['comments'] = 'Please enter your message.';
		if( !$captcha || (md5($captcha) != $captcha_cnf) )
			$cerr['captcha'] = 'Please enter the correct answer.';

		if( count($cerr) == 0 ){
			$subject = $atts['title'];
			$headers = "From: ".$name." <" . strip_tags($email) . ">\r\n";
			$headers .= "MIME-Version: 1.0\r\n";
			$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

			$message = '<html><body>
							<table>
								<tr><td>Name: </td><td>'.$name.'</td></tr>
								<tr><td>Email: </td><td>'.$email.'</td></tr>													
								<tr><td>Message: </td><td>'.$comments.'</td></tr>
							</table>
						</body>
					</html>';
			mail( $atts['to_email'], $subject, $message, $headers);
			$cform .= '<div class="success_msg">Thank you! A representative will get back to you very shortly.</div>';
			unset( $name, $email, $comments, $captcha );
		}else{
			$cform .= '<div class="error_msg">';
			$cform .= implode('<br />',$cerr);
			$cform .= '</div>';
		}
	}

	$capNum1 	= rand(1,4);
	$capNum2 	= rand(1,5);
	$capSum		= $capNum1 + $capNum2;
	$sumStr		= $capNum1." + ".$capNum2 ." = ";

	$cform .= "<form name=\"contactform\" action=\"#contactform_main\" method=\"post\">
			<p><input type=\"text\" name=\"c_name\" value=\"". ( ( empty($name) == false ) ? $name : "" ) ."\" placeholder=\"Name\" /></p>
			<p><input type=\"email\" name=\"c_email\" value=\"". ( ( empty($email) == false ) ? $email : "" ) ."\" placeholder=\"Email\" /></p>			
			<p><textarea name=\"c_comments\" placeholder=\"Message\">". ( ( empty($comments) == false ) ? $comments : "" ) ."</textarea></p>";
	$cform .= "<p><span class=\"capcode\">$sumStr</span><input type=\"text\" placeholder=\"Captcha\" value=\"". ( ( empty($captcha) == false ) ? $captcha : "" ) ."\" name=\"c_captcha\" /><input type=\"hidden\" name=\"c_captcha_confirm\" value=\"". md5($capSum)."\"></p>";
	$cform .= "<p class=\"sub\"><input type=\"submit\" name=\"c_submit\" value=\"Submit\" class=\"search-submit\" /></p>
		</form>
	</div>";

    return $cform;
}
add_shortcode( 'contactform', 'contactform_func' );


//custom post type for Our photogallery
function my_custom_post_photogallery() {
	$labels = array(
		'name'               => __( 'Photo Gallery','yogic-pro' ),
		'singular_name'      => __( 'Photo Gallery','yogic-pro' ),
		'add_new'            => __( 'Add New','yogic-pro' ),
		'add_new_item'       => __( 'Add New Image ','yogic-pro' ),
		'edit_item'          => __( 'Edit Image','yogic-pro' ),
		'new_item'           => __( 'New Image','yogic-pro' ),
		'all_items'          => __( 'All Images','yogic-pro' ),
		'view_item'          => __( 'View Image','yogic-pro' ),
		'search_items'       => __( 'Search Images','yogic-pro' ),
		'not_found'          => __( 'No images found','yogic-pro' ),
		'not_found_in_trash' => __( 'No images found in the Trash','yogic-pro' ), 
		'parent_item_colon'  => '',
		'menu_name'          => 'Photo Gallery'
	);
	$args = array(
		'labels'        => $labels,
		'description'   => 'Manage Photo Gallery',
		'public'        => true,
		'menu_position' => 23,
		'supports'      => array( 'title', 'thumbnail' ),
		'has_archive'   => true,
	);
	register_post_type( 'photogallery', $args );
}
add_action( 'init', 'my_custom_post_photogallery' );


//  register gallery taxonomy
register_taxonomy( "gallerycategory", 
	array("photogallery"), 
	array(
		"hierarchical" => true, 
		"label" => "Gallery Category", 
		"singular_label" => "Photo Gallery", 
		"rewrite" => true
	)
);

add_action("manage_posts_custom_column",  "photogallery_custom_columns");
add_filter("manage_edit-photogallery_columns", "photogallery_edit_columns");
function photogallery_edit_columns($columns){
	$columns = array(
		"cb" => '<input type="checkbox" />',
		"title" => "Gallery Title",
		"pcategory" => "Gallery Category",
		"view" => "Image",
		"date" => "Date",
	);
	return $columns;
}
function photogallery_custom_columns($column){
	global $post;
	switch ($column) {
		case "pcategory":
			echo get_the_term_list($post->ID, 'gallerycategory', '', ', ','');
		break;
		case "view":
			the_post_thumbnail('thumbnail');
		break;
		case "date":

		break;
	}
}


//[photogallery filter="false"]
function photogallery_shortcode_func( $atts ) {
	extract( shortcode_atts( array(
		'show' => -1,
		'filter' => 'true'
	), $atts ) );
	$pfStr = '';

	$pfStr .= '<div class="photobooth">';
	if( $filter == 'true' ){
		$pfStr .= '<ul class="portfoliofilter clearfix"><li><a class="selected" data-filter="*" href="#">'.of_get_option('galleryshowallbtn').'</a><span></span></li>';
		$categories = get_categories( array('taxonomy' => 'gallerycategory') );
		foreach ($categories as $category) {
			$pfStr .= '<li><a data-filter=".'.$category->slug.'" href="#">'.$category->name.'</a></li>';
		}
		$pfStr .= '</ul>';
	}

	$pfStr .= '<div class="row threecol portfoliowrap"><div class="portfolio">';
	$j=0;
	query_posts('post_type=photogallery&posts_per_page='.$show); 
	if ( have_posts() ) : while ( have_posts() ) : the_post(); 
	$j++;
		$videoUrl = get_post_meta( get_the_ID(), 'video_file_url', true);
		$imgSrc = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full');
		$terms = wp_get_post_terms( get_the_ID(), 'gallerycategory', array("fields" => "all"));
		$slugAr = array();
		foreach( $terms as $tv ){
			$slugAr[] = $tv->slug;
		}
		if ( $imgSrc[0]!='' ) {
			$imgUrl = $imgSrc[0];
		}else{
			$imgUrl = get_template_directory_uri().'/images/img_404.png';
		}
		$pfStr .= '<div class="entry '.implode(' ', $slugAr).'">
						<div class="holderwrap">
						  <figure class="effect-bubba"> 
						  	<a href="'.( ($videoUrl) ? $videoUrl : $imgSrc[0] ).'" data-rel="prettyPhoto[bkpGallery]">
							 <img src="'.$imgSrc[0].'"/>
							 <h5>'.get_the_title().'</h5>
							 <figcaption></figcaption>
							</a>	
							</figure>													
						</div>
					</div>';
		unset( $slugAr );
	endwhile; else: 
		$pfStr .= '<p>Sorry, photo gallery is empty.</p>';
	endif; 
	wp_reset_query();
	$pfStr .= '</div></div>';
	$pfStr .= '</div>';
	return $pfStr;
}
add_shortcode( 'photogallery', 'photogallery_shortcode_func' );

/*toggle function*/
function toggle_func( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => 'Click here to toggle content',
	), $atts ) );
	$tog_content = "<div class=\"toggle_holder\"><h3 class=\"slide_toggle\"><a href=\"#\">{$title}</a></h3>
					<div class=\"slide_toggle_content\">".get_the_content_format( $content )."</div></div>";

	return $tog_content;
}
add_shortcode( 'toggle_content', 'toggle_func' );

function tabs_func( $atts, $content = null ) {
	$tabs = '<div class="tabs-wrapper"><ul class="tabs">'.do_shortcode($content).'</ul></div>';
	return $tabs;
}
add_shortcode( 'tabs', 'tabs_func' );

function tab_func( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => 'Tab Title',
	), $atts ) );
	$rand = rand(100,999);
	$tab = '<li><a rel="tab'.$rand.'" href="javascript:void(0)">'.$title.'</a><div id="tab'.$rand.'" class="tab-content">'.get_the_content_format($content).'</div></li>';
	return $tab;
}
add_shortcode( 'tab', 'tab_func' );

// Button Shortcode
function readmorebtn_fun($atts){
	extract(shortcode_atts(array(
	'name'	=> '',
	'align'	=> '',
	'link'	=> '#',
	'target'=> '',
	), $atts));
	return '<div class="custombtn" style="text-align:'.$align.'">	
	   <a class="morebutton" href="'.$link.'" target="'.$target.'">'.$name.'</a>	   	   
	</div>';
	}
add_shortcode('button','readmorebtn_fun');

// Button Shortcode
function pink_readmorebtn_fun($atts){
	extract(shortcode_atts(array(
	'name'	=> '',
	'align'	=> '',
	'link'	=> '#',
	'target'=> '',
	), $atts));
	return '<div class="custombtn" style="text-align:'.$align.'">	
	   <a class="pink_button" href="'.$link.'" target="'.$target.'">'.$name.'</a>	   	   
	</div>';
	}
add_shortcode('button_pink','pink_readmorebtn_fun');

// Button Shortcode
function mobile_pink_readmorebtn_fun($atts){
        extract(shortcode_atts(array(
        'name'  => '',
        'align' => '',
        'link'  => '#',
        'target'=> '',
        ), $atts));
        return '<div class="mobile_custombtn" style="text-align:'.$align.'">
           <a class="pink_button" href="'.$link.'" target="'.$target.'">'.$name.'</a>
        </div>';
        }
add_shortcode('mobile_button_pink','mobile_pink_readmorebtn_fun');

// Button Shortcode
function borderbtn_fun($atts){
	extract(shortcode_atts(array(
	'name'	=> '',
	'align'	=> '',
	'link'	=> '#',
	'target'=> '',
	), $atts));
	return '<div class="custombtn" style="text-align:'.$align.'">	
	   <a class="borderbutton" href="'.$link.'" target="'.$target.'">'.$name.'</a>	   	   
	</div>';
	}
add_shortcode('border-button','borderbtn_fun');

// Button Shortcode
function readmorebtn_style2_fun($atts){
	extract(shortcode_atts(array(
	'name'	=> '',
	'align'	=> '',
	'link'	=> '#',
	'target'=> '',	
	), $atts));
	return '<div class="custombtn" style="text-align:'.$align.'">	
	   <a class="buttonstyle1" href="'.$link.'" target="'.$target.'">'.$name.'</a>	   	   
	</div>';
	}
add_shortcode('buttonstyle2','readmorebtn_style2_fun');

// space Shortcode
function space_fun($atts){
	extract(shortcode_atts(array(
	'height'	=> '',	
	), $atts));
	return '<div class="space" style="height:'.$height.'"></div>';
	}
add_shortcode('space','space_fun');

// Sub Shortcode
function subtitle_fun($atts){
	extract(shortcode_atts(array(
	'size'	=> '',
	'color'	=> '',	
	'description'	=> '',
	'align'	=> '',
	), $atts));
	return '<div class="subtitle" style="font-size:'.$size.'; color:'.$color.'; text-align:'.$align.';">'.$description.'</div>';
	}
add_shortcode('subtitle','subtitle_fun');


// Section Content Main title Shortcode
function section_main_title_fun($atts){
	extract(shortcode_atts(array(	
	'title'	=> '',
	'align'	=> '',
	), $atts));
	return '<div class="sec_content_main_title" style="text-align:'.$align.';">'.$title.'</div>';
	}
add_shortcode('section-main-title','section_main_title_fun');


// Latest News function
function latestnewsoutput_func( $atts ){
   extract( shortcode_atts( array(
		'showposts' => 3,		
		'comment' => '',
		'date' => '',
		'author' => '',		
	), $atts ) );
	$postoutput = '<div class="threecolumn-news">';
	wp_reset_query();
	$n = 0;
	query_posts(  array( 'posts_per_page'=>$showposts, 'post__not_in' => get_option('sticky_posts') )  );
	if ( have_posts() ) :
		while ( have_posts() ) : the_post();
			$n++;
			if($comment=='show' || $comment==''){   
				$post_comment = ' <span>Comments ( <a href="'.get_the_permalink().'#comments">'.get_comments_number().' </a>)</span>';
			} else {
				$post_comment = '';
			}			
			if($date=='show'){   
				$post_date = '<div class="postdt"><span>'.get_the_date('Y').'</span> '.get_the_date('M, d').'</div>';
			} else {
				$post_date = '';
			}	
			if($author=='show'){   
				$post_author = '<span>Posted By '.get_the_author_posts_link().'</span>';
			} else {
				$post_author = '';
			}
			if( $n%3==0 )  $nomgn = 'last';	else $nomgn = ' ';
			if ( has_post_thumbnail()) {
				$large_imgSrc = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large');
				$imgUrl = $large_imgSrc[0];
			}else{
				$imgUrl = get_template_directory_uri().'/images/img_404.png';
			}
			$postoutput .= '<div class="news-box '.$nomgn.'">
								<div class="news-thumb">
									<a href="'.get_the_permalink().'"><img src="'.$imgUrl.'" alt=" " /></a>									
								</div>								 
								<div class="newsdesc">
								'.$post_date.'									
									<div class="PostMeta">										
										'.$post_author.'
										'.$post_comment.'                                    
									 </div>	
									 <h6><a href="'.get_permalink().'">'.get_the_title().'</a></h6>													
									 '.content( of_get_option('latestnewslength') ).'
									 <a class="poststyle" href="'.get_permalink().'">'.of_get_option('blogpostreadmoretext').'</a>								 
								</div>
								<div class="clear"></div>
                        </div>';	
						$postoutput .= ''.(($n%4==0) ? '<div class="clear"></div>' : '');	
		endwhile;
	endif;
	wp_reset_query();
	$postoutput .= '</div>';	
	return $postoutput;
}
add_shortcode( 'latest-news', 'latestnewsoutput_func' );

/* [custom-video youtubeid="" cover="" ] */
function theme_custom_video_fun($atts, $content = null){
	extract( shortcode_atts(array(
		'cover'  => '',		
		'youtubeid'  => '',	
		'cover'  => '',	
		'class'  => '',			
	), $atts));
	return '
			<div class="videobox">
			     <img src="'.$cover.'"  alt="" />
			</div>';
	}
add_shortcode('custom-video','theme_custom_video_fun');


// Industries Services Shortcode
function my_custom_industries_services_func($atts){
	extract(shortcode_atts(array(	
	'title'	=> '',
	'description'	=> '',	
	'icon' => '',
	'class' => '',
	), $atts));
	return '<div class="ind_col3 '.$class.' hvr-rectangle-out">                
                  <div class="">
                      <i class="'.$icon.'"></i>
                      <div class="ind_info">
                          <h4>'.$title.'</h4>
                          <p>'.$description.'</p>
                      </div></div>                
                </div>';
	}
add_shortcode('ind_services','my_custom_industries_services_func');
//[ind_services title="" description="" image=""]

//Pricing Table
function pricing_table_shortcode_func( $atts, $content = null ) {
   extract( shortcode_atts( array(
		'columns' => '4',
	), $atts ) );
	$ptbl = '<div class="pricing_table pcol'.$columns.'">'.do_shortcode( str_replace(array('<br />','\t','\n','\r','\0'.'\x0B'), array('','','','','',''), $content) ) .'<div class="clear"></div></div>';
	return $ptbl;
}
add_shortcode( 'pricing_table', 'pricing_table_shortcode_func' );

function price_column_func( $atts, $content = null ) {
   extract( shortcode_atts( array(
		'highlight' => '',
		'bgcolor' => '',
	), $atts ) );
	$pcol = '<div class="price_col '.( (strtolower($highlight) == 'yes') ? 'highlight' : '' ).'" '.( ($bgcolor!='') ? 'style="background-color:'.$bgcolor.' !important;"' : '' ) .'>'.do_shortcode( $content ) .'</div>';
    return $pcol;
}
add_shortcode( 'price_column', 'price_column_func' );

function price_column_header_func($atts, $content = null){
	extract( shortcode_atts(array(
		'image' => '',
		'startfrom' => '',
		'title' => '',
		'price' => '',
	), $atts));
	return '<div class="th" style="background-image:url('.$image.'); background-repeat:no-repeat; background-position: center top;">
			     <div class="pricttlbx">
				   <div class="ptitle">'.$title.'</div>
				   <div class="pricesubtitle">'.$startfrom.'<span>'.$price.'</span></div>
				 </div>
			</div>';
	}
add_shortcode('price_header','price_column_header_func');




function price_column_footer_func( $atts, $content = null ) {
   extract( shortcode_atts( array(
		'link' => '#',
	), $atts ) );
	$pfooter = '<div class="tf"><a href="'.$link.'">'.strip_tags($content).'</a></div>';
    return $pfooter;
}
add_shortcode( 'price_footer', 'price_column_footer_func' );

function price_row_footer_func( $atts, $content = null ) {
    extract( shortcode_atts( array(
		'class' => '',
	), $atts ) );
	$prow = '<div class="td '.$class.'">'.$content.'</div>';
    return $prow;
}
add_shortcode( 'price_row', 'price_row_footer_func' );

// Shortcode welcome sevices
//[welcome_sevices icon="" title="" description="" ]
function yogic_pro_welcome_services_func($atts){
		extract( shortcode_atts(array(
		'image' => '',		
		'title' => '',
		'description' => '',
		'class' => '',		
		), $atts));	
		return '
			<div class="wel3box_services '.$class.'">					
					<div class="wel3box_desc">	
					'.( ($image!='') ? '<div class="welcome_thumb"><img alt="" src="'.$image.'"></div>' : '').' 				
					<h4>'.$title.'</h4>
					<p>'.$description.'</p>
					</div>				
			</div>';
}
add_shortcode('welcome_sevices','yogic_pro_welcome_services_func');

/*Our classes Function*/
function our_classes_fun($atts){
	extract(shortcode_atts(array(	
	'title'	=> '',
	'description'	=> '',
	'image'	=> '',
	'date'	=> '',
	'time'	=> '',
	'date2'	=> '',
	'time2'	=> '',		
	'date3'	=> '',
	'time3'	=> '',
	'date4' => '',
	'time4' => '',
	'time5' => '',
	'date5' => '',
	'time6' => '',
	'date6' => '',
	'time7' => '',
	'date7' => '',
	'link'	=> '',
	'class'	=> '',
	'alt'   => '',
	'gmap'  => '',
	), $atts));
	return '<div class="classes_column '.$class.'">
	           <div class="classimg_bx"><img src="'.$image.'" alt=" ' .$alt. '" /></div>
	           <div class="titlebox">
			      <h4><a href="'.$link.'">'.$title.'</a></h4>
			           '.(($date!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date.'</span></div>' : '' ).'
				   '.(($time!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time.'</span>' : '' ).'
				   '.(($date2!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date2.'</span></div>' : '' ).'
				   '.(($time2!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time2.'</span>' : '' ).'
				   '.(($date3!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date3.'</span></div>' : '' ).'
				   '.(($time3!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time3.'</span>' : '' ).'
                                   '.(($date4!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date4.'</span></div>' : '' ).'
                                   '.(($time4!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time4.'</span>' : '' ).'
                                   '.(($date5!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date5.'</span></div>' : '' ).'
                                   '.(($time5!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time5.'</span>' : '' ).'
                                   '.(($date6!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date6.'</span></div>' : '' ).'
                                   '.(($time6!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time6.'</span>' :  '').'
                                   '.(($date7!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date7.'</span></div>' : '' ).'
                                   '.(($time7!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time7.'</span>' : '' ).'
			      <p>'.$description.'</p>
			   </div>
			</div>';
	}
add_shortcode('our_classes','our_classes_fun');

function our_classes_fun_slider($atts){
    extract(shortcode_atts(array(
        'title' => '',
        'description' => '',
        'images' => '', // Liste d'images séparées par des virgules
        'date' => '',
        'time' => '',
        'date2' => '',
        'time2' => '',
        'date3' => '',
        'time3' => '',
        'date4' => '',
        'time4' => '',
        'date5' => '',
        'time5' => '',
        'date6' => '',
        'time6' => '',
        'date7' => '',
        'time7' => '',
        'link' => '',
        'class' => '',
        'alt' => '',
        'gmap' => '',
    ), $atts));

    // Générer le slider d'images
    $classimg_html = '';
    if (!empty($images)) {
        $images_array = explode(',', $images);
        $classimg_html = '<div class="classimg_bx owl-carousel owl-theme">';
        foreach ($images_array as $img) {
            $classimg_html .= '<div class="item"><img src="'.trim($img).'" alt="'.$alt.'" /></div>';
        }
        $classimg_html .= '</div>';
    }

    return '<div class="classes_column '.$class.'">'.
               $classimg_html.
               '<div class="titlebox">
                    <h4><a href="'.$link.'">'.$title.'</a></h4>'.
                    (($date!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date.'</span></div>' : '' ).
                    (($time!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time.'</span>' : '' ).
                    (($date2!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date2.'</span></div>' : '' ).
                    (($time2!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time2.'</span>' : '' ).
                    (($date3!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date3.'</span></div>' : '' ).
                    (($time3!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time3.'</span>' : '' ).
                    (($date4!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date4.'</span></div>' : '' ).
                    (($time4!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time4.'</span>' : '' ).
                    (($date5!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date5.'</span></div>' : '' ).
                    (($time5!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time5.'</span>' : '' ).
                    (($date6!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date6.'</span></div>' : '' ).
                    (($time6!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time6.'</span>' :  '').
                    (($date7!='') ? '<div><span class="date_time"><i class="far fa-calendar-alt"></i> '.$date7.'</span></div>' : '' ).
                    (($time7!='') ? '<span class="date_time"><i class="far fa-clock"></i> '.$time7.'</span>' : '' ).
                    '<p>'.$description.'</p>
               </div>
           </div>';
}
add_shortcode('our_classes_slider','our_classes_fun_slider');

// Shortcode Our Yoga
//[about_yoga title="" description="" ]
function yogic_pro_about_yoga_func($atts){
		extract( shortcode_atts(array(		
		'title' => '',		
		'description' => '',		
		), $atts));	
		return '
			<div class="aboutyoga_box">					
					<div class="sec_content_main_title">'.$title.'</div>
					<p>'.$description.'</p>								
			</div>';
}
add_shortcode('about_yoga','yogic_pro_about_yoga_func');

// Shortcode Our mission
//[our_mission title="" description="" info="" ]
function yogic_pro_our_mission_func($atts){
		extract( shortcode_atts(array(		
		'title' => '',
		'info' => '',
		'description' => '',		
		), $atts));	
		return '
			<div class="mission_box">					
				<div class="mission_desc">					
					<div class="msndesc"><p>'.$description.'</p></div>
					<h4>'.$title.'</h4>
					<span>'.$info.'</span>
				</div>				
			</div>';
}
add_shortcode('our_mission','yogic_pro_our_mission_func');

//Benefits of yoga functions
//[benefit_yoga icon="" title="" description=""]
function yogic_pro_benefit_yoga_func($atts){
		extract( shortcode_atts(array(
		'icon' => '',		
		'title' => '',		
		'link' => '',		
		), $atts));	
		return '
			<div class="benifit_column">				
					'.( ($icon!='') ? '<div class="benefit_iconbx"><img src="'.$icon.'"></div>' : '').' 
					 <div class="benefit_desc">					
						<h4><a href="'.$link.'">'.$title.'</a></h4>						
					</div>				
			</div>';
}
add_shortcode('benefit_yoga','yogic_pro_benefit_yoga_func');


// Shortcode Features sevices
//[features_sevices icon="" title="" description="" ]
function yogic_pro_features_services_functions($atts){
		extract( shortcode_atts(array(
		'icon' => '',		
		'title' => '',
		'description' => '',		
		), $atts));	
		return '
			<div class="ftr_srv_list">				
					'.( ($icon!='') ? '<div class="ftr_icons"><img alt="" src="'.$icon.'"></div>' : '').' 				
					<h4>'.$title.'</h4>
					<p>'.$description.'</p>						
			</div>';
}
add_shortcode('features_sevices','yogic_pro_features_services_functions');

// Counter Shortcode
function yogic_pro_custom_counter_func($atts){
	extract(shortcode_atts(array(	
		'value'	=> '',	
		'title'	=> '',
		'description'	=> '',
	), $atts));
		return '
			<div class="counterlist">	
				<div class="circle_countr">
					<div class="counter">'.$value.'</div>
					<h6>'.$title.'</h6>	
					<p>'.$description.'</p>	
				</div>
			</div>
		';
	}
add_shortcode('counter','yogic_pro_custom_counter_func');


/*Clients Logo function*/
function yogic_pro_client_logos($atts, $content = null){
	return '<ul id="clientlogo">'.do_shortcode($content).'</ul>';
	}
add_shortcode('client_lists','yogic_pro_client_logos');

function yogic_pro_client($atts){
	extract(shortcode_atts(array(
	'image'	=> '',
	'title'	=> '',		
	'link'	=> '#'	
	), $atts));
	return '<li><a href="'.$link.'" target="_blank"><img src="'.$image.'" alt="" /><span>'.$title.'</span></a></li>';
	}
add_shortcode('client','yogic_pro_client');

define('GRACE_THEME_DOC','http://www.gracethemesdemo.com/documentation/yogic/');

