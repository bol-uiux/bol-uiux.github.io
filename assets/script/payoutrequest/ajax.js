var errorPage = "./views/viewPayoutErrorMessage.asp?Sportsbook=";
var viewsFilePath = './views/';

var Ajax = {};
function logout (sbookID) {

    var sportsbook = "bet+online";

    switch (sbookID) {

        case 1: sportsbook = "bet+online"; break;
        case 2: sportsbook = "sportsbetting"; break;
    }

    location.href = "/Login.asp?Sportsbook=" + sportsbook;
}


function trigger_min_max_warning_message (payment_type) {

    if (payment_type !== "") {


        var min_opt = document.getElementById(payment_type + "_min").innerHTML.split(";")[1];
        var max_opt = document.getElementById(payment_type + "_max").innerHTML.split(";")[1];

        var input = $("#amount");

        var msg = "Enter between $" + min_opt + " and " + "$" + max_opt;

        var container = input.closest(".widget-autovalidate");
        var CLS = "form-control-feedback";
        var feedback = $('<div class="' + CLS + '"></div>').text(msg);
        feedback.attr("data-dynamic", "1");
        container.find("." + CLS).remove();

        var group = container.find(".input-group");
        feedback.insertAfter(group.length ? group : input);

        container.addClass("has-danger");

        document.getElementById("x_icon").style.display = "inline";
    }
}

(function (out) {
    "use strict";

    out.payment_type = "";

    out.post = function (payment_type, sbookID, done) {


        var PIN = document.getElementById("hidden_pin").value;
        var sportsbook = document.getElementById("hidden_sportsbook").value;
        var amt = document.getElementById("amount").value;


       // CashierWithdraw.updateWithdrawOptions();

        // Getting btn and converting it's dataset boolean from str to bool. Never use Boolean() !!!!!
        var btn         = document.getElementById(payment_type + "_main_btn");
        var disabled    = (btn.dataset.disabled === "true");

        // If current button is not "fake disabled", check if we get a success or error ajax call
        if (!disabled) {

            // CALL AJAX HERE!

            $.ajax({
                type: "POST",
                url : "/components/views/PayoutRequestValidations.asp",
                data: {
                    "Sportsbook"    : sportsbook,
                    "PIN"           : PIN,
                    "Amount"        : amt,
                    "PaymentMethod" : payment_type,
                },
                success: function (payload) {
                    var list       = document.getElementById("SubmissionErrorList");
                    list.innerHTML = "";

                    switch (payload.status) {

                        case -1:
                                payload.redirectUrl = Utility.checkUrlToRedirectIE(viewsFilePath, payload.redirectUrl);
                                window.location = payload.redirectUrl;
                                break;

                        case 0: // OK
                            $("#requestForm").attr('action', payload.redirectUrl);
                            done(true);
                        break;

                        case 1: // Multiple Corrections
                        case 3:
                        case 5:

                            var numErrors       = payload.corrections.length;

                            for (var i = 0; i < numErrors; i += 1) {
                                var errorOpt        = document.createElement("li");
                                var hr              = document.createElement("hr");
                                hr.className        = "lightmargin";
                                errorOpt.innerHTML  = payload.corrections[i];

                                list.appendChild(hr);
                                list.appendChild(errorOpt);
                            }

                            $('#SubmissionErrorModal').modal('show');
                            done(false);
                        break;

                        case 2: // User Auth Failed
                        case 4:
                            var numErrors       = payload.corrections.length;

                            for (var i = 0; i < numErrors; i += 1) {
                                var errorOpt        = document.createElement("li");
                                var hr              = document.createElement("hr");
                                hr.className        = "lightmargin";
                                errorOpt.innerHTML  = payload.corrections[i];

                                list.appendChild(hr);
                                list.appendChild(errorOpt);
                            }


                            $('#SubmissionErrorModal').modal('show');

                            // ERR SubmissionErrorModal
                            $("#understood_btn").on("click", function () {
                                logout(sbookID);
                            });

                            $("#SubmissionErrorModal").on("click", function() {
                                logout(sbookID);
                            });

                            done(false);

                        break;

                    }
                },
                error: function (err) {

                    errorPage += sportsbook + "&PIN=" + PIN;  
                    window.location = Utility.checkUrlToRedirectIE(viewsFilePath,errorPage);
                }
            });

        }
        // If button is disabled, just return a false callback
        else {
            window.scroll({
                top:        0,
                left:       0,
                behavior:   'smooth'
            });

            trigger_min_max_warning_message(payment_type);
            done (false);
        }


    };

    out.trigger_min_max_warning_message = trigger_min_max_warning_message;

})(Ajax);

