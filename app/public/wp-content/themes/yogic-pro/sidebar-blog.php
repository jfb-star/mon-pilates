<?php
/**
 * The Sidebar containing the main widget areas.
 *
 * @package Yogic Pro
 */
?>
<div id="sidebar" <?php if( is_page_template('template-parts/blog-post-left-sidebar.php')){?> style="float:left;"<?php } ?>>
    
    <?php if ( ! dynamic_sidebar( 'sidebar-1' ) ) : ?>
   
       <aside id="categories" class="widget">
        <h3 class="widget-title"><?php _e( 'Category', 'yogic-pro' ); ?></h3>
            <ul>
                <?php wp_list_categories('title_li=');  ?>
            </ul>
        </aside>
        
      
        <aside id="archives" class="widget">
         <h3 class="widget-title"><?php _e( 'Archives', 'yogic-pro' ); ?></h3>
            <ul>
                <?php wp_get_archives( array( 'type' => 'monthly' ) ); ?>
            </ul>
        </aside>       
    <?php endif; // end sidebar widget area ?>
	
</div><!-- sidebar -->