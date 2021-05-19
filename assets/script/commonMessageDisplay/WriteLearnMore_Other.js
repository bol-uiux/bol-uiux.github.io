var WriteLearnMore_Other = {};
(function (ctx) {

    var commonMessageDisplay = {};
    function init() {
        commonMessageDisplay.WriteLearnMoreOtherLink = document.getElementById('aWriteLearnMoreOther');
        commonMessageDisplay.WriteLearnMoreOtherLink.addEventListener('click', promptHelpDialog, false);
        commonMessageDisplay.SbookID = document.getElementById('SbookID');
        commonMessageDisplay.RedirectURL = getRedirectURL(commonMessageDisplay.SbookID.value);
    }

    function getRedirectURL(sbookID) {
        if (sbookID === "1") {
            return "https://help.betonline.ag/knowledge-base/how-to-deposit-with-crypto-currency/";
        }
        return "https://promotions.sportsbetting.ag/payment-methods";
    }

    function promptHelpDialog(){
        window.open(commonMessageDisplay.RedirectURL,'_blank','width=1020,height=980');
    }

    ctx.init = init;

})(WriteLearnMore_Other);

WriteLearnMore_Other.init();