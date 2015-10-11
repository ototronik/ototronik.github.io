// iPhone Listeners
	
window.addEventListener('load', setOrientation, false); 
window.addEventListener('orientationchange', setOrientation, false);

function menuResizing () {
	if ( $('#main_menu').length > 0 ) {
		var devHeight = $(window).height()+100;
		$('#main_menu').height(devHeight);
	}
}
function sliderResizing() {
	var slidesLength = $(".slides").length;
	var devWidth = $(window).width();
	$('#slider').width(devWidth);
	$('#slide_list').width(devWidth*slidesLength);
	$('.slides').width(devWidth);
	var slideIndex = $('#slide_list .current').index();
	$('#slide_list').css({
		left:(($('#slide_list li').width())*slideIndex)*(-1)
	});
}

function setOrientation() {
	var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait'; 
	var cl = document.body.className; 
	cl = cl.replace(/portrait|landscape/, orient);
	document.body.className = cl;
	setTimeout(menuResizing,500);
	setTimeout(sliderResizing,800);
}

window.addEventListener('load', function(){
	if (location.hash.length == 0) {
		setTimeout(scrollTo, 0, 0, 1);
	}
}, false);

// jQueries

$(document).ready(function(){
	
	// Main menu interactions
	
	$('#main_menu_button').click(function(){
		var devHeight = $(window).height()+100;
//		$('body').height(devHeight).addClass('cropped');
		$('#main_menu').height(devHeight).show();
		setTimeout(scrollTo, 0, 0, 1);
	});
	$('#hide_main_menu a').click(function(){
		$('body').css('height','auto').removeClass('cropped');
		$('#main_menu').hide();
		setTimeout(scrollTo, 0, 0, 1);
	});
	
	$('#back2top').click(function(){
		setTimeout(scrollTo, 0, 0, 1);
	});
	
	// Label show/hide
	
	$(':input').focus(function(){
		$(this).parent().find('label').hide();
	});
	$(':input').blur(function(){
		if ( $(this).val() == '' ) {
			$(this).parent().find('label').show();
		}
	});
	
	// Category list button
	
	$('#category_list a.button').toggle(function(){
		$(this).addClass('active').parent().find('.subnav').show();
	}, function(){
		$(this).removeClass('active').parent().find('.subnav').hide();
	});
	
	// Slider script
	
		if ($("#slider").length > 0) {
			slidesLength = $(".slides").length;
			var devWidth = $('#slider').width();
			$('#slide_list').width(devWidth*slidesLength);
			
			// Slide switcher
			
			function slideSwitcher(slideIndex) {
				var devWidth = $('#slider').width();
				var slidesLength = $('.slides').length;
				var listPos = parseInt($('#slide_list').css('left'));
				if ( slideIndex >= slidesLength ) {
					slideIndex = slidesLength - 1;
					$('#slide_list').animate({
						left:listPos-(devWidth/8)
					},150, function(){
						$(this).animate({
							left:listPos
						},150, function(){
							swipeInd = 0;
						})
					});
					return false;
				} else if ( slideIndex < 0 ) {
					slideIndex = 1;
					$('#slide_list').animate({
						left:listPos+(devWidth/8)
					},150, function(){
						$(this).animate({
							left:listPos
						},150, function(){
							swipeInd = 0;
						})
					});
					return false;
				}
				
				listPos = (devWidth*(slideIndex))*(-1);
				$("#slide_list li").removeClass("current").eq(slideIndex).addClass("current");			
				$('#slide_list').animate({
					left:listPos
				},500,'easeOutExpo', function(){
					swipeInd = 0;
				});
				
			}
			
			// Swipe handler
			
			swipeInd = 0;
			slideIndex = 0;
			
			function swipe(event, direction) {
				if ( swipeInd == 0 ) {
					
					swipeInd = 1;
					
					var devWidth = $('#slider').width();
					var slidesLength = $('.slides').length;
					var listPos = parseInt($('#slide_list').css('left'));
					slideIndex = (listPos/devWidth)*(-1);
					
					if ( direction == "left" ) {					
						slideIndex = slideIndex+1;
						slideSwitcher(slideIndex);
					}
					if ( direction == "right" ) {
						slideIndex = slideIndex-1;
						slideSwitcher(slideIndex);
					}
				}
				
			}
			
			swipeOptions = {
				swipe:swipe,
				threshold:80,
				allowPageScroll:'vertical'
			}
			swipeOptionsMenu = {
				swipe:swipe,
				threshold:80,
				allowPageScroll:0
			}
			
			$(function() {			
				$("#slider").swipe( swipeOptions );
				$("#main_menu").swipe( swipeOptionsMenu );
			});
			
			$("#slider_controls .next").click(function(){
				var devWidth = $('#slider').width();
				var listPos = parseInt($('#slide_list').css('left'));
				slideIndex = (listPos/devWidth)*(-1);
				slideIndex = slideIndex+1;
				slideSwitcher(slideIndex);
				return false;
			});
			
			$("#slider_controls .prev").click(function(){
				var devWidth = $('#slider').width();
				var listPos = parseInt($('#slide_list').css('left'));
				slideIndex = (listPos/devWidth)*(-1);
				slideIndex = slideIndex-1;
				slideSwitcher(slideIndex);
				return false;
			});
			
			$("#slider_navigation li a").click(function(){
				slideIndex = $(this).parent().index();
				slideSwitcher(slideIndex);
				return false;
			});
			
			// Slideshow function
			function slideShow() {
				slideIndex = $(".slides:visible:first").index();
				if (slideIndex < 0) {
					slideIndex = 0;				
				} else if (slideIndex == slidesLength-1) {
					slideIndex = -1;	
				}
				slideSwitcher(slideIndex);
				setTimeout(slideShow,5000);
			}
			
			
		}
	
	// Forms validation script
	
	function sendMail(obj,ajaxurl) {
		var form = obj.parent();
		dataString = form.serialize();
		if ( form.find('input[value=""]').not('button').length > 0 ) {
			form.find('input[value=""]:first').focus();
			return false;
		}
		$.ajax ({
			type:"POST",
			url:ajaxurl,
			data: dataString,
			success: function() {
				alert('Your message has been sent! Please click OK to reload the page');
				window.location.reload();
			}
		});
		
		return false;
	}
	
	$(".form_submit").click(function(){
		ajaxurl = $(this).parent().attr('action');
		sendMail($(this),ajaxurl);
		return false;
	});
	
	$("form :input:not(button)").focus(function(){
		$(this).parent().parent().find(".form_alert").animate({
			opacity:0
		},200,function(){
			$(this).hide();
		});
	});
	
});