var BankWire = {};
(function (out) {
    "use strict";

    var mobileWarningAccepted = false;
    var desktopConfirmationInformation = false;
    var intermediaryInfoNeeded = false;    

    out.mobileWarningAccepted = function () {
        return mobileWarningAccepted;
    }
    
    function handleDesktopDisclaimer(e) {
        if (!mobileWarningAccepted) {
            $("#payment_btn_submit").addClass("btn btn-block btn-primary");
            $('#payment_btn_submit').prop('disabled', false);
            mobileWarningAccepted = true;
        }
        else {
            $("#payment_btn_submit").removeClass("btn btn-block btn-primary");
            $("#payment_btn_submit").addClass("btn btn-block btn-disabled");
            $('#payment_btn_submit').prop('disabled', true);
            mobileWarningAccepted = false;
        }
    }

    function handleDesktopConfirmationInformation(e) {
        if (!desktopConfirmationInformation) {
            $("#continue_to_step3").addClass("btn btn-block btn-primary");
            $('#continue_to_step3').prop('disabled', false);
            desktopConfirmationInformation = true;
        }
        else {
            $("#continue_to_step3").removeClass("btn btn-block btn-primary");
            $("#continue_to_step3").addClass("btn btn-block btn-disabled");
            $('#continue_to_step3').prop('disabled', true);
            desktopConfirmationInformation = false;
        }
    }

    function handleIntermediaryInfoNeeded(e){
        var elements = document.getElementsByClassName("intermediarybank");
        if(!intermediaryInfoNeeded) {            
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = "block";
            }
            intermediaryInfoNeeded = true;
        }
        else{
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = "none";
            }
            intermediaryInfoNeeded = false;
        }
    }

    function handleMobileStep (e) {
        e.preventDefault();

        if (mobileWarningAccepted) {

            var mobile_step = document.getElementById("monygram_mobile_warning");
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
                if (is_mobile === "False") {
                    domElement = "#payment_btn_submit";
                }
                else {
                    domElement = "#mobile_warning_confirm_btn";                
                }
    
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

    $(".moneygram_step2").hide();
    $(".moneygram_step3").hide();
    
    function handleContinueBtn (e) {
        e.preventDefault();
  
        $(".moneygram_step1").hide();
        $(".moneygram_step2").show();
        $(".moneygram_step3").hide();
    }

    function handleContinueStep3Btn (e) {
        e.preventDefault();
  
        $(".moneygram_step1").hide();
        $(".moneygram_step2").hide();
        $(".moneygram_step3").show();
    }

    window.onload = function () {

        var continueBtn = document.getElementById("continue_to_step2");
        if (continueBtn) {
            continueBtn.addEventListener("click", handleContinueBtn);
        }

        var continueStep3Btn = document.getElementById("continue_to_step3");
        if (continueStep3Btn) {
            continueStep3Btn.addEventListener("click", handleContinueStep3Btn);
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

        var desktopDisclaimerBtn = document.getElementById("desktop_disclaimer");
        if (desktopDisclaimerBtn) {
            desktopDisclaimerBtn.addEventListener("click", handleDesktopDisclaimer);
        }
        
        var desktop_confirmationBtn = document.getElementById("desktop_confirmation");
        if (desktop_confirmationBtn) {
            desktop_confirmationBtn.addEventListener("click", handleDesktopConfirmationInformation);
        }

        if($('#IntermediaryBankName').length > 0 && $('#IntermediaryBankName').val() != '')
        {
            intermediaryInfoNeeded = true;
            document.getElementById("IntermediaryInfoNeeded").checked = intermediaryInfoNeeded;
        }

        var intermediaryInfoNeededBtn = document.getElementById("IntermediaryInfoNeeded");
        if (intermediaryInfoNeededBtn) {
            intermediaryInfoNeededBtn.addEventListener("click", handleIntermediaryInfoNeeded, false);
        }

        $('#Comments').attr('cols',Number($('#AccountIdentifier').attr('size'))+2);
    };

})(BankWire);