"use strict";
var CommonMessageEwallet = {};
(function (out) {

    function init () {

        Utility.hideNodesByTagName("img", false, 0); // Hid Pesky 404 ad image creating a border @ top of the page.
    }

    function ready ()  {}

    out.init = init;
    out.ready = ready;


})(CommonMessageEwallet);

CommonMessageEwallet.init();
window.onload = CommonMessageEwallet.ready;