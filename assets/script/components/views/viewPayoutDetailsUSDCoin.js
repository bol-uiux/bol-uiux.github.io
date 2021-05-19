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

	var valid_address =false;
    valid_address = WAValidator.validate(document.getElementById('AccountIdentifier').value, 'ethereum');

    if (!valid_address) {
		$('#TwoFactorAuthModal').modal('hide');
        jcount++;
		jmsgText=jmsgText + (jcount ==1 ? "USDC Coin Address" : ", USDC Coin Address");

		var address_input = $("#AccountIdentifier");
        var container = address_input.closest(".widget-autovalidate");
        container.addClass("has-danger");
        address_input.addClass("form-control-danger");
	}
	else {
		var address_input = $("#AccountIdentifier");
		var container = address_input.closest(".widget-autovalidate");
		container.addClass("has-success");
		address_input.addClass("form-control-success");
	}

	if (jcount > 0) {
 
		var error_confg = {
			title			: "USDC Coin Address Verification",
			corrections		: ["The following form fields are either invalid Or missing. Please review. <br> <strong>USDC Coin Address</strong> "]
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

    $('#Comments').attr('cols',Number($('#AccountIdentifier').attr('size'))+2);
    var paymentMethod = $('input[name ="PaymentMethod"]').val();
    var res_alertDefaultTitle = $('input[name ="Res_alertDefaultTitle"]').val();
    var res_OkButton = $('input[name ="Res_OkButton"]').val();

    function validateNetellerAccount(e){
        var valid_address;
        setTimeout(function() {
                
            valid_address = WAValidator.validate(document.getElementById('AccountIdentifier').value, 'ethereum');                

            if (!valid_address) {
                var address_input = $("#AccountIdentifier");
                var container = address_input.closest(".widget-autovalidate");

                container.removeClass( "has-success" );
                address_input.removeClass("form-control-success");

                container.addClass("has-danger");
                address_input.addClass("form-control-danger");

                $("#payment_btn_submit").removeClass("btn btn-block btn-primary");
                $("#payment_btn_submit").addClass("btn btn-block btn-disabled");
                $("#payment_btn_submit").prop('disabled',true);
            }
            else {

                var address_input = $("#AccountIdentifier");
                var container = address_input.closest(".widget-autovalidate");
                container.removeClass( "has-danger" );
                address_input.removeClass("form-control-danger");
                container.addClass("has-success");
                address_input.addClass("form-control-success");
                $("#payment_btn_submit").removeClass("btn btn-block btn-disabled");
                $("#payment_btn_submit").addClass("btn btn-block btn-primary");
                $("#payment_btn_submit").prop('disabled',false);
            }
        }, 10);
    }

    document.getElementById("AccountIdentifier").addEventListener("keyup", validateNetellerAccount, false);
    document.getElementById("AccountIdentifier").addEventListener("paste", validateNetellerAccount, false);
    document.getElementById("AccountIdentifier").addEventListener("change", validateNetellerAccount, false);
    document.getElementById("AccountIdentifier").addEventListener("paste", validateNetellerAccount, false);
    document.getElementById("AccountIdentifier").addEventListener("touchstart", validateNetellerAccount, false);
    document.getElementById("AccountIdentifier").addEventListener("touchend", validateNetellerAccount, false);

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

    // Removes Extra Iverkat
	var btn = document.getElementById("TwoFASubmit");

	if (btn != undefined){
		btn.addEventListener("click", function () {
			var overlay = document.getElementsByClassName("modal-backdrop fade show");
			overlay[0].style.display = "none";
		}, false);
	}
});