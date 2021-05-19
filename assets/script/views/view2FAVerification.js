(function () {

  var form = document.forms[0];
  var code = document.getElementById('VerificationCode');
  var submit = document.getElementById('submit2facode');
  var codesDepletedWrapper = document.getElementById('two-fa-codes-depleted');
  var mainLayoutWrapper = document.getElementById('main-layout');
  var resendEmailBtn = document.getElementById('resend-twofactor-email');
  var resendPhoneBtn = document.getElementById('resend-twofactor-phone');
  var resendFeedbackPhone = document.getElementById('resend-feedback-phone');
  var resendFeedbackEmail = document.getElementById('resend-feedback-email');
  var cashierCountdown = document.getElementById('cashier-countdown');
  var inputRadios = document.querySelectorAll('input[type="radio"]');
  var customerEmail = document.getElementById('hidden_user_email');
  var customerPhone = document.getElementById('hidden_user_phonenumber');
  var waitingTime = document.getElementById('waiting-time');
  var extendedQueryString = document.getElementById('extended_query_string');
  var comments = document.getElementById('Comments');
  var oneSec = 1000;
  var attempts = 3;

  function resendTwoFACode(e) {



    var twoFactorType = 'Email';
    var formData = {};
    if (e.target.id === 'resend-twofactor-phone') twoFactorType = 'Phone';
    formData = {
      TwoFactorType: twoFactorType,
      Action: "Resend",
      TraceID: form.children.TraceID.value,
      PIN: form.children.PIN.value
    }

    $.ajax({
      url: form.children.ActionRoute.value,
      method: 'POST',
      data: formData,
      beforeSend: function () {
        submit.disabled = true;
        resendFeedbackEmail.className = 'd-none';
        resendFeedbackPhone.className = 'd-none';
      },
      complete: function () {
        submit.disabled = false;
        if (e.target.className === "re-disabled-radio") {
          e.target.disabled = true;
          e.target.checked = false;
        }
      },
      success: function (response) {
        if (twoFactorType === 'Email') {
          resendFeedbackEmail.className = '';
          resendFeedbackPhone.className = 'd-none';
        } else {
          resendFeedbackEmail.className = 'd-none';
          resendFeedbackPhone.className = '';
        }

        if (e.target.className === "re-disabled-radio") {
          cashierCountdown.innerHTML = parseInt(waitingTime.value);
          setTimeout(function() {
            $(".cashier-countdown").cashierCountdown();
          },1000);
        }
      },
      error: function (response) {
        console.log(response);
      }
    });

  }

  resendEmailBtn.onclick = resendTwoFACode;
  resendPhoneBtn.onclick = resendTwoFACode;


  function isPayoutValid() {

    var response = false;

    ValidatePayoutDetails.post(paymentMethod, sbookID, function (success) {

        if (success){

          response = true;

        }
    });

  return response;
}

  form.onsubmit = function (e) {
    var viewsFilePath = './views/';
    var successURL = '';
    e.preventDefault();

    var formData = {
      Code: code.value,
      Action: form.children.Action.value,
      TraceID: form.children.TraceID.value,
      PIN: form.children.PIN.value,
      Attempts: attempts,
      Comments: comments.value
    }

    $.ajax({
      url: form.children.ActionRoute.value,
      method: 'POST',
      //contentType: 'application/x-www-form-urlencoded',
      data: formData,
      beforeSend: function () {
        submit.disabled = true;
      },
      complete: function () {
        if (attempts) submit.disabled = false;
      },
      success: function (response) {
        var status = parseInt(response);
        --attempts;

        if (!status && attempts) {
          $("#TwoFaMissmatch").modal('show');
        }

        if (!attempts && status != 1) {
          submit.disabled = true;
          submit.className = "btn btn-block btn-disabled";
          $("#" + codesDepletedWrapper.id).fadeIn(400);
          // codesDepletedWrapper.style.display = "block";
          mainLayoutWrapper.style.display = "none";
        }

        if( status == 1 ){

          if (!Utility.msieversion()) {
            successURL = viewsFilePath;
          } else {
              successURL = '.'
          }
          successURL += 'CustomerPayoutRequest.asp?payoutEnc=' + extendedQueryString.value;
          window.location = successURL;

        }else if( status == -1 ) {

          var error_confg = {
            title			: "Verification process already validated",
            corrections		: ["If you are unaware of this payout request, please contact our Security Department at your earliest convenience."]
          };

          ErrorModal.showAndDismiss(error_confg);
        
        }else if( status == -2 ) {

          var error_confg = {
            title			: "We’re sorry! Your request cannot be completed at this time.",
            corrections		: ["Your Available Balance is insufficient to carry out a payout request"],
            hiddenButtonClose : true,
            redirect      : $("#cashierMenuUrl").val()
          };

          ErrorModal.showAndDismiss(error_confg);
        }

        console.log(attempts);
      },
      error: function (response) {
        console.log(response);
      }
    });
  }

  window.onload = function (e) {

    setInterval(function () {
      if (parseInt(cashierCountdown.innerHTML) == 0)
        for (var i = 0; i < inputRadios.length; i++) inputRadios[i].disabled = false;

    }, oneSec);
  }
})();