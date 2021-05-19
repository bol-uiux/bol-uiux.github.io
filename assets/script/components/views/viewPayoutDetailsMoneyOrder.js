function checkForm(form) {
	var loader = document.getElementById("app_load");
    var app_view = document.getElementById("app");
    var sBookID = $('input[name ="SBookID"]').val();
    var paymentMethod = $('input[name ="PaymentMethod"]').val();

	loader.style.display = "inline";
	//used to save some error message space when the form is filled in poorly
	//form.SubmitBtn.disabled=true;
	jcount = 0;
	jmsgText = "";

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

	if (jcount > 0) {
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

			if (success){

				form.submit();

			}else{

				loader.style.display = "none";
				app_view.style.display = "inline";
			}

		});
	}
	return false
}

var jmsgText = "We are unable to process Payouts to the specify Bank. Please try a different Bank Wire instruction Or choose a different method"
var jmsgTextstreet = "We are unable to send {0} to PO Boxes. Please contact {1} to update your account details Or choose a different method"

var input = [
            {key:"1", value:"Player Services"},
            {key:"5", value:"Customer Services"},
            {key:"4", value:"LowVig Bettor Services"},
            {key:"7", value:"Customer Support Department"},
            {key:"9", value:"WC Support team"}
            ];

function DesglosDecimal(pm)
{
    var cadena = "MoneyOrder/XpressChk/MailCheck/CourierChk"
    var result;
    result = cadena.split("/");
    var sBookID = $('input[name ="SBookID"]').val();
    
    for (var i = 0; i < result.length; i++)
    {
        if(result[i].toUpperCase() == pm.toUpperCase())
        {
            for (var x = 0; x < input.length; x++)
            {
                if(input[x].key == sBookID)
                {
                    jmsgTextstreet = jmsgTextstreet.replace("{0}", pm);
                    jmsgTextstreet = jmsgTextstreet.replace("{1}", input[x].value);
                }
            }
            return true;
        }
    }

    return false;
}
    
$(document).ready(function() {
    var paymentMethod = $('input[name ="PaymentMethod"]').val();
    var res_alertDefaultTitle = $('input[name ="Res_alertDefaultTitle"]').val();
    var res_OkButton = $('input[name ="Res_OkButton"]').val();

    $('#street').change(function() {
        if(DesglosDecimal(paymentMethod))
        {
            var streetcode = $('#street').val().replace('.','').toUpperCase();
            if(streetcode.indexOf("BOX") > -1)
            {
                dfAlertBox(jmsgTextstreet, res_alertDefaultTitle, res_OkButton);
                $('#street').val("");
                return false;
            }
        }
    });

    $('#SWIFT').on("keyup",function() {
        var result = $('#SWIFT').val();

        if(result.toUpperCase() == "IRVTUS3N")
        {
            dfAlertBox(jmsgText, res_alertDefaultTitle, res_OkButton);
            $('#SWIFT').val("");
            return false;
        }
    });

    if(DesglosDecimal(paymentMethod))
    {
        var streetcode = $('#street').val().replace('.','').toUpperCase();
        if(streetcode.indexOf("BOX") > -1)
        {
            dfAlertBox(jmsgTextstreet, res_alertDefaultTitle, res_OkButton);
            $('#street').val("");
            return false;
        }
    }

    $(this).on('invalid', function(e){
        displayLoading ('stop');
    }, true);
});

function toggleModal2faDesktop () {
    // Removed upon ticket request
    //if (MoneyGram.mobileWarningAccepted()) InitModal2FA();
    InitModal2FA();
    
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
//real_total_elm.innerHTML = real_total.toFixed(2);


// Removes Extra Iverkat
var btn = document.getElementById("TwoFASubmit");

if (btn != undefined){
    btn.addEventListener("click", function () {
        var overlay = document.getElementsByClassName("modal-backdrop fade show");
        overlay[0].style.display = "none";
    }, false);
}