/*******************************************************************
*                     File: jqueryPlugins.js                       *
*                                                                  *
*                  by Axel Grude & Marky Mark DE                   *
*                       & our contributors                         *
*                         Version 10/2013                          *
*                                                                  *
*                    Date: Tue 22/10/2013 15:22                    *
*                                                                  *
*******************************************************************/

"use strict"; // use ECMAScript5 strict mode

/******************************************************************/
/*********************** Toggle Screenshots ***********************/
/************************* by Axel Grude **************************/
/******************************************************************/

function togglePopup(vis, back, pop, target) {
  if (Environment.isMobile.any()) {
        var href = target.getAttribute('data-mobile-href');
        if (href) {
            window.location.href=href;
        }
        return;
  }
  var background = $(back);  // document.getElementById - note to get at the element properties, use x.get(0) !
  if (vis) {
    background.fadeTo(300, 0.7); // fade it in
  }
  else {
    background.fadeTo(300,0.1, function() { background.hide(); }); // fade it out
  }
  var popup = $(pop);
  if (vis) {
    popup.fadeTo(300, 1); // fade it in
    $("#navbarTable").fadeOut();
  }
  else {
    popup.fadeTo(200, 0.1, function() { popup.hide(); }); // fade it out, then hide
    $("#navbarTable").fadeIn();
  }
}

/******************************************************************/
/************************* Image Scroller *************************/
/********************* by Massimiliano Chiusso ********************/
/******************************************************************/
// ImageScroller v 1.1, 23/11/2009

( function( $ ) {
    $.fn.imageScroller = function ( options ) {
        return this.each( function() {
            var $this = $( this );
            var loadImgs = 0;

            var opt = $.extend(
                {
                      speed: "2000"
                    , loading: "Loading images..." 
                    , direction: "left"
                }
                , options || {}
            );

            $this.children().hide();
            $this.append(
                "<div style='clear:both; padding: 0px; margin: 0px;'>" +
                "<div id='loading'>" + opt.loading + "</div>" + 
                "</div>"
            );

            $( "img" , $this ).each(
                function () {
                    var img = new Image();
                    var soc = $( this ).attr( 'src' );
                    try {
                        let target = 
                            $( img ).load(
                                function () {
                                    loadImgs++;
                                }
                            );
                        target.setAttribute("src", soc);
                    }
                    catch(ex) {
                        console.log(`Problem in imageScroller(), src=${soc}`,ex);
                    }
                }
            );

            var intVal = window.setInterval(
                function () {
                    if ( loadImgs == $( "img" , $this ).length ) {
                        window.clearInterval( intVal );
                        $( "#loading" ).remove();
                        $this.children().show();
                        var totImg = 0;
            
                        $.each(
                              $this.children( ":not(div)" )
                            , function () {
                                switch ( opt.direction ) {
                                    case 'left':
                                    case 'right':
                                        if ( $( this ).children().length ) {
                                            $( this ).width( $( this ).children( ":eq(0)" ).width() );
                                        }
                                        totImg += $( this ).width();
                                        break;
                                    case 'top':
                                    case 'bottom':
                                        $( this ).css( "display" , "block" );
                                        if ( $( this ).children().length ) {
                                            $( this ).height( $( this ).children( ":eq(0)" ).height() );
                                        }
                                        totImg += $( this ).height();
                                        break;
                                }

                                $( this ).css({
                                      margin:  "0px"
                                    , padding: "0px"
                                    , clear:   "both"
                                });

                                $( this ).bind(
                                      "mouseover"
                                    , function () {
                                        $( "div:eq(0)" , $this ).stop();
                                    }
                                ).bind(
                                      "mouseout"
                                    , function () {
                                        scrollStart( $( "div:eq(0)" , $this ) , opt );
                                    }
                                );

                                $( "div:eq(0)" , $this ).append( $( this ) );
                            }
                        );

                        switch ( opt.direction ) {
                            case 'left':
                                $( "div:eq(0)" , $this ).css( "width" , totImg + "px" );
                                break;

                            case 'right':
                                $( "div:eq(0)" , $this ).css( "width" , totImg + "px" );
                                $( "div:eq(0)" , $this ).css({
                                    marginLeft: -( totImg - $this.width() ) + "px"
                                });
                                break;

                            case 'top':
                                $( "div:eq(0)" , $this ).css( "height" , totImg + "px" );
                                break;

                            case 'bottom':
                                $( "div:eq(0)" , $this ).css( "height" , totImg + "px" );
                                $( "div:eq(0)" , $this ).css({
                                    marginTop: -( totImg - $this.height() ) + "px"
                                });
                                break;
                        }

                        scrollStart( $( "div:eq(0)" , $this ) , opt );
                    }
                }
                , 100
            );

            function scrollStart ( $scroll , opt ) {
                switch ( opt.direction ) {
                    case 'left':
                        var pos = -( $scroll.children( ":eq(0)" ).width() );
                        var spd = opt.speed - ( Math.abs ( parseInt( $scroll.css( "marginLeft" ) ) ) * ( opt.speed / $scroll.children( ":eq(0)" ).width() ) );
                        break;

                    case 'right':
                        var pos = -( $scroll.width() - $scroll.parents( "div:eq(0)" ).width() ) + $scroll.children( ":last" ).width();
                        var spd = opt.speed - ( ( $scroll.children( ":last" ).width() - ( Math.abs ( parseInt( $scroll.css( "marginLeft" ) ) ) - Math.abs ( pos ) ) ) * ( opt.speed / $scroll.children( ":last" ).width() ) );
                        break;

                    case 'top':
                        var tos = -( $scroll.children( ":eq(0)" ).height() );
                        var spd = opt.speed - ( Math.abs ( parseInt( $scroll.css( "marginTop" ) ) ) * ( opt.speed / $scroll.children( ":eq(0)" ).height() ) );
                        break;

                    case 'bottom':
                        var tos = -( $scroll.height() - $scroll.parents( "div:eq(0)" ).height() ) + $scroll.children( ":last" ).height();
                        var spd = opt.speed - ( ( $scroll.children( ":last" ).height() - ( Math.abs ( parseInt( $scroll.css( "marginTop" ) ) ) - Math.abs ( tos ) ) ) * ( opt.speed / $scroll.children( ":last" ).height() ) );
                        break;
                }

                $scroll.animate(
                    {
                          marginLeft: ( pos || "0" ) + "px"
                        , marginTop: ( tos || "0" ) + "px"
                    }
                    , spd
                    , "linear"
                    , function () {
                        switch ( opt.direction ) {
                            case 'left':
                                $scroll.append( $( this ).children( ":eq(0)" ) );
                                $scroll.css( "marginLeft" , "0px" );
                                break;

                            case 'right':
                                $scroll.prepend( $( this ).children( ":last" ) );
                                $scroll.css( "marginLeft" , -( $scroll.width() - $scroll.parents( "div:eq(0)" ).width() ) + "px" );
                                break;

                            case 'top':
                                $scroll.append( $( this ).children( ":eq(0)" ) );
                                $scroll.css( "marginTop" , "0px" );
                                break;

                            case 'bottom':
                                $scroll.prepend( $( this ).children( ":last" ) );
                                $scroll.css( "marginTop" , -( $scroll.height() - $scroll.parents( "div:eq(0)" ).height() ) + "px" );
                                break;
                        }

                        scrollStart( $scroll , opt );
                    }
                );
            };
        });
    };
})(jQuery);