var ValidatePayoutDetails = {};

(function (out) {
    "use strict";

    out.payment_type = "";

    out.post = function (payment_type, sbookID, done) {

        var PIN = $('[name="PIN"]').val();
        var sportsbook =  $('[name="Sportsbook"]').val();

        // Getting btn and converting it's dataset boolean from str to bool. Never use Boolean() !!!!!
        var btn         = document.getElementById("payment_btn_submit");
        var disabled    = (btn.dataset.disabled === "true");
                
        // If current button is not "fake disabled", check if we get a success or error ajax call
        if (!disabled) {

            var formData = $("#main").serialize();

            // CALL AJAX HERE!

            $.ajax({
                type: "POST",
                url : "/components/views/PayoutDetailsValidations.asp",
                data : formData,

                success: function (payload) {

                    var isEnable2FA = $("#hiddenEnable2FA").val();
                    var list       = document.getElementById("SubmissionErrorList");
                    list.innerHTML = "";
                    
                    if (payload.redirectUrl != undefined && payload.redirectUrl != ""){

                        payload.redirectUrl = Utility.checkUrlToRedirectIE(viewsFilePath, payload.redirectUrl);
                    }

                    switch (payload.status) {

                        
                        case 0: // OK, redirect to success page

                                if (isEnable2FA == "True"){

                                    $("#PayoutTransaction").val(payload.payoutEnc);
                                    done(true);

                                }else {

                                    if(payload.payoutEnc == undefined){

                                        window.location = payload.redirectUrl;

                                    } else {
                                                                              
                                        window.location =  payload.redirectUrl + "?payoutEnc=" + payload.payoutEnc;
                                    }
                                }

                                break;

                        case -1: // Redirect to payout review or to error page 
                        case 6: 

                                window.location = payload.redirectUrl;
                                break;

                        case 1: // Multiple Corrections
                        case 3:
                        case 5:
                                showMultipleCorrections(payload,list);
                                done(false);
                                break;

                        case 2: // User Auth Failed
                        case 4:
                                showUserAuthFailed(payload,list,sbookID);
                                done(false);
                                break;
                    }
                },
                error: function (err) {

                    errorPage += sportsbook + "&PIN=" + PIN;  
                    window.location = Utility.checkUrlToRedirectIE(viewsFilePath,errorPage);
                }
            });

        }
        // If button is disabled, just return a false callback
        else {
            window.scroll({
                top:        0,
                left:       0,
                behavior:   'smooth'
            });

            done (false);
        }

    };

    
    /**
     * Shows in the modal SubmissionErrorModal the list of corrections contained in received json
     * @param {json} payload 
     */
    function showMultipleCorrections(payload,list){

        var numErrors       = payload.corrections.length;

        for (var i = 0; i < numErrors; i += 1) {
            var errorOpt        = document.createElement("li");
            var hr              = document.createElement("hr");
            hr.className        = "lightmargin";
            errorOpt.innerHTML  = payload.corrections[i];
            
            list.appendChild(hr);
            list.appendChild(errorOpt);
        }

        $('#SubmissionErrorModal').modal('show');
    }

    /**
     * Shows in the modal SubmissionErrorModal the list of corrections contained in received json,
     * if user authetication fail
     * @param {json} payload
     */
    function showUserAuthFailed(payload,list,sbookID){

        var numErrors       = payload.corrections.length;

        for (var i = 0; i < numErrors; i += 1) {
            var errorOpt        = document.createElement("li");
            var hr              = document.createElement("hr");
            hr.className        = "lightmargin";
            errorOpt.innerHTML  = payload.corrections[i];

            list.appendChild(hr);
            list.appendChild(errorOpt);
        }

        $('#SubmissionErrorModal').modal('show');

        // ERR SubmissionErrorModal
        $("#understood_btn").on("click", function () {
            logout(sbookID);
        });

        $("#SubmissionErrorModal").on("click", function() {
            logout(sbookID);
        });
    }

})(ValidatePayoutDetails);