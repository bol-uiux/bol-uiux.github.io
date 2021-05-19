function isNumber(e, BaseValue) {
    var charCode = (e.which) ? e.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
        return false;
    else {
        var len = e.srcElement.value.length;
        var index = e.srcElement.value.indexOf('.');
        if (index > 0 && charCode == 46) {
            return false;
        }

        if (index > 0) {
            var CharAfterdot = len - index;
            if (CharAfterdot > 2) {
                return false;
            }
        }

    }
}

(function () {
    if (location.search === "?__testloading") {
        // testing in development mode with no JS enabled
        return;
    }

    $(function () {
        $(".widget-autovalidate").each(function () {
            $(this).widgetAutoValidate();
        });
        $(".widget-formvalidate").each(function () {
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
    $.fn.widgetFormValidate = function () {
        var form = $(this);

        form.on("submit", function (evt) {
            var interval = setInterval(function (){
                top.postMessage({'SetTop':true}, $('#bol_xdm').val()); 
                clearInterval(interval);
            }, 5);

            var valid = true;

            //Save any logged data
            $.fn.saveUILog();
            $(".widget-autovalidate").each(function () {
                var input = getFieldControl(this);

                var fieldValid = input.length === 1 && validateInputAndApplyMarks(input);
                if (input.attr("name") == "CardNumber") {
                    fieldValid = true;
                }

                valid = valid && fieldValid;
            });

            if (!valid) {
                evt.preventDefault();
                $.fn.saveUILog();
                //alert("Please check all fields");
            }
        });

        updateButtonState();

        $(window).on("load", updateButtonState);

        form.on("input change", updateButtonState);

        function updateButtonState() {
            var submit = form.find("button[type=submit]");
            var isValid = isFormValid();
            
            submit.toggleClass("btn-primary", isValid);
            submit.toggleClass("btn-disabled", !isValid);
        }


        function checkCCVQD(item)
        {
            var localStorage = window.localStorage;
            var iqd  =  localStorage.getItem("IsQuickDeposit");

            var CCV = document.getElementById("CardCVC");
             if(iqd)
             { // CardCVC
                 if(CCV== null)
                 {
                    return true;
                 }else
                 {
                     if(CCV.value == "***")
                     {
                        return true;
                     }else if(CCV.value.length ==3)
                     {
                         return true;
                     }else
                     return false;
                 }
                  
             }else
             {
                 return true;
             }
        }

        function isFormValid() {
            var formValid = true;

            form.find(".widget-autovalidate").each(function () {
                var control = getFieldControl(this);
               
                if ((control.length == 1 && !validateInput(control))) {
                    formValid = false;
                    return false; // breaks iteration
                }
            });

            return formValid;
        }
    };

    function getFieldControl(container) {
        return $(container).find("input,select").filter(function () {
            return !!$(this).attr("name");
        });
    }

    $.fn.widgetAutoValidate = function () {
        var control = getFieldControl(this);

        control.on("focus", function () {
            $(this)
              .closest(".widget-autovalidate")
              .addClass("has-focus")
              .addClass("ever-focused");
        });

        control.on("keyup", function () {
            if (this.value != "") {
                $(this)
                .closest(".widget-autovalidate")
                .addClass("ever-touched")
            }
        });

        if (control.is("input")) {
            control.on("input", onInput);
            control.on("blur", onBlur);
            // if (control.is("input[name=DepositAmount]")) {
            //   control.on("keypress",isNumber(event,'DepositAmount'));
            // }

            if (control.is("input[type=date]") && control.prop("type") !== "date") {
                control.fallbackDatePicker();
            }
        }

        if (control.is("select")) {
            control.on("change", function () {
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

        function onBlur(e) {
            if (control.closest(".widget-autovalidate").hasClass("ever-touched")) {
                validateInputAndApplyMarks($(this));
                control.closest(".widget-autovalidate").removeClass("has-focus");
            }
            if ((($('#hdnSbookID').val() == "1" || $('#hdnSbookID').val() == "2") && $("#PromoID").val().toUpperCase() == "BOL1000") || ($('#hdnSbookID').val() == "5" && $("#PromoID").val().toUpperCase() == "SB1000")) {
                $.ajax({
                    url: '/components/include/PromoCodeService.asp',
                    method: "POST",
                    data: { Code: $("#PromoID").val(), ENC: $("#hdnEnc").val()},
                    dataType: 'text',
                    success: function (data) {
                        var minValue = parseFloat(data);
                        var currentValue = parseFloat($("#convertedamount").val());
                        if (minValue > 0 && currentValue < minValue) {
                            addWarning($("#PromoID"), data);
                            return false;
                        }
                        else {
                            clearMarks($("#PromoID"));
                        }
                    }
                })
            }
            else {
                clearMarks($("#PromoID"));
            }
        }
    };

    $.fn.fallbackDatePicker = function () {
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

    function validateInputAndApplyMarks(input) {
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

        var validation = input.data("validation");
        if (validation) {
            return validation.call(input);
        }

        if (pattern) {
            var regex = pattern;
            return !!new RegExp("^" + regex + "$").test(value);
        }

        switch (input.attr("id")) {
            case "CardCVC":
                return checkCCVQD(input);
        }

        switch (input.attr("type")) {
            case "email":
                return validateEmail(input, value);

            case "number":
                return validateNumber(input, value);
            case "checkbox":
                return !input.prop("required") || !!input.prop("checked");
        }

        return !!value.length;
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

        var errorMessage = input.attr("data-error-message") || (input.attr("placeholder")? "Required " + input.attr("placeholder"):input.attr("placeholder"));
        if (errorMessage) {
            addFeedback(input, errorMessage);
            $.fn.addUILog("messageError",'{"' + Date.now() + '":{"Message":"'+errorMessage+'","Value":"'+input.val()+'","Time":"'+Date()+'" }}');
        }
    }

    function addWarning(input, data0) {
        clearMarks(input);
        var container = input.closest(".widget-autovalidate");
        container.addClass("has-warning");
        
        input.addClass("form-control-danger");

        var errorMessage = input.attr("data-warning-message");
        if (errorMessage) {
            errorMessage = errorMessage.replace('{0}', data0);
            addFeedback(input, errorMessage);
        }
    }

    function addTick(input) {
        console.log(input);
        //clearMarks(input);
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
        container.removeClass("has-success has-danger has-warning");
        container.removeClass("has-success has-danger has-warning-sb");
        input.removeClass("form-control-success form-control-danger");

        // remove dynamically added error messages
        container.find('.form-control-feedback[data-dynamic="1"]').remove();
    }

    $.fn.clearMarks = clearMarks;

    function addFeedback(input, message) {
        var container = input.closest(".widget-autovalidate");
        var CLS = "form-control-feedback";
        var feedback = $('<div class="' + CLS + '"></div>').text(message);
        feedback.attr("data-dynamic", "1"); // lets us know we can remove this
        container.find("." + CLS).remove();

        if (input.attr("id") == "CardNumber"){
            var listArrow = container.find(".card-list-arrow");
            feedback.insertAfter(listArrow.length ? listArrow : input);
        }else{
            var group = container.find(".input-group");
            feedback.insertAfter(group.length ? group : input);
        }
    }
})();
