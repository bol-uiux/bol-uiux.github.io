var DepositCount = {};
(function (depositCount) {
    "use strict";

    depositCount.updateLimit0 = function (value) {
        document.getElementById("limit0").innerHTML = value;
    };

    depositCount.updateLimit1 = function (value) {
        document.getElementById("limit1").innerHTML = value;
    };

    depositCount.updateAvailable0 = function (value) {
        document.getElementById("available0").innerHTML = value;
    };

    depositCount.updateAvailable1 = function (value) {
        document.getElementById("available1").innerHTML = value;
    };


})(DepositCount);


