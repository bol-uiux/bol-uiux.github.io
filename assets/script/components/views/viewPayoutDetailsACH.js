$(document).ready(function() {

	$("#main").widgetFormValidate();	
	
	$(window).keydown(function(event){
		if(event.keyCode == 13) {
		event.preventDefault();
		return false;
		}
	});

	$(function(){
		var trigger = $('.echeck-example');
		var popover = $('.echeck-example-popover');
		
		$(popover).add(trigger).on('click', function(evt){
		evt.preventDefault();
		popover.toggleClass('show');
		});
	});

	$("#AdditionalDetails").change(function(){
		$(this).css("color","#464a4c");
	})
	
	ACHElements.init();			
});

function InitModal2FA(){

	$('#TwoFactorAuthModal').modal('show');
}

function checkForm(form) {

	var loader = document.getElementById("app_load");
    var app_view = document.getElementById("app");
    var sBookID = $('input[name ="SBookID"]').val();
    var paymentMethod = $('input[name ="PaymentMethod"]').val();

	loader.style.display = "inline";

	window.scroll({
		top:        0,
		left:       0,
		behavior:   'smooth'
	});
		
	app_view.style.display = "none";

	$('#TwoFactorAuthModal').modal("hide");

	ValidatePayoutDetails.post(paymentMethod, sBookID, function (success) {
		if (success){
			form.submit();
		}else{
			loader.style.display = "none";
			app_view.style.display = "inline";
		}
	});		
	return false
}