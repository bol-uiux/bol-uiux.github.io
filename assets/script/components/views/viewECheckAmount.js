
var accountNumberInput, accountNumberBox, accountTargetNode
var routingCodeInput, routingCodeBox, routingTargetNode;
var institutionNumberInput, transitNumberInput
var routingCodeHeight, accountNumberHeight
var elementSuccessClass, parentSuccessClass

var ECheckElements = {};
var ECheckAmount = {};

(function (ctx) {

    var eCheck = {};

    function init() {

        eCheck.form = document.getElementById('echeck-amount-form');
        eCheck.submit = document.getElementById('echeck-amount-submit');
        eCheck.amount = document.getElementById('DepositAmount');
        eCheck.currency = document.getElementById('CurrencyCode');
        eCheck.fee = document.getElementById('echeck-fee');
        eCheck.creditedAmount = document.getElementById('echeck-credited-amount');
        eCheck.usdCadSellRate = document.getElementById('usd-cad-sell-rate');
        eCheck.CADConversionResult = document.getElementById('cad-conversion-result');
        eCheck.feeTipText = document.getElementsByClassName('cashier-deposit-feetip-text');
        eCheck.GotoIOXS = document.getElementById('sendDataSubmit');
        eCheck.UrlRedirectVendor = ""
        eCheck.receipt_url = ""

        eCheck.wrapper = {};
        eCheck.wrapper.loading = document.getElementById('echeck-amount-loading-wrapper');
        eCheck.wrapper.form = document.getElementById('echeck-amount-form-wrapper');

        eCheck.form.addEventListener('submit', handleECheckFormSubmission, false);
        eCheck.GotoIOXS.addEventListener('click', GotoIOXSRedirect, false);
        $('#ModalEcheck').on('hidden.bs.modal', function () {
            var jLoading = $("#" + eCheck.wrapper.loading.id);
            var jForm = $("#" + eCheck.wrapper.form.id);
             
            jLoading.hide();
            jForm.show();
            dataLayerGAtoIBV('close', '');
        });
        if (eCheck.currency.value === "CAD")
            eCheck.amount.addEventListener('keydown', handleECheckAmountKeyDown, false);
            eCheck.amount.addEventListener('keyup', handleECheckAmountKeyUp, false);


            var circlebutton_small = document.getElementsByClassName("circlebutton-small");

            for (var i = 0; i < circlebutton_small.length; i++) {
                circlebutton_small[i].addEventListener('click', Calculate, false);
            }

    }

     function GotoIOXSRedirect()
     {
         dataLayerGAtoIBV('CTA', '');
        window.open(eCheck.UrlRedirectVendor,'_blank');
        window.location.href = eCheck.receipt_url;
     }

     
    function handleECheckFormSubmission(e) {
        
        if (e.preventDefault) e.preventDefault();
        var isInvalid;
        setTimeout(function() {

            if ($("#Country").val() == "CA"){

                var routingCode = institutionNumberInput.value + transitNumberInput.value;

                $("#RoutingCode").val(routingCode);
            }

            isInvalid = document.querySelectorAll('.form-control-danger').length;

            if (isInvalid) return false;

            var jLoading = $("#" + eCheck.wrapper.loading.id);
            var jForm = $("#" + eCheck.wrapper.form.id);
            $("#AmountShow").text($("#DepositAmount").val());
            jLoading.show();
            jForm.hide();
            //top.postMessage({'SetTop':true}, $('#bol_xdm').val()); 
            GADepositTrackingEcheck("attempt");
            SenDataController()//e.target.submit(); // Comment this out if you want to keep the screen on the loading screen.
        }, 5);
    }

    function SenDataController()
    {
         
       var datos = $("#" + eCheck.form.id).serialize();

       $.ajax({

        type: "POST",
        url : "/components/controllers/controllerProcessEcheck.asp?"+$("#querystring").val(),
        headers: { 'x-my-GUIDForm': $("#SSEcheckAmount").val() },
        data : datos,

        success: function (data) {
        
            try{
                data = JSON.parse(data);
                
                if(data.Error !=null)
                {
                    if(data.Error == "SessionEnd")
                    {
                        window.location.href  = data.url_login;
                    }else
                    {
                        ShowOuputError(data.MessageError);
                    }
          
                }else
                {   
                    ProcessJson(data);
                }
            }catch
            {
                ShowOuputError("");
								LaunchProactiveChat();
            }
        },
        error: function (err) {
            
        }
    });
    }

		/**
		 * Check if proactive chat for failed deposit is active to launch it
		 */
    function LaunchProactiveChat(){
			var proActiveChatDeclineDeposit = $("#ProActiveChatDeclineDeposit").val();
			var proactiveChatID = $("#ProactiveChatID").val();

			if (proActiveChatDeclineDeposit == "True"){
				Utility.depositFailLauchProactiveChat(inIframe(),proactiveChatID,false);                                        
			}
    }

    function ShowOuputError(error){
        var MainScren = $("#MainScren");
        var OutputError = $("#outputerror");
        
        MainScren.remove();
        OutputError.show();

        if(error.length>0)
        $("#DisclaineMessage").text(error);
        else
        $("#DivDisclaineMessage").hide();

        GADepositTrackingEcheck("fail"); 
    }

    function ProcessJson(data){
        eCheck.UrlRedirectVendor = data.processsor_url
            
            switch (data.status){
                case "Y":
                        window.location.href = data.receipt_url;
                        break;
                case "P":
                        if( data.processsor_url.length>0){
                            eCheck.UrlRedirectVendor = data.processsor_url;
                            eCheck.receipt_url = data.receipt_url;
                            $("#ModalEcheck").modal('show');
                            dataLayerGAtoIBV('show', '');
                        }else{
                            window.location.href = data.receipt_url;   
                        }
                        break;
                case "N":
                        ShowOuputError(data.MessageError);
                        LaunchProactiveChat();
                        break;
                default:
                        window.location.href = data.receipt_url; 
            }
    }

    function handleECheckAmountKeyDown(e) {
        try{ 
        eCheck.feeTipText[0].style.display = 'none';
        }catch(error)
        {}
    }

    function handleECheckAmountKeyUp(e) {
        if (e.preventDefault) e.preventDefault();

        if (eCheck.fee.value.length &&  eCheck.amount.value.length) {
            var amountWithFee;
            amountWithFee = parseFloat(eCheck.amount.value);
            
           try{ 
            eCheck.feeTipText[0].innerHTML = eCheck.feeTipText[0].innerHTML.substring(0, eCheck.feeTipText[0].innerHTML.length - 3) + " "+eCheck.currency.value;
           }catch(error)
           {}
            if ($("#Country").val() == "CA")
            {
                eCheck.creditedAmount.innerHTML = (amountWithFee / parseFloat(eCheck.usdCadSellRate.value)).toFixed(2);
                eCheck.CADConversionResult.style.display = 'inline';
            }else
            {

            }
            
        } else {
            eCheck.CADConversionResult.style.display = 'none';
        }

        eCheck.feeTipText[0].style.display = 'block'
    }


    function Calculate(evt)
    {
        var delayInMilliseconds = 0500; //1 second

        setTimeout(function() {
            handleECheckAmountKeyUp(evt);
        }, delayInMilliseconds);
        
    }

    ctx.init = init;
    ctx.Calculate = Calculate;

})(ECheckAmount);

