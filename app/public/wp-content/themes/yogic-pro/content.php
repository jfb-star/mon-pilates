<?php
/**
 * @package Yogic Pro
 */
?>
<div class="blog-post-repeat">
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
            <h3 class="post-title"><a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a></h3>
            <?php if ( 'post' == get_post_type() ) : ?>
                <div class="postmeta">
                    <div class="post-date"><?php echo get_the_date(); ?></div><!-- post-date -->
                    <div class="post-comment"> | <a href="<?php comments_link(); ?>"><?php comments_number(); ?></a></div>
                    <div class="post-categories"> | <?php echo getPostCategories();?></div>
                    <div class="clear"></div>
                </div><!-- postmeta -->
            <?php endif; ?>
	        <?php if ( is_search() || !is_single() ) : // Only display Excerpts for Search ?>
            
	           <?php if ( has_post_thumbnail() ) : ?>
                      <div class="post-thumb"><a href="<?php the_permalink(); ?>"><?php the_post_thumbnail(); ?></a></div>    			
                <?php endif; ?>
                
	        <?php else : ?>
	            <?php if ( has_post_thumbnail() ) : ?>
                      <div class="post-thumb"><?php the_post_thumbnail(); ?></div>    			
                 <?php endif; ?>
	        <?php endif; ?>
            
        </header><!-- .entry-header -->
    
        <?php if ( is_search() || !is_single() ) : // Only display Excerpts for Search ?>
            <div class="entry-summary">
                <?php echo content( of_get_option('blogpostexcerptlength') ); ?> 
                <?php if( of_get_option('readmoretext_blogtemplates',true) != '') { ?>                 
                <p class="read-more"><a href="<?php the_permalink(); ?>"><?php echo of_get_option('readmoretext_blogtemplates'); ?></a></p>
                <?Php } ?>
                 <div class="clear"></div>
            </div><!-- .entry-summary -->
        <?php else : ?>
            <div class="entry-content">
                <?php the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'yogic-pro' ) ); ?>
                <?php
                    wp_link_pages( array(
                        'before' => '<div class="page-links">' . __( 'Pages:', 'yogic-pro' ),
                        'after'  => '</div>',
                    ) );
                ?>
                <div class="clear"></div>
            </div><!-- .entry-content -->
        <?php endif; ?>        
    </article><!-- #post-## -->   
</div>