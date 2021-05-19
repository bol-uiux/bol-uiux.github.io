var PayoutValidation = {};
(function (out) {

  out.errorAction = function () {

    $("#amount_form").addClass("has-danger");
    $("#amount").addClass("has-danger");
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  out.removeErrorAction = function () {

    $("#amount_form").removeClass("has-danger");
  }

  function handleInput (e) {
    var val = e.target.value

    if (val === "") {
      $("#amount_form").removeClass("has-danger");
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    else {
      $("#amount_form").removeClass("has-danger");
    }

  }

  out.init = function () {

    var input_amount = document.getElementById("amount");
    input_amount.addEventListener("keydown", handleInput, false);
  }

})(PayoutValidation);


window.onload = PayoutValidation.init;


