var WithdrawalDetails = {};
(function (out) {
    "use strict";

    function handleToggleBtn () {

        var label = document.getElementById("toggle_detail_btn");
        $("#toggle_details_arrow").toggleClass("arrow_up");
        if ($('.panel-collapse').attr('aria-expanded') === 'true') label.innerHTML = "Balance Breakdown";                
        else label.innerHTML = "Close";
              
    }

    function handleHelpButton (e) {

        // For some reason, the class this element uses gets set 
        // display: none after a click event. For this reason,
        // we're overwriting that below...
        var btn = document.getElementById("withdrawal_help_btn");
        btn.style.display = "inline-block";
    }

    function init () {

        $('#toggle_detail_btn').on('click', handleToggleBtn);
        $('#toggle_details_arrow').on('click', handleToggleBtn);
        $('#withdrawal_help_btn').on('click', handleHelpButton);

    }
    window.onload = init;

})(WithdrawalDetails);