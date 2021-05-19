var ManagePMFunctions = {};

/**
 * Turn on/off the icons associated to the payment methods 
 * according to the selected toggle button
 * @param {string} paymentMethodValue payment method it will be activate
 */
function checkToggleButtonsPaymentMethods(paymentMethodValue){

    if (paymentMethodValue == "bitcoin"){

        $("#btc-circle").addClass("payment-method-selected");
        $("#cc-circle").removeClass("payment-method-selected");
        $("#echeck-circle").removeClass("payment-method-selected");

        $("#btc-tick").removeClass("manage-payment-methods-hide");
        $("#cc-tick").addClass("manage-payment-methods-hide");
        $("#echeck-tick").addClass("manage-payment-methods-hide");

    } else if(paymentMethodValue == "creditCard"){

        $("#btc-circle").removeClass("payment-method-selected");
        $("#cc-circle").addClass("payment-method-selected");
        $("#echeck-circle").removeClass("payment-method-selected");

        $("#btc-tick").addClass("manage-payment-methods-hide");
        $("#cc-tick").removeClass("manage-payment-methods-hide");
        $("#echeck-tick").addClass("manage-payment-methods-hide");

    } else if(paymentMethodValue == "eCheck"){

        $("#btc-circle").removeClass("payment-method-selected");
        $("#cc-circle").removeClass("payment-method-selected");
        $("#echeck-circle").addClass("payment-method-selected");

        $("#btc-tick").addClass("manage-payment-methods-hide");
        $("#cc-tick").addClass("manage-payment-methods-hide");
        $("#echeck-tick").removeClass("manage-payment-methods-hide");
    }
}

/**
 * Return the payment method name ([0]) and payment method data ([1])
 */
function getPaymentMethodArray(){

    var paymentMethodID,paymentMethodValue,response 
    
    response = null;    
    
    paymentMethodID = $("input[name='payment-method-toggle']:checked").attr("id");

    if (paymentMethodID != undefined) {

        paymentMethodValue = $("#" + paymentMethodID).val();

        response = paymentMethodValue.split(":");
    }

    return response;
}

/**
 * Checks the corresponding payment method 
 */
function updateDefaultPaymentMethod(paymentMethodRadioButtonName,paymentMethodText,defaultPaymentMethod){

    $("input[name='" + paymentMethodRadioButtonName + "']").each(function(key,element){
            
        if (element.value == defaultPaymentMethod){
            
            setMakeDefaultTextOnOff(paymentMethodText,element.id);
            $("#" + element.id).attr("checked","checked");
        }
    });    
}

/**
 * Makes a ajax call to save the toggle button selection
 */
function paymentMethodToggleAction(){

    var paymentMethod,identifier,noDefaultPM
        
    paymentMethod = getPaymentMethodArray();
    identifier = paymentMethod[1];

    checkToggleButtonsPaymentMethods(paymentMethod[0]);               
    
    noDefaultPM = $("#NoDefaultPM").val();

    $.ajax({

        type: "POST",
        url : "/components/controllers/controllerManagePaymentMethod.asp",
        data : { Identifier: identifier,
                 NoDefaultPM: noDefaultPM,
                 Action: "SetDefaultPaymentMethod" },

        success: function (data) {

            data = JSON.parse(data);

            if (data.success == "True"){

                if (data.defaultCreditCard != undefined && data.defaultCreditCard != ""){
                    
                    updateDefaultPaymentMethod("default-cc",".default-cc-text",data.defaultCreditCard);
                }
            
                if (data.defaultECheck != undefined && data.defaultECheck != ""){
                    
                    updateDefaultPaymentMethod("default-ec",".default-ec-text",data.defaultECheck);
                }
            } else if(data.success == "False" && data.redirectURL != ""){

                location.href = data.redirectURL;  
            }   
        },
        error: function (err) {
            
        }
    });
}

/**
 * Adds or remove the css to make active/inactive the "Make Default" text
 * @param {*} classname 
 * @param {*} elementID 
 */
function setMakeDefaultTextOnOff(classname,elementID){

    $(classname).each(function(key,element){
        $(element).removeClass("manage-payment-methods-text-on");
        $(element).addClass("manage-payment-methods-text-off");
    });

    $("#" + elementID).parent().find(classname).removeClass("manage-payment-methods-text-off");
    $("#" + elementID).parent().find(classname).addClass("manage-payment-methods-text-on");
}

/**
 * Makes a ajax call to save the toggle button (credit card list) selection
 */
function creditCardToggleAction(){
    
    var elementID,identifier

    elementID = $("input[name='default-cc']:checked").attr("id");
   
    setMakeDefaultTextOnOff(".default-cc-text",elementID);
    identifier =  $("#" + elementID).val();

    $.ajax({

        type: "POST",
        url : "/components/controllers/controllerManagePaymentMethod.asp",
        data : { Identifier: identifier,
                 Action: "SetDefaultCreditCard" },

        success: function (data) {
            
            data = JSON.parse(data);

            if (data.success == "False" && data.redirectURL != ""){

                location.href = data.redirectURL;  
            } 
        },
        error: function (err) {
            
        }
    });
}

/**
 * Makes a ajax call to save the toggle button (echeck list) selection
 */
function echeckToggleAction(){
    
    var elementID,identifier

    elementID = $("input[name='default-ec']:checked").attr("id");
   
    setMakeDefaultTextOnOff(".default-ec-text",elementID);
    identifier =  $("#" + elementID).val();

    $.ajax({

        type: "POST",
        url : "/components/controllers/controllerManagePaymentMethod.asp",
        data : { Identifier: identifier,
                 Action: "SetDefaultEcheck" },

        success: function (data) {

            data = JSON.parse(data);

            if (data.success == "False" && data.redirectURL != ""){

                location.href = data.redirectURL;  
            } 
        },
        error: function (err) {
            
        }
    });
}

(function (out) {

    function init(){
        
        var paymentMethod
        
        paymentMethod = getPaymentMethodArray();

        if (paymentMethod != null){

            checkToggleButtonsPaymentMethods(paymentMethod[0]);   
        }

        $(".inp-default-pm").click(paymentMethodToggleAction);
        $(".inp-default-card").click(creditCardToggleAction);
        $(".inp-default-ec").click(echeckToggleAction);
    }

    out.init = init;

})(ManagePMFunctions);

$(document).ready(function() {
    
    ManagePMFunctions.init();		
});