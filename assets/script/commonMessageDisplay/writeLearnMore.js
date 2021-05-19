var WriteLearnMore = {};
(function (ctx) {

    var commonMessageDisplay = {};
    function init() {
        commonMessageDisplay.WriteLearnMoreLink = document.getElementById('aWriteLearnMore');
        commonMessageDisplay.WriteLearnMoreLink.addEventListener('click', promptHelpDialog, false);
        commonMessageDisplay.SbookID = document.getElementById('SbookID');
        commonMessageDisplay.RedirectURL = getRedirectURL(commonMessageDisplay.SbookID.value);
    }

    function getRedirectURL(sbookID) {
        if (sbookID === "1") {
            return "https://help.betonline.ag/knowledge-base/deposit-methods/";    
        }
        return "https://promotions.sportsbetting.ag/payment-methods-new";
    }

    function promptHelpDialog() {
        window.open(commonMessageDisplay.RedirectURL,'_blank','width=1020,height=980');
    }

    ctx.init = init;

})(WriteLearnMore);

WriteLearnMore.init();