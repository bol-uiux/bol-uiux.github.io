"use strict";
var MobileCheckLayout = {};
(function (ctx) {

    var checkToggled = false;

    function updateOverlay () {
        var overlay = document.getElementById("checkOverlay");
        overlay.addEventListener("click", function () {
            var check = document.getElementById("checkContainer");
            var warning = document.getElementById("landscapePlease");

            warning.style.display = "none";
            check.style.display = "none";
            overlay.style.display = "none";

            var body = document.body;
            body.style.overflow = "scroll";

            checkToggled = false;

        }, false);
    }


    function showEcheck() {

        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


        if (h > w) {

            var warning = document.getElementById("landscapePlease");
            var check = document.getElementById("checkContainer");
            check.style.display = "none";

            var overlay = document.getElementById("checkOverlay");
            var body = document.body;
            body.style.overflow = "hidden";
            overlay.style.display = "inline";
    
            warning.style.position = "absolute";
            warning.style.margin = "auto auto";
            warning.style.left = "0";
            warning.style.right = "0";
            warning.style.top = "0";
            warning.style.bottom = "0";
            warning.style.display = "inline";
            warning.style.zIndex = 1000;
    
            window.scrollTo(0, 0);
    
            overlay.addEventListener("click", updateOverlay, false);

        }
        else {
            var warning = document.getElementById("landscapePlease");
            warning.style.display = "none";
            var overlay = document.getElementById("checkOverlay");
            var body = document.body;
            body.style.overflow = "hidden";
            overlay.style.display = "inline";
    
            var check = document.getElementById("checkContainer");
            check.style.position = "absolute";
            check.style.margin = "auto auto";
            check.style.left = "0";
            check.style.right = "0";
            check.style.top = "0";
            check.style.bottom = "0";
            check.style.display = "inline";
            check.style.zIndex = 1000;
    
            window.scrollTo(0, 0);
    
            overlay.addEventListener("click", updateOverlay, false);
        }
    }

    ctx.resize = function () {
        if (checkToggled) showEcheck();
    }

    function buttonPressed () {
        checkToggled = true;
        showEcheck();
    }

    function closeEverythingButton (e) {
        updateOverlay();
    }

    ctx.init = function () {
        window.onresize = ctx.resize;
        var button = document.getElementById("showCheckOnMobile");
        button.addEventListener("click", buttonPressed, false);
        
        var closeEverything = document.getElementById("closeOverlayBtn");
        closeEverything.addEventListener("click", closeEverythingButton, false);
    }


})(MobileCheckLayout);

MobileCheckLayout.init();