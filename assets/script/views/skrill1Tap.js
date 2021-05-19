"use strict";
/*
    Observations
    - Used IIFE in order to avoid global pollution. 
    - Avoided ES6 sugar in order to target older browsers

    API
    - Init: Calls before the app is ready, good when loading images already loaded @ DOM
    - Ready: Calls when the app is ready
*/
var Skrill1Tap = {};
(function (out) {

    function init () {

        // Arguments: className, x, y, iteration flag
        Utility.setSpriteByClassName("eNETS", -310, -2, false);
    }

    function ready () {}

    // Exports
    out.init    = init;
    out.ready   = ready;

})(Skrill1Tap);

Skrill1Tap.init();
window.onload = Skrill1Tap.ready;

