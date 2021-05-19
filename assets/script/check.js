var Check = {};
(function (check) {
    "use strict";

    // Question for Enrique: These values come in as NUMBERS right? Which means no commas! 
    // Lib doesn't support decimals, so we'll have to convert numbers to string and parse it. 
    function moneyToLetters (num, language) {

        if (typeof language != "undefined") writtenNumber.defaults.lang = language;
        
        var money = {
            inDollars: false,
            inCents:   false 
        };

        var parsedNumbers   = num.toString();
        var tokens          = parsedNumbers.split(".");
        var dollarToken     = tokens[0];
        var centsToken      = tokens[1];

        dollarToken = dollarToken.replace(/[, ]+/g, " ").trim().replace(/\s/g, ''); // Fixes comma issue

        // Contains cents
        if (typeof dollarToken !== "undefined" && typeof centsToken !== "undefined") {

            var dollars = Number(dollarToken);
            var cents   = Number(centsToken);


            money.inDollars = writtenNumber(dollars);
            money.inCents   = writtenNumber(cents);

            return money;
        }
        // Just good ol' dollars.
        else {
            var dollars = Number(dollarToken);
            money.inDollars = writtenNumber(dollars);
            return money;
        }
    }

    function updateInput (e) {
        var cash = moneyToLetters(e.target.value);
        var letters = document.getElementById("letters");

        if (cash.inDollars && cash.inCents) letters.innerHTML = cash.inDollars + " dollars and " + cash.inCents + " cents.";
        else if (cash.inDollars && !cash.inCents)  letters.innerHTML =  cash.inDollars + " dollars.";
        
    }

    // check.init = function () {
    //     var input = document.getElementById("moneyInput");
    //     input.value = "";
    //     input.addEventListener("keyup", updateInput, false);
    // };

    check.moneyToLetters = moneyToLetters;


})(Check);

//window.onload = Check.init;