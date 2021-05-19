(function() {
  if (location.search === "?__testloading") {
    // testing in development mode with no JS enabled
    return;
  }

  $(function() {
    $(".widget-autovalidate").each(function() {
      $(this).widgetAutoValidate();
    });
    $(".widget-formvalidate").each(function() {
      $(this).widgetFormValidate();
    });
  });

  /** components */

  /**
   * Auto validate inspects various attributes of the input.
   * Such as 'required', type, etc.
   * You can also make your own custom validation by attaching a data('validate') function
   * And having 'data-error-message' and 'data-success-message' attributes on the input.
   * See the cashier bonus field for an exmaple.
   */
  $.fn.widgetFormValidate = function() {
    var form = $(this);

    form.on("submit", function(evt) {
      var valid = true;
      form.find(".widget-autovalidate").each(function() {
        var input = getFieldControl(this);

        if (input.prop("disabled")) {
          // skip these fields
          return;
        }

        var fieldValid =
          input.length === 1 && validateInputAndApplyMarks(input);

        valid = valid && fieldValid;
      });

      if (!valid) {
        evt.preventDefault();
        //alert("Please check all fields");
      }
    });

    updateButtonState();

    $(window).on("load", updateButtonState);

    form.on("input change", updateButtonState);

    function updateButtonState() {

      var submit = form.find("button[type=submit]");
      
      //This apply only for payout with 2FA on
      if ($(submit).attr('id') === "TwoFASubmit"){
        
        submit = $("#payment_btn_submit");
      }

      var isValid = isFormValid();

      submit.toggleClass("btn-primary", isValid);
      submit.toggleClass("btn-disabled", !isValid);
      submit.prop('disabled', !isValid);
    }

    function isFormValid() {
      var formValid = true;

      form.find(".widget-autovalidate").each(function() {
        var control = getFieldControl(this);


        if (
          control.length == 1 &&
          !control.prop("disabled") &&
          !validateInput(control)
        ) {
          formValid = false;
          return false; // breaks iteration
        }
      });

      return formValid;
    }
  };

  function getFieldControl(container) {
    return $(container).find("input,select").filter(function() {
      return !!$(this).attr("name");
    });
  }

  $.fn.widgetAutoValidate = function() {
    var control = getFieldControl(this);

    control.on("focus", function() {
      $(this)
        .closest(".widget-autovalidate")
        .addClass("has-focus")
        .addClass("ever-focused");
    });

    if (control.is("input")) {
      control.on("input", onInput);
      control.on("blur", onBlur);

      if (control.is("input[type=date]") && control.prop("type") !== "date") {
        control.fallbackDatePicker();
      }
    }

    if (control.is("select")) {
      control.on("change", function() {
        onInput.apply(this, arguments);
        onBlur.apply(this, arguments);
      });
    }

    function onInput() {
      var input = $(this);
      var container = input.closest(".widget-autovalidate");
      clearMarks(input);
      container.toggleClass("has-value", !!input.val());
    }

    function onBlur() {
      validateInputAndApplyMarks($(this));
      control.closest(".widget-autovalidate").removeClass("has-focus");
    }

    // set the initial stuff
    onInput.apply(control);
  };

  $.fn.fallbackDatePicker = function() {
    var input = $(this);
    input.attr("type", "hidden");

    var $month = $(
      '<select class="form-control inline"><option value="">mm</option></select>'
    );
    var $day = $(
      '<select class="form-control inline"><option value="">dd</option></select>'
    );
    var $year = $(
      '<select class="form-control inline"><option value="">yyyy</option></select>'
    );

    for (var m = 1; m <= 12; m++) {
      $month.append($("<option>" + m + "</option>"));
    }

    $month.on("change", fieldChange);
    $day.on("change", fieldChange);
    $year.on("change", fieldChange);

    for (var d = 1; d <= 31; d++) {
      $day.append($("<option>" + d + "</option>"));
    }

    var maxYear = new Date().getFullYear() - 18;
    var minYear = maxYear - 123;
    for (var y = maxYear; y >= minYear; y--) {
      $year.append($("<option>" + y + "</option>"));
    }

    var container = $('<div class="form-datefallback"></div>');
    container.append($("<label></label>").text(input.attr("placeholder")));
    container.append($month);
    container.append($day);
    container.append($year);

    container.insertBefore(input);

    function fieldChange() {
      var d = parseInt($day.val(), 10);
      var m = parseInt($month.val(), 10);
      var y = parseInt($year.val(), 10);

      var validDate = d && m && y && d <= daysInMonth(y, m);

      if (validDate) {
        var str = [y, pad2(m), pad2(d)].join("-");
        input.val(str);
      } else {
        input.val("");
      }
    }

    function pad2(n) {
      return n < 10 ? "0" + n : n;
    }

    /**
     * Sneaky way of getting days in a month
     * by underflowing the month before it.
     */
    function daysInMonth(y, m) {
      var date = new Date();
      date.setDate(1);
      date.setFullYear(y);
      date.setMonth(m); // month after what we want (months start at 0 in js)
      date.setDate(0);
      return date.getDate();
    }
  };

  function implementationOfInputAndApplyMarks(input){

    var isValid = validateInput(input);
  
    if (isValid) {
      if ($(input).val()) {
        addTick(input);
      } else {
        // if valid and empty then doesn't deserve a tick
        clearMarks(input);
      }
    } else {
      addError(input);
    }

  }

  function validateInputAndApplyMarks(input) {
    
    var isValid

    if ($("#dataForLoad").val() == 1){

      setTimeout(function(){ 
    
        implementationOfInputAndApplyMarks(input);
      }, 1000);

    } else {
        
      implementationOfInputAndApplyMarks(input);

    }

    return isValid;
  }

  function validateInput(input) {
    var validationFunc =
      $(input).closest(".widget-autovalidate").data("validate") ||
      genericInputValidate;

    return validationFunc(input);
  }

  /** utilities */

  // fallback validation for inputs that don't have custom validation
  function genericInputValidate(input) {
    var value = input.val();
    var pattern = input.attr("pattern");
    var isRequired = input.prop("required");

    var validation = input.data("validation");
    if (validation) {
      return validation.call(input);
    }

    if (pattern) {
      var regex = pattern;

      return !!new RegExp("^" + regex + "$").test(value);
    }

    switch (input.attr("type")) {
      case "email":
        return validateEmail(input, value);

      case "number":
        return validateNumber(input, value);

      case "checkbox":
        return !input.prop("required") || !!input.prop("checked");

      case "radio":
        return (
          !input.prop("required") ||
          (!!input.prop("checked") ||
            !!input
              .closest("form")
              .find('input[name="' + input.attr("name") + '"]:checked').length)
        );
    }

    return isRequired ? !!(value && value.length) : true;
  }

  function validateEmail(input, val) {
    return !!val.match(/^[^@]+@([^@\.]+\.)+[^@\.]+$/);
  }

  function validateNumber(input, val) {
    var num = parseFloat(val);

    var min = input.attr("min");
    var max = input.attr("max");

    if (isNaN(num)) {
      return false;
    }
    if (min && num < parseFloat(min)) {
      return false;
    }
    if (max && num > parseFloat(max)) {
      return false;
    }

    return true;
  }

  function addError(input) {
    clearMarks(input);
    var container = input.closest(".widget-autovalidate");
    container.addClass("has-danger");
    input.addClass("form-control-danger");

    var errorMessage = input.attr("data-error-message");
    if (errorMessage) {
      addFeedback(input, errorMessage);
    }
  }

  function addTick(input) {
    clearMarks(input);
    var container = input.closest(".widget-autovalidate");
    container.addClass("has-success");
    input.addClass("form-control-success");

    var successMessage = input.attr("data-success-message");
    if (successMessage) {
      addFeedback(input, successMessage);
    }
  }

  function clearMarks(input) {
    var container = input.closest(".widget-autovalidate");
    container.removeClass("has-success has-danger");
    input.removeClass("form-control-success form-control-danger");

    // remove dynamically added error messages
    container.find('.form-control-feedback[data-dynamic="1"]').remove();
  }

  function addFeedback(input, message) {
    var container = input.closest(".widget-autovalidate");
    var CLS = "form-control-feedback";
    var feedback = $('<div class="' + CLS + '"></div>').text(message);
    feedback.attr("data-dynamic", "1"); // lets us know we can remove this
    container.find("." + CLS).remove();

    var group = container.find(".input-group");
    feedback.insertAfter(group.length ? group : input);
  }
})();