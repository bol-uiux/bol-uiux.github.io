var RemoveAd = {};
(function (out)  {
    "use strict";

    out.init = function () {
        var advertisement = document.getElementsByTagName("img")[0];
        advertisement.style.display = "none"; 
    }

})(RemoveAd);

/*
    Make sure not to call init on pageload. The image is never going to load, so just pick up the
    node and disable it. 
*/
RemoveAd.init();