//  Apply container id to jquery custom class imageScroller

//   Configuration: $( "#div" ).imageScroller( {options} )
//   options:       speed (millisecond)
//                  loading (text)
//                  direction (left, right, top, bottom)


$(
    function () {
        $( "#brandsCarousel" ).imageScroller( {speed:'3000', direction:'right', loading: ''} );
    }
)

/******************************************************************/
/************************ Subfunctions in: ************************/
/************************* templates.html *************************/
/************************* screenshots.html ***********************/
/************************* faq.html *******************************/
/******************************************************************/

function collapseQA(isjQuery) {
   /* jquery, we just leave in the document.ready */
	// we can take this out later...
    if (isjQuery) {
		jQuery(document).ready(function(event) {
			jQuery(".question").click(function() {
				var par = jQuery(this).parent("li");
				var ans = jQuery(par).children(".answer");
				var img = jQuery(par).children("img");
				if (jQuery(ans).is(":hidden")) {
					jQuery(ans).slideDown("fast");
					jQuery(img).attr("src","/img/collapseUp.png");
				}
				else {
					jQuery(ans).slideUp("fast");
					jQuery(img).attr("src","/img/collapseDown.png");
				}
			});
			if (event.defaultPrevented)
				event.defaultPrevented(); // not needed but added for safety
			if (event.preventDefault)
				event.preventDefault(); // not needed but added for safety
			if (event.stopPropagation)
				event.stopPropagation(); // not needed but added for safety
		
			//If .answer is hidden initially, the first 'slidedown' is not animated
			//as a workaround it will be shown initially and jquery will slideUp with a 0ms time
			//jQuery(".answer").slideUp(0);
		});
    }
	else {
		// nur fur schlaue browser...
		document.addEventListener("DOMContentLoaded", 
		  function(event) {
				var questions = document.getElementsByClassName("question"); // we need to add this for IE
				// now add some (on)click handlers
				var i;
				for (i=0; i<questions.length; i++) {
					var q = questions[i];
					addEvent(q, 'click', toggleExpand);
				} 
  	  });		
	}
}