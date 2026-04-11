<?php
/**
 * @package Yogic Pro
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('single-post'); ?>>
 <div class="blog-post-repeat">      
   <header class="entry-header">       
        <h3 class="post-title"><?php the_title(); ?></h3>
        <div class="postmeta">
            <div class="post-date"><?php echo get_the_date(); ?></div><!-- post-date -->
            <div class="post-comment"> | <a href="<?php comments_link(); ?>"><?php comments_number(); ?></a></div>
            <div class="post-categories"> | <?php echo getPostCategories();?></div>
            <div class="clear"></div>
        </div><!-- postmeta -->
        
    </header><!-- .entry-header -->

    <div class="entry-content">       
        <?php the_content(); ?>
        <?php
        wp_link_pages( array(
            'before' => '<div class="page-links">' . __( 'Pages:', 'yogic-pro' ),
            'after'  => '</div>',
        ) );
        ?>
        <div class="postmeta">           
            <div class="post-tags"><?php the_tags(' | Tags: ', ', ', '<br />'); ?> </div>
            <div class="clear"></div>
        </div><!-- postmeta -->
    </div><!-- .entry-content -->
   
    <footer class="entry-meta">
        <?php edit_post_link( __( 'Edit', 'yogic-pro' ), '<span class="edit-link">', '</span>' ); ?>
    </footer><!-- .entry-meta -->
  </div>
</article>