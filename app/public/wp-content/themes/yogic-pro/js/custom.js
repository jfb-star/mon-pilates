jQuery(document).ready( function(){
	var ww = jQuery(window).width();	
	jQuery("area[rel^='prettyPhoto']").prettyPhoto();
	jQuery(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: false});
	jQuery(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
	jQuery("#custom_content a[rel^='prettyPhoto']:first").prettyPhoto({
		custom_markup: '<div id="map_canvas" style="width:260px; height:265px"></div>',
		changepicturecallback: function(){ initialize(); }
	});
	jQuery("#custom_content a[rel^='prettyPhoto']:last").prettyPhoto({
		custom_markup: '<div id="bsap_1259344" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div><div id="bsap_1237859" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6" style="height:260px"></div><div id="bsap_1251710" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div>',
		changepicturecallback: function(){ _bsap.exec(); }
	});

	// accordion
    jQuery('.accordion-box .acc-content').hide();
    jQuery('.accordion-box h2:first').addClass('active').next().show();
    jQuery('.accordion-box h2').click(function(){
        if( jQuery(this).next().is(':hidden') ) {
            jQuery('.accordion-box h2').removeClass('active').next().slideUp();
            jQuery(this).toggleClass('active').next().slideDown();
        }
        return false; // Prevent the browser jump to the link anchor
    });
	
	// Tabs
	jQuery('ul.tabs > br').remove();
	jQuery('.tabs-wrapper').append(jQuery('.tabs li div'));
	jQuery('.tabs li:first a').addClass('defaulttab selected');
	jQuery('.tabs a').click(function(){
		switch_tabs(jQuery(this));
	});
	switch_tabs(jQuery('.defaulttab'));
	function switch_tabs(obj) {
		jQuery('.tab-content').hide();
		jQuery('.tabs a').removeClass("selected");
		var id = obj.attr("rel");
		jQuery('#'+id).show();
		obj.addClass("selected");
	}

	// Content Toggle
    jQuery(".slide_toggle_content").hide();
    jQuery("h3.slide_toggle").toggle(function(){
	    jQuery(this).addClass("clicked");
	}, function () {
	    jQuery(this).removeClass("clicked");
    });
    jQuery("h3.slide_toggle").click(function(){
		jQuery(this).next(".slide_toggle_content").slideToggle();
    });

});

jQuery(window).load(function() { 
   jQuery('#testimonials .quotes').quovolver({
      children    : 'div',
      transitionSpeed : 600,
      autoPlay    : true,
	  autoPlaySpeed:6000,
      equalHeight   : false,
      navPosition   : 'below',
      navPrev     : true,
      navNext     : true,
      navNum      : true,
      navText     : false,
      navTextContent  : 'Quote @a of @b'
    });    
  });

// NAVIGATION CALLBACK
var ww = jQuery(window).width();
jQuery(document).ready(function() { 
	jQuery(".sitenav li a").each(function() {
		if (jQuery(this).next().length > 0) {
			jQuery(this).addClass("parent");
		};
	})
	
	jQuery(".sitenav li a").each(function() {
		if (jQuery(this).next().length > 0) {
			jQuery(this).addClass("parent-2");
		};
	})
	
	jQuery(".toggleMenu").click(function(e) { 
		e.preventDefault();
		jQuery(this).toggleClass("active");
		jQuery(".sitenav").slideToggle('fast');
	});
	adjustMenu();
})

// navigation orientation resize callbak
jQuery(window).bind('resize orientationchange', function() {
	ww = jQuery(window).width();
	adjustMenu();
});

var adjustMenu = function() {
	if (ww < 769) {
		jQuery(".toggleMenu").css("display", "block");
		if (!jQuery(".toggleMenu").hasClass("active")) {
			jQuery(".sitenav").hide();
		} else {
			jQuery(".sitenav").show();
		}
		jQuery(".sitenav li").unbind('mouseenter mouseleave');
	} else {
		jQuery(".toggleMenu").css("display", "none");
		jQuery(".sitenav").show();
		jQuery(".sitenav li").removeClass("hover");
		jQuery(".sitenav li a").unbind('click');
		jQuery(".sitenav li").unbind('mouseenter mouseleave').bind('mouseenter mouseleave', function() {
			jQuery(this).toggleClass('hover');
		});
	}
}


