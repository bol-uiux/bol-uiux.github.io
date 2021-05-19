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

	if (jcount > 0) {


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

var jmsgText = "We are unable to process Payouts to the specify Bank. Please try a different Bank Wire instruction or choose a different method"
var jmsgTextstreet = "We are unable to send {0} to PO Boxes. Please contact {1} to update your account details or choose a different method"

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

var AreaCodeisValid = false;
var AreaPhoneisValid = false;
    
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

    function validateMuchBetterPhoneArea(e){
        var valid_address = false;
        AreaCodeisValid= false;
        setTimeout(function() {
            
            if (document.getElementById('AreaCode').value.length>1  && (!isNaN(document.getElementById('AreaCode').value))){				 
                AreaCodeisValid=	valid_address = true;
            }           
                    
            if (!valid_address) {
                var address_input = $("#AreaCode");
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
                var address_input = $("#AreaCode");
                var container = address_input.closest(".widget-autovalidate");
                container.removeClass( "has-danger" );
                address_input.removeClass("form-control-danger");
                container.addClass("has-success");
                address_input.addClass("form-control-success");

                if(AreaCodeisValid== true && AreaPhoneisValid == true)
                { 
                    $("#payment_btn_submit").removeClass("btn btn-block btn-disabled");
                    $("#payment_btn_submit").addClass("btn btn-block btn-primary");
                    $("#payment_btn_submit").prop('disabled',false);
                }
            }
        }, 10);
    }
    
    function validateMuchBetterPhoneNumber(e){
        var valid_address = false;
        AreaPhoneisValid = false;

        setTimeout(function() {
            
            if (document.getElementById('PhoneNumber').value.length >= 5 && !isNaN(document.getElementById('PhoneNumber').value) ){				 
                AreaPhoneisValid = 	valid_address = true;
            }	 
                
            if (!valid_address) {
                var address_input = $("#PhoneNumber");
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

                var address_input = $("#PhoneNumber");
                var container = address_input.closest(".widget-autovalidate");
                container.removeClass( "has-danger" );
                address_input.removeClass("form-control-danger");
                container.addClass("has-success");
                address_input.addClass("form-control-success");

                if (AreaCodeisValid== true && AreaPhoneisValid == true){ 
                    $("#payment_btn_submit").removeClass("btn btn-block btn-disabled");
                    $("#payment_btn_submit").addClass("btn btn-block btn-primary");
                    $("#payment_btn_submit").prop('disabled',false);
                }
            }
        }, 10);
    }

    document.getElementById("AreaCode").addEventListener("keyup", validateMuchBetterPhoneArea, false);
    document.getElementById("AreaCode").addEventListener("paste", validateMuchBetterPhoneArea, false);
    document.getElementById("AreaCode").addEventListener("change", validateMuchBetterPhoneArea, false);
    document.getElementById("AreaCode").addEventListener("paste", validateMuchBetterPhoneArea, false);
    document.getElementById("AreaCode").addEventListener("touchstart", validateMuchBetterPhoneArea, false);
    document.getElementById("AreaCode").addEventListener("touchend", validateMuchBetterPhoneArea, false);

    document.getElementById("PhoneNumber").addEventListener("keyup", validateMuchBetterPhoneNumber, false);
    document.getElementById("PhoneNumber").addEventListener("paste", validateMuchBetterPhoneNumber, false);
    document.getElementById("PhoneNumber").addEventListener("change", validateMuchBetterPhoneNumber, false);
    document.getElementById("PhoneNumber").addEventListener("paste", validateMuchBetterPhoneNumber, false);
    document.getElementById("PhoneNumber").addEventListener("touchstart", validateMuchBetterPhoneNumber, false);
    document.getElementById("PhoneNumber").addEventListener("touchend", validateMuchBetterPhoneNumber, false);

    if (document.getElementById("MuchBetterIsDataValid").value =="1")
    {
        validateMuchBetterPhoneNumber(null);
        validateMuchBetterPhoneArea(null);
    }
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