(function(){
    "use strict";

    var redirectModal       = document.querySelector("#redirectModal");
    var divAmountFee 		= document.querySelector(".amount-display-fee");
    var displayAmount 		= document.querySelector("#displayAmount");
    var displayAmountNoFee 	= document.querySelector("#displayAmountNoFee");
    var displayFee 			= document.querySelector("#displayFee");
    var amountCurrency 		= document.querySelectorAll(".amountCurrency");
    var submitRedirection   = document.querySelector("#submitRedirection");
    var submitAction 	    = document.querySelector("#submitAction");
    var modalCurrency       = document.querySelector("#modalCurrency");
    var amount 				= document.querySelector("#amount");
    var amountFee 			= document.querySelector("#amountFee");
    var amountWithoutFee 	= document.querySelector("#amountWithoutFee");
    var redirectForm 	    = document.querySelector("#redirectModalForm");

    function renderModalCurrency(currency) {
        for (const element of amountCurrency) {
            element.innerText = currency;
        }
    }

    function initalizeModalData(locale) {
        var currency                    = modalCurrency.value;
        displayAmount.innerText 		= new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(parseInt(amount.value));
        displayAmountNoFee.innerText 	= new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(parseInt(amountWithoutFee.value));
        displayFee.innerText 			= new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(parseInt(amountFee.value));

        renderModalCurrency(currency);

        if (amountFee.value == 0) {
            divAmountFee.style.display = "none";
        }
    }

    function handleSubmitAction(action) {
        switch (action) {
            case "redirect":
                window.open(redirectForm.action, redirectForm.target);
                break;
            case "submit":
                redirectForm.submit();
                break;
            default:
                break;
        }
    }

    function submitModal(e) {
        e.preventDefault();

        handleSubmitAction(submitAction.value);

        window.location.href="/components/views/viewCashierMenu.asp"+location.search;
    }

    function init() {
        if (typeof redirectModal !== 'undefined') {
            initalizeModalData('en-US');
            $("#redirectModal").modal("show");
            submitRedirection.addEventListener("click", submitModal);
        }
    }

    window.onload = init;
})()