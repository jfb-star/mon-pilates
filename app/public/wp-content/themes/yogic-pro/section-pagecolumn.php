<?php if ( is_home() || is_front_page() ) { ?>

<?php $hide3boxservicessection = of_get_option('hide3boxservicessection', '1'); ?>
		<?php if($hide3boxservicessection == ''){ ?>                    
<section id="pagearea">
  <div class="container">     
            <?php
			$title_arr = array( esc_attr__('Outdoor Activities','yogic-pro'), esc_attr__('Experienced Trainers','yogic-pro'), esc_attr__('Happy Environment','yogic-pro'));
			$boxArr = array();
			   if( of_get_option('box1',true) != '' ){
				$boxArr[] = of_get_option('box1',false);
			   }
			   if( of_get_option('box2',true) != '' ){
				$boxArr[] = of_get_option('box2',false);
			   }
			   if( of_get_option('box3',true) != '' ){
				$boxArr[] = of_get_option('box3',false);
			   }
			   if( of_get_option('box4',true) != '' ){
				$boxArr[] = of_get_option('box4',false);
			   }
			   if( of_get_option('box5',true) != '' ){
				$boxArr[] = of_get_option('box5',false);
			   }
			    if( of_get_option('box6',true) != '' ){
				$boxArr[] = of_get_option('box6',false);
			   }			   			  
			
			
			if (!array_filter($boxArr)) {
			for($fx=1; $fx<=3; $fx++) {
			?>
            <div class="services_3box <?php if($fx % 3 == 0) { echo "last_column"; } ?>">
              <div class="thumbbx">
               <a class="hvr-rectangle-out" href="#"><img src="<?php echo get_template_directory_uri(); ?>/images/services_img<?php echo $fx; ?>.jpg" alt="" /></a>
              </div>
             <h3><a href="#"><?php echo $title_arr[$fx-1]; ?></a></h3>             
             <p><?php _e('Donec in metus lectus. Integer vulputate porta elit, fringilla mollis mag luctus vel. Interdui malesuada fames ac ante ipsum primis in fauci', 'yogic-pro') ?></p>             
             <a class="black_button" href="#"><?php _e('Read More', 'yogic-pro') ?></a>      
          
         	</div>
			<?php 
			} 
			} else {			
				$box_column = array('no_column','one_column','two_column','three_column','four_column','five_column','six_column');
				$fx = 1;				
				$queryvar = new wp_query(array('post_type' => 'page', 'post__in' => $boxArr, 'posts_per_page' => 6, 'orderby' => 'post__in' ));				
				while( $queryvar->have_posts() ) : $queryvar->the_post(); ?> 
        	    <div class="services_3box <?php echo $box_column[count($boxArr)]; ?> <?php if($fx % count($boxArr) == 0) { echo "last_column"; } ?>">
                
				<?php if( of_get_option('boximg'.$fx, true) != '') { ?>	
                  <div class="thumbbx">
                    <a href="<?php the_permalink(); ?>"><img alt="" src="<?php echo esc_url( of_get_option( 'boximg'.$fx, true )); ?>" / ></a>
                  </div>               
                <?php } ?> 
                 <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                 <p><?php echo wp_trim_words( get_the_content(), of_get_option('pageboxexcerptlength'), '' ); ?></p>
                 <?php if( of_get_option('pagereadmorebutton',true) != '') { ?>
                   <a class="black_button" href="<?php the_permalink(); ?>"><?php echo of_get_option('pagereadmorebutton'); ?></a>      
                 <?php } ?>
        	   </div>
             <?php 
			 $fx++; 
			 endwhile;
			 wp_reset_postdata();
			 }		
		 ?>               
         <div class="clear"></div>
    </div><!-- .container -->
</section><!-- #pagearea -->
<?php } ?>
<?php } ?>