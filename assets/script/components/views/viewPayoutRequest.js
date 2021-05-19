(function () {



  var objDeviceInfoGlobalWebApp = document.getElementById('objDeviceInfoGlobalWebApp').value;
  var objDeviceInfoIos = document.getElementById('objDeviceInfoIos').value;
  var getPOFeesForJson = document.getElementById('getPOFeesForJson').value;
  var getCurrencySymbol = document.getElementById('getCurrencySymbol').value;
  var CADUSDRate = document.getElementById('CADUSDRate').value;
  var USDCADRate = document.getElementById('USDCADRate').value;
  var SbookID = document.getElementById('SbookID').value;
  var resRequiredFieldsMsg = document.getElementById('resRequiredFieldsMsg').value;
  var resAlertDefaultTitle = document.getElementById('resAlertDefaultTitle').value;
  var resOkButton = document.getElementById('resOkButton').value;
  var resFeeText = document.getElementById('resFeeText').value;
  var resFreeText = document.getElementById('resFreeText').value;

  checkConfirmation = true;

  function checkForValue(d) {
    //checks for null, empty, and whitespace only
    var reWhitespace = /^\s+$/
    return !(d == null || d.length == 0 || reWhitespace.test(d));
  }

  function assignvalues() {
    checkConfirmation = false;
    ContinueProcess();
  }

  function DesglosDecimal(value, pm) {
    var cadena = "MoneyGram/WesterUnion"
    var result;
    result = cadena.split("/");

    for (i = 0; i < result.length; i++) {
      if (result[i].toUpperCase() == pm.toUpperCase()) {
        return CheckDecimal(value)
      }
    }

    return result;
  }

  function CheckDecimal(inputtxt) {
    var decimal = parseFloat(inputtxt);
    var entero = parseInt(inputtxt, 10);
    if ((decimal - entero) == 0) {
      return true;
    } else {
      return false;
    }
  }

  function ChangeText(pm, text) {
    var cadena = "MoneyOrder/WestUnion/MoneyGram"
    var result;
    result = cadena.split("/");

    for (var i = 0; i <= result.length; i++) {
      if (result[i].toUpperCase() == pm.toUpperCase()) {
        text = text.replace("{0}", pm);

        return text;
      }
    }
  }


  function get_moneyorder_whole_numbers(min, max, balance) {

    var list = document.getElementById("moneyorder_interval_list");

    var i = min;

    while ((i <= max) && (i <= balance)) {

      var option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;

      list.appendChild(option);

      i += 500;

    }
  }

  function get_money_gram_whole_numbers(min, max) {
    var i;
    i = min;

    var list = document.getElementById("moneygram_interval_list");

    while ((i <= max)) {

      var option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;

      list.appendChild(option);

      i = i + 50;
    }

  }

  function get_cad_values(submitted_amt, avail_balance, usd_amt, usd_cad_rate, cad_usd_rate, oAmount) {

    var maxInCAD = avail_balance * usd_cad_rate;
    var list = document.getElementById("cad_money_interval_list");
    var usd_elem = document.getElementById("cash_delivery_usd_4");

    usd_elem.value = usd_amt; // Default USD

    // Inser Options based on CAD intervals...
    for (var i = 1; i < maxInCAD; i++) {

      i = i + 4;

      // Remember to add the keyword VAR, in order to avoid globals :)
      var option = document.createElement('option');
      option.value = i;
      option.innerHTML = i;
      if (oAmount == i) option.selected = true;
      list.appendChild(option);

    }

    // If the user changes a selecteed CAD Amount, recalcuate USD..
    $("#cad_money_interval_list").change(function (e) {

      var dropdown = e.target;
      var selectedValue = parseInt(dropdown.options[dropdown.selectedIndex].value);
      var CAD_USDRate = CADUSDRate;

      // Recalculated USD Amount
      usd_elem.value = (selectedValue * CAD_USDRate).toFixed(2);
    });

  }

  function editCashDeliveryModal(form) {

    // Pre-Calculations
    var USD_CADRate = USDCADRate;
    var CAD_USDRate = CADUSDRate;
    var OAmount = form.amount.value * USD_CADRate;
    var remainer = (OAmount * 10000) % 50000;
    OAmount = (OAmount * 10000 - remainer) / 10000;
    var USD_Amount = (OAmount * CAD_USDRate).toFixed(2);

    // Get Elements
    var cad_money_elem = document.getElementById("cash_delivery_canadian_money");
    var usd_money_conv_elem = document.getElementById("cash_delivery_usd_conv");
    var usd_money_elem = document.getElementById("cash_delivery_usd");
    var usd_money_elem3 = document.getElementById("cash_delivery_usd3");
    var cad_money_elem2 = document.getElementById("cash_delivery_cad");
    var cad_money_elem3 = document.getElementById("cash_delivery_cad3");

    // Fill those eleme4nts
    cad_money_elem.innerHTML = form.amount.value;
    usd_money_conv_elem.innerHTML = (form.amount.value * USD_CADRate).toFixed(2);
    usd_money_elem.innerHTML = USD_Amount;
    usd_money_elem3.innerHTML = USD_Amount;
    cad_money_elem2.innerHTML = OAmount;
    cad_money_elem3.innerHTML = OAmount;

    // Fill Dropdown (CAD Intervals and USD)
    get_cad_values(
      form.amount.value,
      form.AvailableBalance.value,
      USD_Amount,
      USD_CADRate,
      CAD_USDRate,
      OAmount
    );

  }

  // Changed variable name PM to payment_processor. Being more specific.
  function preProcessForm(form, payment_processor) {

    var loader = document.getElementById("app_load");
    var app = document.getElementById("app");

    loader.style.display = "inline";
    app.style.display = "none";
    // displayLoading ('start');

    Ajax.post(payment_processor, SbookID, function (success) {


      // displayLoading ('stop');
      if (success) {

        let formValueReady = form.amount.value !== ""

        if (formValueReady) {

          PayoutValidation.removeErrorAction();

          // Cash Delivery
          if (payment_processor == "CDelivery") {

            // Calculate Candian Rates
            editCashDeliveryModal(form);

            // Finished Calculating Canadian Rates, show modal.
            $('#cash_delivery_desclaimer').modal('show');

            // Did user comfirm? Submit form.
            $("#confirm_cash_delivery_desclaimer").on("click", function () {

              // Before we submit, let's get the selected value from the dropdown holding the CAD increments..
              var dropdown = document.getElementById("cad_money_interval_list");
              var selectedValue = parseInt(dropdown.options[dropdown.selectedIndex].value);
              form.amount.value = selectedValue; // We're adding the value before submitting...
              prepareFormSubmission(form, payment_processor); // Run it, because we done it!
            });
          }

          // Money Order
          else if (payment_processor === "MoneyOrder") {

            let min = document.getElementById("MoneyOrder_min").innerHTML.split(";")[1];
            let max = document.getElementById("MoneyOrder_max").innerHTML.split(";")[1];

            /*
                Note: Remember to parse properly to float
            */
            get_moneyorder_whole_numbers(
              500,
              parseFloat(max.replace(/,/g, '')),
              parseFloat(form.AvailableBalance.value.replace(/,/g, ''))
            );

            $('#moneyorder_desclaimer').modal('show');


            $("#confirm_moneyorder_desclaimer").on("click", function () {

              // Before we submit, let's get the selected value from the dropdown holding the CAD increments..
              var dropdown = document.getElementById("moneyorder_interval_list");
              var selectedValue = parseInt(dropdown.options[dropdown.selectedIndex].value);
              form.amount.value = selectedValue; // We're adding the value before submitting...
              prepareFormSubmission(form, payment_processor); // Run it, because we done it!
            });
          }

          // Money Gram
          else if (payment_processor === "MoneyGram") {


            // Create Dropdown Menu
            get_money_gram_whole_numbers(100, 300);

            // Not a whole amount? Show Modal
            if (!DesglosDecimal(form.amount.value, payment_processor)) {
              $('#money_gram_desclaimer').modal('show');

              $("#confirm_moneygram_desclaimer").on("click", function () {
                var dropdown = document.getElementById("moneygram_interval_list");
                var selectedValue = parseInt(dropdown.options[dropdown.selectedIndex].value);
                form.amount.value = selectedValue; // We're adding the value before submitting...
                prepareFormSubmission(form, payment_processor); // Run it, because we done it!
              });

            }
            // otherwise just submit form
            else prepareFormSubmission(form, payment_processor);

          }

          // Any other payment processors outside of the above, just submit...
          else prepareFormSubmission(form, payment_processor);
        } else {
          PayoutValidation.errorAction();
        }
      } else {


        loader.style.display = "none";
        app.style.display = "inline";
      }

      // Received Error Message

    });


  }

  function prepareFormSubmission(form, PM) {
    var jmsgText = "Person to person method can only be requested using whole numbers e.g, $100.00, $250.00. Please choose another amount without cents or another payout method.";
    var amount = $("#amount").val();
    if (amount != "")
      if (!DesglosDecimal(amount, PM)) return false;

    form.PaymentMethod.value = PM;
    if (checkForm(form)) form.submit();

  }

  function checkForm(form) {

    jcount = 0;
    jmsgText = "";
    if (checkForValue(form.PaymentMethod.value) == false) {
      jcount++;
      jmsgText += "<li><%=res_payoutMethodLabel%></li>";
    }

    if (checkForValue(form.amount.value) == false) {

      $("#amount").effect("highlight", {
        color: "#E2A7A7"
      }, 300).effect("highlight", {
        color: "#E2A7A7"
      }, 300, function () {
        $("#amount").focus(); //quirky in iOS
      });
      return false;

    }

    //Validate MoneyOrder vs Amount (multiple 500...)
    if (form.PaymentMethod.value == "MoneyOrder") {
      var minvalue;
      var maxvalue;
      $(".paymentmethodarea").each(function () {
        if (($(this).attr('id')) == "PayoutOptionMoneyOrder") {
          minvalue = $(this).data("min");
          maxvalue = $(this).data("max");
        }
      });

      if (multiple(form.amount.value, 500) == false) {
        dfConfirmBoxAmt("This payout method can only be requested in $500.00 increments.  Please choose another amount or another payout method. ", "Invalid Money Order Amount", "Yes", "No", ContinueProcess, form.amount, 500, maxvalue, form.AvailableBalance.value, 500);
        return false;
      }
    }


    if (jcount > 0) {

      jmsgText = "<ol class='bullet'>" + jmsgText + "</ol>"
      dfAlertBox(resRequiredFieldsMsg + jmsgText, resAlertDefaultTitle, resOkButton);
      return false;
    } else {

      //displayLoading ('start');
      return true; //essential (IE7/8)
    }
  }

  function ContinueProcess() {
    document.main.submit();
  }

  function toggleLearnMore(e, sectionID) {
    var section = $('#' + sectionID);
    section.slideToggle(400, function () {
      postMessageContentHeight()
    }); //resize parent frame if necessary
    var $image = $('#img' + sectionID);
    if ($image.hasClass('rotateRight')) {
      $image.removeClass('rotateRight').addClass('rotateReset');
    } else {
      $image.removeClass('rotateReset').addClass('rotateRight');
    }
  }

  function decenamultiple(valor) {
    for (a = 0; a < 10; a++) {
      resto = valor % 5;
      if (resto == 0) {
        return valor;
      }
      resto = valor % 10;

      if (resto == 0) {
        return valor;
      }
      valor = valor + 1;

    }
  }

  //TODO: multiple n
  function multiple(valor, multiple) {
    resto = valor % multiple;
    if (resto == 0)
      return true;
    else
      return false;
  }

  //TODO: move to a common place.
  function GetFee(pPaymentMethod, pAmount) {
    var result;
    var FlatFee, perc, min
    result = -1;

    var obj = $.parseJSON(getPOFeesForJson);

    $.each(obj, function () {

      if (pPaymentMethod == this.PaymentMethod) {

        if ((pAmount > parseFloat(this.LowerLimit)) && (pAmount <= parseFloat(this.UpperLimit))) {
          result = 0;

          FlatFee = parseFloat(this.FlatFee);
          perc = parseFloat(this.PercentageFee);
          min = parseFloat(this.MinimumFee);

          if (FlatFee != 0) {
            result = result + FlatFee;
          }
          if (perc != 0) {
            result = result + (perc * pAmount);
          }

          if ((min != 0) && (result < min)) {
            result = min;
          }

          return false;
        }
      }
    });

    return result;
  }

  //TODO: move to a common place.
  function GetFeeFormula(pPaymentMethod, pAmount) {
    var result;
    var FlatFee, perc, min
    result = " ";

    var obj = $.parseJSON(getPOFeesForJson);

    $.each(obj, function () {

      if (pPaymentMethod == this.PaymentMethod) {

        if (pAmount == 0) {
          result = this.FormulaGlobal
        } else {
          if ((pAmount > parseFloat(this.LowerLimit)) && (pAmount <= parseFloat(this.UpperLimit))) {
            result = this.FormulaByRange;
            return false;
          }
        }
      }
    });

    return result;
  }

  $(document).ready(function () {
    // givainc.com/labs/marquee_jquery_plugin.htm
    // $("#marquee").marquee({
    //     scrollSpeed: 10,
    //     pauseSpeed: 4000
    // });

    $("#amounttooltip").tooltip({
      show: {
        effect: 'fade'
      },
      track: false,
      open: function (event, ui) {
        setTimeout(function () {
          $(ui.tooltip).hide('fade');
        }, 2000);
      }
    });

    //for amount entry - this is like a throttle function
    //see http://benalman.com/projects/jquery-throttle-debounce-plugin/
    //TODO: add as a global function
    var delay = (function () {
      var timer = 0;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    $('#amount').on("keyup", function () { //filter payment options based on amount entered
      var amount = $('#amount').val();
      //add a delay/throttle to reduce UI effects
      delay(function () {
        if ((isValidDecimal(amount)) && (amount > 0)) {
          $(".paymentmethodarea").each(function () {
            //if amount outside min/max then fade the unavailable options
            if (($(this).data("min") > amount) || ($(this).data("max") < amount)) {
              $(this).fadeTo(300, .5).css("-webkit-filter", "grayscale(1)");
            } else {
              $(this).fadeTo(300, 1).css("-webkit-filter", "grayscale(0)");
            }
          });
          $(".paymentmethodfeecalc").each(function () {
            var PayoutFee = GetFee($(this).data("paymentmethod"), amount);
            if (isNaN(PayoutFee) == false && PayoutFee > 0) {
              $(this).html(getCurrencySymbol + PayoutFee.toFixed(2).replace(".00", ""));
              $(this).attr("title", resFeeText + ": " + GetFeeFormula($(this).data("paymentmethod"), amount));
              $(this).effect("highlight", {
                color: "#E2A7A7"
              }, 800);
            }
            if (PayoutFee == 0) {
              $(this).html(resFreeText);
            }
            if (PayoutFee == -1) { //Amount outside min/max limits was entered.
              if ($(this).data("feetext") != resFreeText) { //if fee is not Free set the Fee text to " - ". If it is free leave the "free fee" text.
                $(this).html(" -- ");
                $(this).effect("highlight", {
                  color: "#E2A7A7"
                }, 800);
              }
            }
          });

        } else { //not a decimal value- show all options
          $(".paymentmethodfeecalc").each(function () {
            $(this).html($(this).data("feetext"));
            $(this).attr("title", $(this).data("feetext"));
          });
          $(".paymentmethodarea").fadeTo(100, 1).css("-webkit-filter", "grayscale(0)");
        }
      }, 350); //end delay
    });

    //setup the fees on form load
    setTimeout(function () {
      $('#amount').triggerHandler("keyup");
    }, 50);

    //traverse the DOM assign onclick to all bigtext classes so that onclick applies to the paymentbutton
    $(".paymentmethodarea .bigtext").each(function () {
      $(this).on("click", function () {
        $(this).prev('.paymentbutton').click(); //trigger click on paymentbutton
      });
    });

    //Problem: Fixed element with input on iOS causes jumpy behaviour.
    //Solutions: remove focus on element on touchstart
    //			 during scroll set position to fixed
    //			 after scroll set position to absolute
    //			 the focus on input causes a scroll to fire in iOS
    //			 this is the cause of many of the issues
    //			 it behaves differently when in webapp mode


    //position the stickyribbon on scroll
    var objstickyribbon = $("#stickyribbon")
    if (objstickyribbon.length == 0) return;
    var stickyRibbonTop = objstickyribbon.offset().top - 10;


    if (objDeviceInfoIos) {
      //if the focus is on the amount field when starting to scroll,
      //then remove focus -iOS only
      $(document).on("touchstart", function () {
        if ($("#amount").is(":focus")) {
          $("#amount").blur(); //this helps fix iOS issues
        }
      });

    }

    if (objDeviceInfoGlobalWebApp) {
      $("#amount").on("focus", function () {
        setTimeout(function () {
          window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
          var winScroll = $(window).scrollTop();
          if (winScroll > stickyRibbonTop) {
            objstickyribbon.css({
              position: 'absolute',
              top: winScroll
            });
          } else {
            objstickyribbon.css({
              position: 'static',
              top: '0px',
              margin: '0px'
            });
          }
        }, 10);
      });
    }



    $(window).scroll(function () {
      var winScroll = $(window).scrollTop();
      if (winScroll > stickyRibbonTop) {
        $("#payoutfilterbanner").css({
          borderRadius: '0px'
        });
        if (objDeviceInfoIos) {

          //while scrolling make it fixed so it doesn't jump
          objstickyribbon.css({
            position: 'fixed',
            top: 0
          });

          clearTimeout($.data(this, 'scrollTimer'));
          $.data(this, 'scrollTimer', setTimeout(function () {
            //scrolling stopped since delay
            winScroll = $(window).scrollTop(); //recalc
            if (winScroll > stickyRibbonTop) {

              objstickyribbon.css({
                position: 'absolute',
                top: winScroll
              });
            } else {

              objstickyribbon.css({
                position: 'static',
                top: '0px',
                margin: '0px'
              });
            }
          }, 100));
        } else {
          objstickyribbon.css({
            position: 'fixed',
            top: 0
          });

        }
      } else {
        objstickyribbon.css({
          position: 'static',
          top: '0px',
          margin: '0px'
        });
        $("#payoutfilterbanner").css({
          BorderRadius: ''
        }); //reset it
      }
    });

  });
})();