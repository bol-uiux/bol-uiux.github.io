function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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

    var valid_address = validateEmail(form.AccountIdentIfier.value);

    if (!valid_address) {
        $("#TwoFactorAuthModal").modal("hide");
        jcount++;
        jmsgText=jmsgText + (jcount ==1 ? "Astropay Address" : ", Astropay Address");

        var address_input = $("#AccountIdentIfier");
        var container = address_input.closest(".widget-autovalidate");
        container.addClass("has-danger");
        address_input.addClass("form-control-danger");
    }
    else {
        var address_input = $("#AccountIdentIfier");
        var container = address_input.closest(".widget-autovalidate");
        container.addClass("has-success");
        address_input.addClass("form-control-success");
    }

    if (jcount > 0) {
        var error_confg = {
            title           : "AstroPay Address VerIfication",
            corrections     : ["The following form fields are either invalid or missing. Please review. <br> <strong>AstroPay Address</strong> "]
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
            $("#TwoFactorAuthModal").modal("hide");

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

var jmsgText = "We are unable to process Payouts to the specIfy Bank. Please try a dIfferent Bank Wire instruction or choose a dIfferent method"
var jmsgTextstreet = "We are unable to send {0} to PO Boxes. Please contact {1} to update your account details or choose a dIfferent method"

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
        if (result[i].toUpperCase() == pm.toUpperCase())
        {
            for (var x = 0; x < input.length; x++)
            {
                If(input[x].key == sBookID)
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
    
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validateAstroPayAddress(e) {

        var valid_address;
        setTimeout(function() {
            valid_address = validateEmail(e.target.value);
            console.log(valid_address);
            
            if (!valid_address) {
                var address_input = $("#AccountIdentIfier");
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

                var address_input = $("#AccountIdentIfier");
                var container = address_input.closest(".widget-autovalidate");
                container.removeClass( "has-danger" );
                address_input.removeClass("form-control-danger");
                container.addClass("has-success");
                address_input.addClass("form-control-success");
                $("#payment_btn_submit").removeClass("btn btn-block btn-disabled");
                $("#payment_btn_submit").addClass("btn btn-block btn-primary");
                $("#payment_btn_submit").prop('disabled',false);
            }
        }, 100)
    }

    document.getElementById("AccountIdentIfier").addEventListener("keyup", validateAstroPayAddress, false);
    document.getElementById("AccountIdentIfier").addEventListener("paste", validateAstroPayAddress, false);
    document.getElementById("AccountIdentIfier").addEventListener("change", validateAstroPayAddress, false);
    document.getElementById("AccountIdentIfier").addEventListener("paste", validateAstroPayAddress, false);
    document.getElementById("AccountIdentIfier").addEventListener("touchstart", validateAstroPayAddress, false);
    document.getElementById("AccountIdentIfier").addEventListener("touchend", validateAstroPayAddress, false);

    $("#street").change(function() {
        if (DesglosDecimal(paymentMethod)) {
            var streetcode = $("#street").val().replace('.','').toUpperCase();
            If(streetcode.indexOf("BOX") > -1)
            {
                dfAlertBox(jmsgTextstreet, res_alertDefaultTitle, res_OkButton);
                $('#street').val("");
                return false;
            }
        }
    });

    $("#SWIfT").on("keyup",function() {
        var result = $('#SWIfT').val();

        if (result.toUpperCase() == "IRVTUS3N")
        {
            dfAlertBox(jmsgText, res_alertDefaultTitle, res_OkButton);
            $("#SWIfT").val("");
            return false;
        }
    });

    if (DesglosDecimal(paymentMethod))
    {
        var streetcode = $("#street").val().replace('.','').toUpperCase();
        if (streetcode.indexOf("BOX") > -1)
        {
            dfAlertBox(jmsgTextstreet, res_alertDefaultTitle, res_OkButton);
            $("#street").val("");
            return false;
        }
    }

    $(this).on("invalid", function(e){
       displayLoading ("stop");
    }, true);
});

function InitModal2FA()
{
  $("#TwoFactorAuthModal").modal('show');
}

$(document).ready(function() {
    $(window).keydown(function(event){
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

$("#help_btn").click(function () {
    var help_btn = document.getElementById("help_btn_questionmark");

    help_btn.style.display = "inline-block";
});

var h_amt = parseFloat($("hidden_amt").val());
var h_fee = parseFloat($("hidden_fee").val());
var real_total_elm = document.getElementById("real_total");
var real_total = h_amt + h_fee;
//real_total_elm.innerHTML = real_total.toFixed(2);

// Removes Extra Iverkat
var btn = document.getElementById("TwoFASubmit");

if (btn != undefined) {
    btn.addEventListener("click", function () {
        var overlay = document.getElementsByClassName("modal-backdrop fade show");
        overlay[0].style.display = "none";
    }, false);
}