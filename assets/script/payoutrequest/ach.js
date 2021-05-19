
var accountNumberInput, accountNumberBox, accountTargetNode
var routingCodeInput, routingCodeBox, routingTargetNode;
var bankNumberInput, branchNumberInput
var routingCodeHeight, accountNumberHeight
var elementSuccessClass, parentSuccessClass
var ACHElements = {};

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
        if ($("#hidden_country").val() == "CA"){
            
            bankNumberInput = document.getElementById("BankNumber");
            branchNumberInput = document.getElementById("BranchNumber");

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
        });
       
    }

    out.init = init;

})(ACHElements);


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
    validatedFields();
    $(".form-control-feedback").remove();
}

function setAccountNumber(routingNumber, accountNumber) {

    accountNumberBox.style.display = "none";
    accountNumberInput.value = accountNumber;

    if ($("#hidden_country").val() == "CA"){
        
        bankNumberInput.value = routingNumber.substring(0,3)
        branchNumberInput.value = routingNumber.substring(3,8)

        formElementSuccess(bankNumberInput);
        formElementSuccess(branchNumberInput);
       
    }else{

        if (routingCodeInput.value == "" || routingCodeInput.value != routingNumber) {
            routingCodeInput.value = routingNumber;
                
            formElementSuccess(routingCodeInput);
        }
    }
    
    formElementSuccess(accountNumberInput);
    validatedFields();
    $(".form-control-feedback").remove();
}

function validatedFields(){

    var requiredFields = $(".widget-autovalidate").find("input[required]").size() + $(".widget-autovalidate").find("select[required]").size();

   if ( $(".has-danger").size() == 0 && $(".has-success").size() >= requiredFields ){
   
        $("#payment_btn_submit").toggleClass("btn-primary", true);
        $("#payment_btn_submit").toggleClass("btn-disabled",false);
        $("#payment_btn_submit").prop('disabled', false);

   } else {

        $("#payment_btn_submit").toggleClass("btn-primary", false);
        $("#payment_btn_submit").toggleClass("btn-disabled", true);
        $("#payment_btn_submit").prop('disabled', true);
   }

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
    validatedFields();
    routingCodeInput.focus();
}

function resetAccountBox() {	
   
    accountNumberBox.style.display = "none";
    accountNumberInput.value = "";

    formElementReset(accountNumberInput);
   
    $(".form-control-feedback").remove();
    validatedFields();
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