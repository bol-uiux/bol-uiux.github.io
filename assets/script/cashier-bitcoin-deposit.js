(function() {
  var startTime = Date.now();

  $(function() {
    
    $(".cashier-bitcoin-deposit-countdown").cashierBitcoinDepositCountdown();
	
    $('.widget-chashier-bitcoin-textcopy').cashierBitcoinTextCopy();

    $('.widget-chashier-bitcoin-textcopyTAG').cashierBitcoinTextCopy();

  });




  /** components */

  $.fn.cashierBitcoinDepositCountdown = function() {
    var el = $(this);
    var initialSecondsRemaining = el.attr("data-seconds-remaining");
    var redirectUrl = el.attr("data-redirect-url");
    var interval = setInterval(update, 1000);

    // update right away
    update();

    function update() {
      var endTime = startTime + initialSecondsRemaining * 1000;
      var now = Date.now();
      //var now = startTime + (Date.now() - startTime) * 100; // test countdown 100 times faster (development)
      var milliRemaining = Math.max(0, endTime - now);
      var secondsRemaining = Math.round(milliRemaining / 1000);

      var m = Math.floor(secondsRemaining / 60);
      var s = Math.round(secondsRemaining % 60);

      var timeStr = m + ":" + (s < 10 ? "0" : "") + s;

      el.text(timeStr);

      if (secondsRemaining === 0) {
        clearInterval(interval);
        location.href = redirectUrl;
      }
    }
  };
  
   $.fn.cashierBitcoinTextCopy = function() {
    var el = $(this);
    
    var input = el.find('input');
    var noticeMessage = el.find('em');

    var timeout = null;

    // resize input to width of element

    input.on('click mouseup', function()
    {
      input.focus();
    });

    input.on('focus', function()
    {
		if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
			
		  var obj = $(input).get(0);
		  var editable = obj.contentEditable;
		  var readOnly = obj.readOnly;
		  obj.contentEditable = true;
		  obj.readOnly = false;
		  var range = document.createRange();
		  range.selectNodeContents(obj);
		  var sel = window.getSelection();
		  sel.removeAllRanges();
		  sel.addRange(range);
		  obj.setSelectionRange(0, 999999);
		  obj.contentEditable = editable;
		  obj.readOnly = readOnly;
		} else {
			input.select();
		}
		//input.select();
		clearTimeout(timeout);

		try {
			var successful = document.execCommand('copy');

			noticeMessage.addClass('active');
			noticeMessage.text('Copied to clipboard!');

			timeout = setTimeout( function(){
			  noticeMessage.removeClass('active');
			}, 3000);

		} catch (ignore) {
		// user should manually copy
		}

    });
  };  
})();
