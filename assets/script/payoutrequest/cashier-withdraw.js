var CashierWithdraw = {};
(function (out) {

  var input = false;
  out.input = false;


  function correct_amount (e) {

    // console.log(input.val());

    // var clean_chars = input.val().replace(/[^0-9]/g, '');
    // var clean_decimal_spaces = parseFloat(clean_chars.replace(/,/g, ''));

    // input.val(clean_decimal_spaces);

    // console.log(clean_decimal_spaces);
  }

  function updateWithdrawOptions() {

    Ajax.payment_type = "";
  
    // var value = parseFloat(input.val()) || 0;
    
    var value = input.val();

    // input.val(value.replace(/[^0-9]/g, ''));
    // Remove Warning Message initially 

    var container = input.closest(".widget-autovalidate");
    container.removeClass("has-success has-danger");
    input.removeClass("form-control-success form-control-danger");
    container.find('.form-control-feedback[data-dynamic="1"]').remove();
    document.getElementById("x_icon").style.display = "none";

    var pay_opts = document.getElementsByClassName("cashier-withdrawoptions-item");
    for (let i = 0; i < pay_opts.length; i += 1) {
      var provider = pay_opts[i];
      var paymentType = provider.dataset.payment;
      var jQueryBS = $(provider);
      var btn = document.getElementById(paymentType + "_main_btn");


      var min_opt     = document.getElementById(paymentType + "_min").innerHTML.split(";")[1];
      var max_opt     = document.getElementById(paymentType + "_max").innerHTML.split(";")[1];
      var min         = parseFloat(min_opt.replace(/,/g, ''));
      var max         = parseFloat(max_opt.replace(/,/g, ''));
	  var cust_balance = parseFloat(document.getElementById("AvailableBalance").value);

      // console.log("Value: " + value + " | Index: " + i +  " | Payment " + paymentType + " | Min: " + min + " | Max: " + max);
	  //var inRange = value >= min && value <= max && value > 0 && value <= cust_balance;
      var inRange = value >= min && value <= max && value > 0;
      if (!inRange) {
  
        btn.dataset.disabled = "true";
      
        // btn.disabled = true;
        jQueryBS.toggleClass("cashier-withdrawoptions-item-disabled", true); 
      }
      else {

        btn.dataset.disabled = "false";
        // btn.disabled = false;
        jQueryBS.toggleClass("cashier-withdrawoptions-item-disabled", false);
     
      }
    }
  }

  out.updateWithdrawOptions = updateWithdrawOptions;


  function throttle(funct, dur) {

    var timeout;
    return function() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(funct, dur);
    };
  }


  out.init = function () {

    input           = $("#amount");
    form            = $("test");
    withdrawOptions = $(".cashier-withdrawoptions-item");
    input.on("keyup", correct_amount);
    input.on("input", throttle(updateWithdrawOptions, 0));

    $('.icon-loading').each(function()
    {

        var ele = $(this);
        var count = 0;
        setInterval(function()
        {
        count++;
        ele.css({
            transform: 'rotate('+(count%12)*30+'deg)',
            '-webkit-transform': 'rotate('+(count%12)*30+'deg)'
        });
        }, 100);  
    });

    var warning_msg = document.getElementById("amount");
    if (warning_msg) {
      warning_msg.addEventListener("focusout", function (e) {
        if (Ajax.payment_type !== "") {
            Ajax.trigger_min_max_warning_message(Ajax.payment_type);
          }
          else {
  
          }
  
      });
    }

    //updateWithdrawOptions();

  }

})(CashierWithdraw);

$(document).ready(function() {
    CashierWithdraw.init();
});


