var CheckLayout = {};
(function (module) {
    "use strict";

    module.init = function () {

        var customerName    = document.getElementById("cstName");
        var customerStreet  = document.getElementById("cstStreet");
        var customerCity    = document.getElementById("cstCity");
        var customerFee     = document.getElementById("cstFee");
        var customerZip     = document.getElementById("cstZip");
        var customerRef     = document.getElementById("cstRef");
        var customerDesc    = document.getElementById("cstDesc");

        var feeTokens = customerFee.innerHTML.split("$")[1];

        CheckTextInputs.updateName(customerName.innerHTML);  
        CheckTextInputs.updateAddress(customerStreet.innerHTML);
        CheckTextInputs.updateAddressExtra(customerCity.innerHTML + "," + customerZip.innerHTML);
        CheckTextInputs.updateMoney(feeTokens);
        CheckTextInputs.updateReferenceNumber(customerRef.innerHTML);
        CheckTextInputs.updatePayTo(customerDesc.innerHTML);
    };
    
})(CheckLayout);

CheckLayout.init();