ECheckAmount.init();

(function (out) {

    function init(){

        accountNumberHeight = $("#AccountNumber").outerHeight();

    	if ($("#RecentlyUsedAccountNumberBox").children().length === 0) $("#cardListArrow-an").hide();

        $("#AccountNumber").parent().css("height", accountNumberHeight);

        accountNumberInput = document.getElementById("AccountNumber");
        accountNumberBox = document.getElementById("RecentlyUsedAccountNumberBox");
        elementSuccessClass = " form-control-success";
        parentSuccessClass = " has-value has-success";
        accountTargetNode = accountNumberInput.parentElement;

        //if the country is Canada
        if ($("#Country").val() == "CA"){

            institutionNumberInput = document.getElementById("InstitutionNumber");
            transitNumberInput = document.getElementById("TransitNumber");

        }else{

            routingCodeHeight = $("#RoutingCode").outerHeight();

            if ($("#RecentlyUsedRoutingNumberBox").children().length === 0) $("#cardListArrow-rt").hide();

            $("#RoutingCode").parent().css("height", routingCodeHeight);

            routingCodeInput = document.getElementById("RoutingCode");
            routingTargetNode = routingCodeInput.parentElement;
            routingCodeBox = document.getElementById("RecentlyUsedRoutingNumberBox");
        }

        $("#RoutingCode, #AccountNumber, #cardListArrow-rt, #cardListArrow-an").on("click", function(e) {
            var formElement = e.target.id;

            if (formElement.search("cardListArrow") > -1) {
                if (formElement.substring(formElement.length - 2) === "rt") {
                    formElement = "RoutingCode";
                } else {
                    formElement = "AccountNumber";
                }
            }

            switch(formElement) {
                case "RoutingCode":
                    if ($("#RecentlyUsedRoutingNumberBox").children().length > 0) {
                        $("#RecentlyUsedRoutingNumberBox").toggle();
                        $("#RecentlyUsedAccountNumberBox").hide();
                        break;
                    }
                case "AccountNumber":
                    if ($("#RecentlyUsedAccountNumberBox").children().length > 0) {
                        $("#RecentlyUsedAccountNumberBox").toggle();
                        $("#RecentlyUsedRoutingNumberBox").hide();
                        break;
                    }
            }
            e.preventDefault();
            e.stopPropagation();
        });

        $(document).on("click", function (evt) {
            var routingCodeBx = $("#RecentlyUsedRoutingNumberBox");
            var accountNumberBx = $("#RecentlyUsedAccountNumberBox");
            //don't hide if the box was clicked/touched - checks if the target is under the parent
            var target = evt.target || window.event.srcElement;
            if (routingCodeBx.has(target).length === 0 && accountNumberBx.has(target).length === 0) {
                routingCodeBx.hide();
                accountNumberBx.hide();
            }

            
            //ECheckAmount.Calculate(evt);
        });

    }


    function SendData ()
    {

    }

    out.init = init;

})(ECheckElements);