jQuery(document).ready(function() {
  	jQuery('.srchicon').click(function() {
			jQuery('.searchtop').toggle();
			jQuery('.topsocial').toggle();
		});	
});

// skill bar script
jQuery(document).ready(function() {
	jQuery('.skillbar').each(function(){
		jQuery(this).find('.skillbar-bar').animate({
			width:jQuery(this).attr('data-percent')
		},6000);
	});
});

jQuery(document).ready(function(){
	// hide #back-top first
	jQuery("#back-top").hide();	
	// fade in #back-top
	jQuery(function () {
		jQuery(window).scroll(function () {
			if (jQuery(this).scrollTop() > 0) {
				jQuery('#back-top').fadeIn();
			} else {
				jQuery('#back-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		jQuery('#back-top').click(function () {
			jQuery('body,html').animate({
				scrollTop: 0
			}, 500);
			return false;
		});
	});

});

//Client Logo jquery   
jQuery(window).load(function() { 
    jQuery("#flexiselDemo3").flexisel({
        visibleItems: 5,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,            
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: { 
            portrait: { 
                changePoint:480,
                visibleItems: 1
            }, 
            landscape: { 
                changePoint:640,
                visibleItems: 2
            },
            tablet: { 
                changePoint:768,
                visibleItems: 3
            }
        }
    });    
});

//Client Logo jquery   
jQuery(window).load(function() { 
    jQuery("#SidebarRoator").flexisel({
        visibleItems: 1,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,            
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: { 
            portrait: { 
                changePoint:480,
                visibleItems: 1
            }, 
            landscape: { 
                changePoint:640,
                visibleItems: 1
            },
            tablet: { 
                changePoint:768,
                visibleItems: 1
            }
        }
    });    
});

jQuery(document).ready(function() {    
  jQuery('.videogalley_wrapper').owlCarousel({
    loop:true,
	autoplay:true,
    margin:20,
    nav:true,
	dots:false,
    responsive:{
        0:{
            items:1
        },
        768:{
            items:3
        },
        1000:{
            items:5
        }
    }
})
    
  });



jQuery(document).ready(function( jQuery ) {
        jQuery('.counter').counterUp({
            delay: 10,
            time: 1000
        });
  });
 


jQuery(document).ready(function() {
        jQuery('.counterlist h6').each(function(index, element) {
            var heading = jQuery(element);
            var word_array, last_word, first_part;

            word_array = heading.html().split(/\s+/); // split on spaces
            last_word = word_array.pop();             // pop the last word
            first_part = word_array.join(' ');        // rejoin the first words together

            heading.html([first_part, ' <span>', last_word, '</span>'].join(''));
        });
});

// video popup jQuery
jQuery(document).ready(function( jQuery ) {
     	jQuery(".youtube-link").grtyoutube({
		autoPlay:true,
		theme: "dark"
	});
  }); 

/* Start Counter */
function CountDownTimer(a,b){function i(){var a=new Date,i=c-a;if(i<0)return clearInterval(h),void(document.getElementById(b).innerHTML="EXPIRED!");var j=Math.floor(i/g),k=Math.floor(i%g/f),l=Math.floor(i%f/e),m=Math.floor(i%e/d);document.getElementById(b).innerHTML='<div class="counter-column">'+j+"<span>Days</span></div>",document.getElementById(b).innerHTML+='<div class="counter-column">'+k+"<span>Hours</span></div>",document.getElementById(b).innerHTML+='<div class="counter-column">'+l+"<span>Minutes</span></div>",document.getElementById(b).innerHTML+='<div class="counter-column">'+m+"<span>Seconds</span></div>"}var h,c=new Date(a),d=1e3,e=60*d,f=60*e,g=24*f;h=setInterval(i,1e3)}
/* End Counter */

/* ============================================
   MENU MONPILATES STYLE - Header scroll & Mobile menu
   ============================================ */
jQuery(document).ready(function($) {

    // Header scroll effect
    var header = $('.header');
    var lastScrollTop = 0;

    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();

        // Add scrolled class when scrolling down
        if (scrollTop > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle (nouvelle version pour design MONPILATES)
    $('.toggleMenu, .toggle a').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.ppmenubg').toggleClass('active');
        $('body').toggleClass('menu-open');
    });

    // Max Mega Menu toggle - Ajouter les classes pour empêcher le scroll
    $(document).on('click', '.mega-toggle-block, .mega-toggle-block-left, .mega-toggle-block-center, .mega-toggle-block-right', function() {
// Petit délai pour laisser Max Mega Menu ajouter ses classes
        setTimeout(function() {
            // Max Mega Menu utilise 'mega-menu-primary-mobile-open' !
            var isOpen = $('body').hasClass('mega-menu-primary-mobile-open') ||
                        $('html').hasClass('mega-menu-primary-mobile-open') ||
                        $('body').hasClass('mega-menu-open') ||
                        $('html').hasClass('mega-menu-open');
if (isOpen) {
                $('body, html').addClass('menu-open');
                // Forcer l'affichage du menu
                $('#mega-menu-primary').css('display', 'block');
            } else {
                $('body, html').removeClass('menu-open');
                $('#mega-menu-primary').css('display', 'none');
            }
        }, 100);
    });

    // Observer pour détecter quand Max Mega Menu ajoute/retire la classe
    if (window.MutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    var target = $(mutation.target);

                    // Max Mega Menu utilise 'mega-menu-primary-mobile-open'
                    if (target.hasClass('mega-menu-primary-mobile-open') || target.hasClass('mega-menu-open')) {
$('body, html').addClass('menu-open').css('overflow', 'hidden');
                        $('#mega-menu-primary').css('display', 'block');
                    } else if (!target.hasClass('menu-open')) {
$('body, html').removeClass('menu-open').css('overflow', '');
                        $('#mega-menu-primary').css('display', 'none');
                    }
                }
            });
        });

        // Observer le body et html pour les changements de classe
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Observer aussi le wrapper Max Mega Menu
        var megaMenuWrap = document.getElementById('mega-menu-wrap-primary');
        if (megaMenuWrap) {
            observer.observe(megaMenuWrap, { attributes: true, attributeFilter: ['class'] });
        }
    }

    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if ($(window).width() <= 768) {
            if (!$(e.target).closest('.ppmenubg, .toggle, .toggleMenu').length) {
                $('.ppmenubg').removeClass('active');
                $('.toggleMenu, .toggle a').removeClass('active');
                $('body').removeClass('menu-open');
            }
        }
    });

    // Mobile submenu toggle
    if ($(window).width() <= 768) {
        $('.sitenav .menu-item-has-children > a').on('click', function(e) {
            var parent = $(this).parent();
            var submenu = $(this).next('ul');

            if (submenu.length) {
                e.preventDefault();
                parent.toggleClass('submenu-open');
                submenu.slideToggle(300);
            }
        });
    }

    // Responsive menu handling
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $('.ppmenubg').removeClass('active');
            $('.toggleMenu, .toggle a').removeClass('active');
            $('body').removeClass('menu-open');
            $('.sitenav .menu-item-has-children ul').removeAttr('style');
        }
    });

    // Smooth scroll for anchor links
    $('a[href^="#"]:not([href="#"])').on('click', function(e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 85
            }, 800);

            // Close mobile menu after clicking
            if ($(window).width() <= 768) {
                $('.ppmenubg').removeClass('active');
                $('.toggleMenu, .toggle a').removeClass('active');
                $('body').removeClass('menu-open');
            }
        }
    });

});
