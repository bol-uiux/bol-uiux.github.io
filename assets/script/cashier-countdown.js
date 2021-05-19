(function() {
  
  $(function() {
    
    $(".cashier-countdown").cashierCountdown();

  });

  /** components */

  $.fn.cashierCountdown = function(e) {
    var startTime = Date.now();
    var el = $(this);
    var initialSecondsRemaining = el.attr("data-seconds-remaining");
    var redirectUrl = el.attr("data-redirect-url");
    var countdownType = el.attr("data-countdown-type");
    var interval = setInterval(update, 1000);

    // update right away
    update();

    function update() {

      var endTime = startTime + initialSecondsRemaining * 1000;
      var now = Date.now();
      //var now = startTime + (Date.now() - startTime) * 100; // test countdown 100 times faster (development)
      var milliRemaining = Math.max(0, endTime - now);
      var secondsRemaining = Math.round(milliRemaining / 1000);

      var timeStr;

      if (countdownType == "minutes"){

        var m = Math.floor(secondsRemaining / 60);
        var s = Math.round(secondsRemaining % 60);
        timeStr = m + ":" + (s < 10 ? "0" : "") + s;

      } else {

        timeStr = secondsRemaining
      }    

      el.text(timeStr);

      if (secondsRemaining === 0) {
        clearInterval(interval);

        if(redirectUrl != undefined)
          location.href = redirectUrl;
      }
    }
  };
  
})();
