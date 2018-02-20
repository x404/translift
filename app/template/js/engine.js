$(document).ready(function(){

	// карусель
	$('#foo1').owlCarousel({
		loop:false,
		nav:true,
		dots: true,
		items:1,
		autoplay : false,
		animateOut: 'fadeOut',
		autoplayTimeout : 6000,
		navText: ["", ""],
		autoHeight:true
	});


	// mobile-menu
	$('#navbar').each(function(){
		let $this = $(this),
			$link = $('.navbar-toggle'),
			$close = $('.close-menu'),

			init = function(){
				$link.on('click', openMenu);
				$close.on('click', closeMenu);
			},
			openMenu = function(e){
				e.preventDefault();
				$('body').addClass('o-menu');
			},
			closeMenu = function(e){
				e.preventDefault();
				$('body').removeClass('o-menu');
				$('#navbar').height('auto');
			};
		init();
	});	

	$(window).resize(function(){
		if ($('body').width() > 640) {
			$('body').removeClass('o-menu');
			$('#navbar').css('height', 'auto');
		}
	});




	// var thank = '<div class="thank text-center"><p>Спасибо за заказ продукта на нашем сайте. В ближайщее время с вами свяжутся наши менеджеры для уточнения всех деталей.</p></div>';
	var thankcallback = '<div class="thank text-center"><p>В ближайщее время с вами свяжутся наши менеджеры для уточнения всех деталей</p></div>';
	var errorTxt = 'Возникла ошибка при отправке заявки!';


	$('.tel').inputmask("+7(999)999-99-99");
	// validation forms
	$.validator.addMethod("validphone", function(value){
		if (Inputmask.isValid(value, { mask: '+7(999)999-99-99'})) return true
		else return false;
	},"");

	$('#callback-form').validate({
		rules: {
			name:{required : true},
			tel: {validphone:true}
		},
		errorPlacement: function(error, element) {
			if (element.attr('name') == 'name') {
				$(element).addClass('error')
			};
			if (element.attr('name') == 'tel'){
				$(element).addClass('error')
			};
		},
		submitHandler: function(form){
			var strSubmit=$(form).serialize();
			$(form).find('fieldset').hide();
			$(form).append('<div class="sending">Идет отправка ...</div>');
			$.ajax({
				type: "POST",
				url: $(form).attr('action'),
				data: strSubmit,
				success: function(){
					$(form).closest('.modal__body').html(thankcallback);
					startClock('callback');
				},
				error: function(){
					alert(errorTxt);
					$(form).find('fieldset').show();
					$('.sending').remove();
				}
			})
			.fail(function(error){
				alert(errorTxt);
			});
		}
	});


	// форма обратной связи
	$('#feedback-form').validate({
		submitHandler: function(form){
			var strSubmit=$(form).serialize();
			$(form).find('fieldset').hide();
			$(form).append('<div class="sending">Идет отправка ...</div>');
			$.ajax({
				type: "POST",
				url: $(form).attr('action'),
				data: strSubmit,
				success: function(){
					$(form).html(thankcallback);
				},
				error: function(){
					alert(errorTxt);
					$(form).find('fieldset').show();
				},
				always: function(){
					$('.sending').remove();					
				}
			})
			.fail(function(error){
				alert(errorTxt);
			});
		}
	});

	// форма обратной связи в подвале
	$('#feedback-form2').validate({
		submitHandler: function(form){
			var strSubmit=$(form).serialize();
			$(form).find('fieldset').hide();
			$(form).append('<div class="sending">Идет отправка ...</div>');
			$.ajax({
				type: "POST",
				url: $(form).attr('action'),
				data: strSubmit,
				success: function(){
					$(form).html(thankcallback);
					$(form).closest('.modal__body').find('.title').remove();
				},
				error: function(){
					alert(errorTxt);
					$(form).find('fieldset').show();
				},
				always: function(){
					$('.sending').remove();					
				}
			})
			.fail(function(error){
				alert(errorTxt);
			});
		}
	});
});

// =заглушка для IE
//event listener: DOM ready
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
//call plugin function after DOM ready
addLoadEvent(function(){
	outdatedBrowser({
		bgColor: '#f25648',
		color: '#ffffff',
		lowerThan: 'transform',
		languagePath: '/outdatedbrowser/lang/ru.html'
	})
});
// =/заглушка для IE



$(function(){
	$('.policy input').click(function(){
		var $this = $(this),
			$submit = $this.closest('.form-policy');

		if ($this.is(':checked')){
			$submit.removeClass('disabled');
			$submit.find('.input, .form-control, .submit, textarea, input[type=radio]').removeAttr('disabled');
		} else {
			$submit.addClass('disabled');
			$submit.find('.input, .form-control, .submit, textarea, input[type=radio]').attr('disabled', true);
		}
	})
});


$('body').on('click','[data-coord]', function(e) {
	e.preventDefault();
	var $this = $(this).data('coord').split(','),
		lat = $this[0],
		lon = $this[1];
	map.setCenter([lat, lon], 16);
});



var timer,
	sec = 3;


function showTime(sendform){
	sec = sec-1;
	if (sec <=0) {
		stopClock();

		switch (sendform){
			case 'qorder-form':
				$('.qorder__box .thank').fadeOut('normal',function(){
					$('.qorder__box .thank').remove();
					$('.qorder__box .form-control, .qorder__box textarea').val('');
				});
				break;
			case 'feedback-form':
				$('.feedback .thank').fadeOut('normal',function(){
					$('.feedback .thank').remove();
					$('.feedback .form-control, .feedback textarea').val('');
					$('.feedback__form fieldset').show();
				});
				break;
			case 'cart-form':
				$('.cart .thank').fadeOut('normal',function(){
					$('.cart .thank').remove();
					// $('.cart .form-control, .cart textarea').val('');
					// $('.cart__form fieldset').show();
				});
				break;	
			default:
			console.log(sendform);
				modal = $("#" + sendform);
				modal.fadeOut('normal',function(){
					modal.find('.md-close').trigger('click');
				});
				break;
		}
	}
}

function stopClock(){
	window.clearInterval(timer);
	timer = null;
	sec = 3;
}

function startClock(sendform){
	if (!timer)
		timer = window.setInterval("showTime('" + sendform + "')",1000);
}


// показываем второй  уровень меню
$(document).on('click', '.o-menu .folder > a, .o-menu .folder > span', function(e){
	e.preventDefault();
	var $this = $(this);
	$this.next('.subnav').slideToggle().prev().toggleClass('open');
})


// search logic
$(document).on('click', '.qsearch .submit', function(e){
	var str = $(this).closest('div').find('.form-control').val();
	if (isEmpty(str) || isBlank(str)){
		e.preventDefault();
	}	
})

function isEmpty(str) {
	return (!str || 0 === str.length);
}

function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}