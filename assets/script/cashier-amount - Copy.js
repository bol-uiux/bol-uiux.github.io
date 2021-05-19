(function() {
  $(function() {
    $(".form-cashier-deposit").cashierDepositForm();
  });

  /** components */

  $.fn.cashierDepositForm = function() {
    var PROMO_CODES = window.PROMO_CODES;
    var form = $(this);

    /** BONUS FIELD INPUT */

    {
      var bonusField = form.find(".widget-bonusfield");

      /*
        Add a custom validation function.
        This is picked up and handled by the validate.js widgetAutoValidate component.
      */
      bonusField.data("validate", function(input) {
        var val = $(input).val().toUpperCase();
        // empty value is okay
        return true;//!val || PROMO_CODES.hasOwnProperty(val);
      });
      bonusField.find("input").on("input", updateBonusMessage);

      /*
       Update the data-success-message attribute.
        This is picked up and handled by the validate.js widgetAutoValidate component.
      */
      function updateBonusMessage() {
        var input = $(this);
		
        var val = input.val().toUpperCase();
        var message = PROMO_CODES.hasOwnProperty(val) ? PROMO_CODES[val] : null;
		//var message = PROMO_CODES.hasOwnProperty(val) ? PROMO_CODES[val] : PROMO_CODES["UNKNOW"];
        input.attr("data-success-message", message);
      }

      // bonus selector
      $(".cashier-bonus-choose").on("click", function() {
        // select the value
        applyBonus($(this).attr("data-bonus-value"));
      });

      $(".cashier-bonus-othersubmit").on("click", function() {
        // select the value
        applyBonus($(".cashier-bonus-otherinput").val());
      });

      function applyBonus(val) {
        var input = bonusField.find("input");
        input.val(val);
        updateBonusMessage.apply(input);
        input.trigger("blur");

        // allow submit button to become valid
        $(".form-cashier-deposit").trigger("input");
      }

      $(
        '.cashier-bonus-modal a[data-toggle="collapse"]'
      ).on("click", function() {
        // for half a second, keep trying to scroll to the element
        // this ensures the call-to-action button can be seen without scrolling
        // we need to keep trying to scroll as the content expands in an animated fashion
        var offset = $(this).offset();
        var start = Date.now();
        var interval = setInterval(function() {
          console.log(offset.top);
          $(".cashier-bonus-modal")[0].scrollTop = offset.top;
          if (Date.now() - start > 500) {
            clearInterval(interval);
          }
        }, 30);
      });
    }

    /**** AMOUNT SELECTION ****/

    {
      var depositOptionButtons = form.find(".cashier-depositoptions button");
      var depositAmountInput = form.find("input[name=DepositAmount]");
		
      depositOptionButtons.each(function() {
        var value = $(this).val();

        // add commas
        value = "$" + window.formatCommaNumber(value);

        $(this).text(value);
      });

      depositOptionButtons.on("click", function() {
        var value = $(this).attr("value");
        setDepositAmount(value);
      });

      depositAmountInput.on("input",onUpdate);	  
	  //depositAmountInput.on("keypress",validateFloatKeyPress); tj
	  
      // initial state
      onUpdate();

      function setDepositAmount(value) {
        depositAmountInput.val(value);
        onUpdate();
      }

      function onUpdate() {		
		highlightButton();		
		displayFee();
      }

      function highlightButton() {
        var value = parseFloat(depositAmountInput.val()) || 0;		
        depositOptionButtons.each(function() {
          var button = $(this);
          var thisValue = parseFloat(button.val()) || 0;
          button.toggleClass("on", thisValue === value);
        });
      }

      function displayFee() {
        var value = parseFloat(depositAmountInput.val()) || 0;

        var feeEle = $(".cashier-deposit-feetip-text");
        var feeAmount = parseFloat(feeEle.attr("data-fee"));
        var total = value * (1 + feeAmount);

        feeEle.text(
          "+" +
            feeAmount * 100 +
            "% Fee " +
            (total > 0 ? "= Total of $" + total.toFixed(2) + " USD" : "")
        );
		
		var submit = form.find("button[type=submit]");
		submit.toggleClass("btn-disabled", false);
		submit.prop('disabled', false);
		submit.toggleClass("btn-disabled", false);
      }
		/*function validateFloatKeyPress(evt) {
			
			var el = $(this)[0];
			var charCode = (evt.which) ? evt.which : event.keyCode;
			var number = el.value.split('.');
			if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			//just one dot
			if(number.length>1 && charCode == 46){
				 return false;
			}
			//get the carat position
			var caratPos = getSelectionStart(el);
			var dotPos = el.value.indexOf(".");
			if( caratPos > dotPos && dotPos>-1 && (number[1].length > 1)){
				return false;
			}
			return true;
		}

		//thanks: http://javascript.nwbox.com/cursor_position/
		function getSelectionStart(o) {
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate()
				r.moveEnd('character', o.value.length)
				if (r.text == '') return o.value.length
				return o.value.lastIndexOf(r.text)
			} else return o.selectionStart
		}*/ 
	
    }	
  };
})();