function loadAccountInfo(routingNumber) {

    routingCodeBox.style.display = "none";

    if (routingCodeInput.value != routingNumber) {
        accountNumberInput.value = ""
        formElementReset(accountNumberInput);
    }

    routingCodeInput.value = routingNumber;

    if (routingCodeInput.nextElementSibling.className == "form-control-feedback") {
        var feedbackElement = routingCodeInput.nextElementSibling;
        routingCodeInput.parentNode.removeChild(feedbackElement);
    }

    for (var i = 0; i < accountNumberBox.firstElementChild.children.length; i++) {
        var accountsList = accountNumberBox.firstElementChild.children[i];

        if (accountsList.id.search(routingNumber) > -1 || accountsList.textContent.search("account number") > -1) {

                //Gets Account number from the li element text without the span value
                var firstAccountNumber = [].reduce.call(accountsList.childNodes, function(a, b) {
                    return a.trim() + (b.nodeType === 3 ? b.textContent : "");
                }, "");

                accountsList.style.display = "block";

        } else {

            accountsList.style.display = "none";

        }
    }

    formElementSuccess(routingCodeInput);
    $(".form-control-feedback").remove();
}

function setAccountNumber(routingNumber, accountNumber) {

    accountNumberBox.style.display = "none";
    accountNumberInput.value = accountNumber;

    if ($("#Country").val() == "CA"){

        institutionNumberInput.value = routingNumber.substring(1,4)
        transitNumberInput.value = routingNumber.substring(4,9)

        formElementSuccess(institutionNumberInput);
        formElementSuccess(transitNumberInput);

    }else{

        if (routingCodeInput.value == "" || routingCodeInput.value != routingNumber) {
            routingCodeInput.value = routingNumber;

            formElementSuccess(routingCodeInput);
        }
    }

    formElementSuccess(accountNumberInput);
    $(".form-control-feedback").remove();
}

function resetRoutingBox() {

    routingCodeBox.style.display = "none";

    routingCodeInput.value = "";
    accountNumberInput.value = "";

    for (var i = 0; i < accountNumberBox.firstElementChild.children.length; i++) {
        accountNumberBox.firstElementChild.children[i].style.display = "block";
    }

    formElementReset(routingCodeInput);
    formElementReset(accountNumberInput);


    $(".form-control-feedback").remove();
    routingCodeInput.focus();
}

function resetAccountBox() {

    accountNumberBox.style.display = "none";
    accountNumberInput.value = "";

    formElementReset(accountNumberInput);

    $(".form-control-feedback").remove();
    accountNumberInput.focus();
}

function formElementSuccess(e) {
    var parent = e.parentElement;

    formElementReset(e)

    e.className += elementSuccessClass;
    parent.className += parentSuccessClass;
}

function formElementReset(e) {
    var elementClassRg = new RegExp("form-control-(success|danger)", "g");
    var parentClassRg = new RegExp("has-(value|success|danger)", "g");
    var parent = e.parentElement;
    e.className = e.className.replace(elementClassRg, "");
    parent.className = parent.className.replace(parentClassRg, "");
}

function dataLayerGAtoIBV(e, status) {
    if ($("#currentGADepositTrackingSetting").val() == "1") {
        var eventName = '';
        switch (e) {
            case 'show':
                eventName = 'verification message shown';
                break;
            case 'close':
                eventName = 'verification message closed';
                break;
            case 'CTA':
                eventName = 'verification CTA clicked';
                break;
            case 'response':
                if (status === 'successful') {
                    eventName = 'successful';
                }
                if (status === 'failed') {
                    eventName = 'failed';
                }
                break;
            default:
                break;
        }
        if (eventName !== '') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'ga.event',
                'eventCategory': 'cashier',
                'eventAction': 'IBV process',
                'eventLabel': eventName
            });
        }
    }
}

$(document).ready(function(){

    ECheckElements.init();

    $(function(){
        var trigger = $('.echeck-example');
        var popover = $('.echeck-example-popover');

        $(popover).add(trigger).on('click', function(evt){
            evt.preventDefault();
            popover.toggleClass('show');
        });
    });
});