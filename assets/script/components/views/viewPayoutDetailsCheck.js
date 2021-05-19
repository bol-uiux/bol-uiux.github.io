function checkForm(form) {
	var loader = document.getElementById("app_load");
    var app_view = document.getElementById("app");
    var sBookID = $('input[name ="SBookID"]').val();
    var paymentMethod = $('input[name ="PaymentMethod"]').val();

	loader.style.display = "inline";

	//used to save some error message space when the form is filled in poorly
	//form.SubmitBtn.disabled=true;
	jcount=0;
	jmsgText="";

	//this will iterate through the required fields created by the formbuilder
	for (var i=0; i < form.elements.length; i++) {
		var element = form.elements[i];
		var required=element.getAttribute("required")
		if ((required=='true') && (element.value=='')) {
			jcount++;
			jmsgText+="<li>" + element.name + "</li>";
		}

	}

	var address_input = $("#AccountIdentifier");
	var container = address_input.closest(".widget-autovalidate");
	container.addClass("has-success");
	address_input.addClass("form-control-success");

	if (jcount>0) {
		var error_confg = {
			title			: "",
			corrections		: [""]
		};
		app_view.style.display = "inline";

		ErrorModal.showAndDismiss(error_confg);
		loader.style.display = "none";

		return false;

	} else {
		loader.style.display = "inline";
		window.scroll({
			top:        0,
			left:       0,
			behavior:   'smooth'
        });
        
		app_view.style.display = "none";
		ValidatePayoutDetails.post(paymentMethod, sBookID, function (success) {
			$('#TwoFactorAuthModal').modal("hide");
			if (success) {
				form.submit();
			}else{
				loader.style.display = "none";
				app_view.style.display = "inline";
			}
		});
	}
	return false
}

var jmsgText = "We are unable to process Payouts to the specify Bank. Please try a different Bank Wire instruction or choose a different method"
var jmsgTextstreet = "We are unable to send {0} to PO Boxes. Please contact {1} to update your account details or choose a different method"

var input = [
                {key:"1", value:"Player Services"},
                {key:"5", value:"Customer Services"},
                {key:"4", value:"LowVig Bettor Services"},
                {key:"7", value:"Customer Support Department"},
                {key:"9", value:"WC Support team"}
            ];

function toggleModal2faDesktop () {
    if (Check.mobileWarningAccepted()) {
        InitModal2FA();
    }
}

function InitModal2FA()
{
    $('#TwoFactorAuthModal').modal('show');
}

$(document).ready(function() {
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
        	event.preventDefault();
        	return false;
        }
    });
});

$("#help_btn").click(function () {
    var help_btn = document.getElementById("help_btn_questionmark");
    help_btn.style.display = "inline-block";
});

var h_amt = parseFloat(document.getElementById("hidden_amt").value);
var h_fee = parseFloat(document.getElementById("hidden_fee").value);
var real_total_elm = document.getElementById("real_total");
var real_total = h_amt + h_fee;

// Removes Extra Iverkat
var btn = document.getElementById("TwoFASubmit");

if (btn != undefined){
    btn.addEventListener("click", function () {
        var overlay = document.getElementsByClassName("modal-backdrop fade show");
        overlay[0].style.display = "none";

    }, false);
}