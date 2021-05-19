var ErrorModal = {};
(function (out) {
    "use strict";

    out.showAndDismiss = function (config) {

        // var description = document.getElementById("general_error_modal_desc");

        if (config.title != ""){
            var title = document.getElementById("ErrorModalTitle");            
            title.innerHTML = config.title;
        }

        if (config.redirect != ""){

            $("#understood_btn").click(function(){
                window.location = config.redirect;
            });
        }

        if (config.hiddenButtonClose) {

            $("#buttonClose").css("display","none");
        }

        var error_list = document.getElementById("SubmissionErrorList");
        error_list.innerHTML = "";

        for (var i = 0; i < config.corrections.length; i += 1) {
            var item = document.createElement("li");
            item.innerHTML = config.corrections[i];
            error_list.appendChild(item);
        }

        $('#SubmissionErrorModal').modal('show');
    };

})(ErrorModal);