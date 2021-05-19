var Check = {};
(function (out) {
    "use strict";

    var mobileWarningAccepted = false;

    out.mobileWarningAccepted = function () {
        return mobileWarningAccepted;
    }


    function handleMobileStep (e) {
        e.preventDefault();

        if (mobileWarningAccepted) {

            var mobile_step = document.getElementById("check_mobile_warning");
            mobile_step.style.display = "none";
    
            var app_body = document.getElementById("app_body");
            app_body.style.display = "inline";
        }

    }

    function handleMobileDesclaimer (e) {
        
        var is_mobile = document.getElementById("is_mobile").value;
        var domElement = "";
        
        var selection = window.getSelection();
        if (selection.type !== "Range") {
            
            if (e.target.className === "widget-autovalidate simple-bigcheckbox text-center" 
                || e.target.className === "simple-bigcheckbox-proxy") {
                mobileWarningAccepted = !mobileWarningAccepted;
    
                // console.log( selection.type !== "Range");
                // console.log($('#desclaimer_checkbox-event').html('Toggle: ' + $(this).prop('checked')));
                if (is_mobile === "False")  domElement = "#payment_btn_submit";
                else                        domElement = "#mobile_warning_confirm_btn";
                
    
                if (mobileWarningAccepted) {
        
                    $(domElement).removeClass("btn btn-block btn-disabled");
                    $(domElement).addClass("btn btn-block btn-primary");
                    $(domElement).prop('disabled', false);
                }
                else {
                    $(domElement).removeClass("btn btn-block btn-primary");                
                    $(domElement).addClass("btn btn-block btn-disabled");
                    $(domElement).prop('disabled', true);
                }
            }
        }
        else {
            domElement = "#payment_btn_submit";
            document.getElementById("desclaimer_checkbox").checked = false;
            $(domElement).removeClass("btn btn-block btn-primary");                
            $(domElement).addClass("btn btn-block btn-disabled");
            $(domElement).prop('disabled', true); 
        }

            
    }

    $(".check_step2").hide();
    
    function handleContinueBtn (e) {
        e.preventDefault();
  
        $(".check_step1").hide();
        $(".check_step2").show();

    }

    window.onload = function () {
        var continueBtn = document.getElementById("continue_to_step2");
        if (continueBtn) {
            continueBtn.addEventListener("click", handleContinueBtn);
        }

        var mobile_warning_btn = document.getElementById("mobile_warning_confirm_btn");
        if (mobile_warning_btn) {

            mobile_warning_btn.addEventListener("click", handleMobileStep, false);
        }

        var mobileDesclaimerBtn = document.getElementById("mobile_desclaimer");
        if (mobileDesclaimerBtn) {
            mobileDesclaimerBtn.addEventListener("click", handleMobileDesclaimer, false);
        }

        var mobile_desclaimer = document.getElementById("mobile_desclaimer");
        if (mobile_desclaimer) {
            mobile_desclaimer.style.display = "inline";

        }
        /*
            Leaving this here just in case there's a change of mind.
            Will remove once everything is approved. 
        */

        // Text input values too long? Make font size smaller.
        // var fontSizeSize = 14;

        // var emailLabel = document.getElementById("user_email");
        // var emailCharCount = emailLabel.value.length;

        // if (emailCharCount >= 20) {

        //     var userFirstName       = document.getElementById("user_firstname");
        //     var userLastName        = document.getElementById("user_lastname");
        //     var userContactNumber   = document.getElementById("user_contact_number");
        //     var userCountry         = document.getElementById("user_country");
        //     var userState           = document.getElementById("user_state");
        //     var userAddress         = document.getElementById("user_address");
        //     var userZip             = document.getElementById("user_zip");
        //     var userCity            = document.getElementById("user_city");

        //     emailLabel.style.fontSize           = fontSize + "px";
        //     userFirstName.style.fontSize        = fontSize + "px";
        //     userLastName.style.fontSize         = fontSize + "px";
        //     userContactNumber.style.fontSize    = fontSize + "px";
        //     userCountry.style.fontSize          = fontSize + "px";
        //     userState.style.fontSize            = fontSize + "px";
        //     userAddress.style.fontSize          = fontSize + "px";
        //     userZip.style.fontSize              = fontSize + "px";
        //     userCity.style.fontSize             = fontSize + "px";
        
        // }

    };

})(Check);