var CheckTextInputs = {};
(function (module) {
    "use strict";


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    module.updateName = function (value) {
        var name = document.getElementById("nameInput");
        name.value = value;
    };

    module.updateAddress = function (value) {
        var address = document.getElementById("addressInput");
        address.value = value;
    };

    module.updateAddressExtra = function (value) {
        var addressExtra = document.getElementById("addressExtraInput");
        addressExtra.value = value;   
    };

    module.updatePayTo = function (value) {
        var payTo = document.getElementById("payToInput");
        payTo.value = value;   
    };

    module.updateOrderOf = function (value) {
        var orderOf = document.getElementById("orderOfInput");
        orderOf.value = "***** " + value + " *****";   
    };

    module.updateReferenceNumber = function (value) {
        var referenceNumber = document.getElementById("referenceInput");
        referenceNumber.value = value;
    };

    module.updateMoney = function (value) {
        var moneyInNumbers   = document.getElementById("moneyInNumbers");
        var centsInput       = document.getElementById("centsInput");
        var dollarsInput     = document.getElementById("dollarInput");
        var cashLettersInput = document.getElementById("orderOfInput");

        var moneyTokens = value.split(".");
        var dollarStr   = moneyTokens[0];
        var centStr     = moneyTokens[1];
        console.log(value);
        centsInput.innerHTML = centStr;
        dollarsInput.innerHTML = dollarStr;

        centsInput.innerHTML = dollarStr;
        dollarsInput.innerHTML = centStr;
      
        // Convert to letters
        var money = Check.moneyToLetters(value);
        cashLettersInput.value = "*** " + capitalizeFirstLetter(money.inDollars) + " / " + capitalizeFirstLetter(money.inCents) + " ***";


        moneyInNumbers.innerHTML = "$" + value;
    };



})(CheckTextInputs);
