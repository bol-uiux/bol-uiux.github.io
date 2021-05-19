(function() {
    $(function() {
      $(".form-cashierwithdraw-new").each((index, ele) => {
        $(ele).cashierWithdraw();
      });
    });
  
    /** components */
  
    $.fn.cashierWithdraw = function() {
      var form = $(this);
      var input = form.find("input[name=WithdrawAmount]");
      var withdrawOptions = form.find(".cashier-withdrawoptions-item");
      var submitButtons = form.find("button[type=submit]");
      var submittedWithdrawType = null; // for easier inspection by JS below
      var NOROUND_INCREMENT = 10.0;
  
      function updateWithdrawOptions() {
        var value = parseFloat(input.val()) || 0;
        var isValidValue = value > 0;
  
        withdrawOptions.each(function(index) {
          var optionEl = withdrawOptions.eq(index);
          var min = parseFloat(optionEl.attr("data-min"));
          var max = parseFloat(optionEl.attr("data-max"));
          var isInRange = value >= min && value <= max;
  
          optionEl.find('button[type="submit"]').attr("disabled", !isInRange);
          optionEl.toggleClass(
            "cashier-withdrawoptions-item-disabled",
            isValidValue && !isInRange
          );
        });
      }
  
      submitButtons.on("click", function(evt) {
        var button = $(this);
        var action = button.attr("data-action");
        form.prop("action", action);
  
        submittedWithdrawType = button.attr("value");
      });
  
      form.on("submit", function(evt) {
        var value = parseFloat(input.val());
        // some types must or cannot be of certain increments
        if (value && !isAmountStepAllowed(submittedWithdrawType, value)) {
          evt.preventDefault();
          var modal = $(
            ".cashier-withdrawoptions-restrictedamount-modal[data-type=" +
              submittedWithdrawType +
              "]"
          );
          modal.modal("show");
          modal.find("output span").text(value); // show the value back to the user
        }
      });
  
      // some types must or cannot be of certain increments
      function isAmountStepAllowed(submitType, value) {
        var chosenButton = form.find(
          'button[value="' + submittedWithdrawType + '"]'
        );
        var chosenDiv = chosenButton.closest(".cashier-withdrawoptions-item");
  
        var disallowedStep = parseFloat(chosenDiv.attr("data-disallowedStep"));
        var requiredStep = parseFloat(chosenDiv.attr("data-requiredStep"));
  
        return (
          (!disallowedStep || value % disallowedStep !== 0) &&
          (!requiredStep || value % requiredStep === 0)
        );
      }
  
      $(".cashier-withdrawoptions-restrictedamount-modal").each(function() {
        var modalEl = $(this);
        var form = modalEl.find("form");
        var type = modalEl.attr("data-type");
  
        form
          .find("input")
          .closest(".widget-autovalidate")
          .data("validate", function(input) {
            var value = parseFloat($(input).val());
            return isAmountStepAllowed(type, value);
          });
      });
  
      input.on("input", throttle(updateWithdrawOptions, 150));
    };
  
    function throttle(funct, dur) {
      var timeout;
      return function() {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(funct, dur);
      };
    }
  })();