(function () {
    $(function () {
        $(".form-cashier-creditcard").cashierCreditcardForm();
        $("#UDefID").getCustomerDeviceInfo();
    });

    /** components */

    $.fn.cashierCreditcardForm = function () {
        var cardInputLength,cardInput;
        var form = $(this);

        cardInputLength = form.find('input[name="Plastic"]').length;
        //Handler in case there is incompatibility with other credit card forms.
        //TO-DO: once is confirmed that there is no incompatibility remove this validation.
        if (cardInputLength > 0) {
            cardInput = form.find('input[name="Plastic"]');
        } else {
            cardInput = form.find('input[name="CardNumber"]');
        }
        
        var expiryInput = form.find('input[name="CardExpiry"]');
        var cvcInput = form.find('input[name="CardCVC"]');
        var ssnInput = form.find('input[name="SSN"]');
        var cardTypeInput = form.find('input[name="CardType"]');
        var type = "";

        // initialize format handlers
        cardInput.payment("formatCardNumber");
        expiryInput.payment("formatCardExpiry");
        cvcInput.payment("formatCardCVC");
        ssnInput.payment("restrictNumeric");

        // supply validation logic to the validation class
        cardInput.data({
            validation: function () {
                var num = $(this).val();
                if (!/^\d+$/.test($(this).val())) {
                    if (!/\b^([0-9]{6})([*]+)([0-9]{4})/.test(num))
                        return true;
                    else
                        num = num.replace(/\*/g, "0");
                }
                type = $.payment.CardTypeReturn(num);
                cardTypeInput.val(type)
                return $.payment.validateCardNumber(num);

            }
        });
        expiryInput.data({
            validation: function () {
                var expiryBits = $(this).val().split("/");

                if (expiryBits.length != 2) {
                    return false;
                }

                var month = parseInt($.trim(expiryBits[0]));
                var year = parseInt($.trim(expiryBits[1]));

                return $.payment.validateCardExpiry(month, year);
            }
        });
        cvcInput.data({
            validation: function () {
                return $.payment.validateCardCVC(cvcInput.val());
            }
        });
        ssnInput.data({
            validation: function () {
                return $(this).val().length === 4;
            }
        });
    };
    $.fn.getCustomerDeviceInfo = function() {
        var d = new Date();
        var ntimezone = d.getTimezoneOffset();
        var obj = { "browser.userAgent": navigator.userAgent, "browser.javaEnabled": navigator.javaEnabled(),
                    "browser.language": navigator.language, "browser.screenHeight": screen.height,
                    "browser.screenWidth": screen.width, "browser.timezone": ntimezone};
        this.val(JSON.stringify(obj));
    };
})();
