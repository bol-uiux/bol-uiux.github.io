(function() {
  if (location.search === "?__testloading") {
    // testing in development mode with no JS enabled
    return;
  }

  window.formatCommaNumber = function(value) {
    var match = value.match(/^(\d+)(\d{3})(\.\d+)?$/);

    // add commas
    return match ? match[1] + "," + match[2] + (match[3] || "") : value;
  };

  $(function() {
    // 3rd party widgets
    $('[data-toggle="tooltip"]').tooltip();

    $(".widget-currenttime").each(function() {
      $(this).widgetCurrentTime();
    });
    $(".widget-autophoneprefix").each(function() {
      $(this).widgetAutoPhonePrefix();
    });
    $(".widget-viewpassword").each(function() {
      $(this).widgetViewPassword();
    });
    $(".widget-dialoglink").each(function() {
      $(this).widgetDialogLink();
    });
    $(".widget-modelcontents").each(function() {
      $(this).widgetModalContents();
    });
	 /* $(".widget-pushbottom").each(function() {
      $(this).widgetPushButton();
    }); */
    $(".widget-countup").each(function() {
      $(this).widgetCountUp();
    });
    $(".widget-iframeautoheight").each(function() {
      $(this).widgetIframeAutoHeight();
    });

    $(".widget-confirmlink").on("click", function() {
      var confirmCopy = $(this).attr("data-confirm");
      return confirmCopy ? window.confirm(confirmCopy) : true;
    });

    $(".IncreaseLimit").click(function(){
      $('.icon-close-grey').click();
       var input = document.getElementById("keyADIBP");      
      $.ajax({
        url: '/components/include/increaseLimitsFunctions.asp',
        method: "POST",
        data: JSON.parse(input.value),
        dataType: 'text'        
      }).always(function (data){  
        return true;
      });

    });

   /* $(".layout-graybarcontent").each(function() {
      $(this).add($(this).find(".layout-graybarcontent-inner")).css({
        "min-height": window.innerHeight + "px"
      });
    });*/
  });

  /** widgets */

  $.fn.widgetCurrentTime = function() {
    var el = $(this);

    var MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    updateTime();
    function updateTime() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var day = now.getDay();
      var date = now.getDate();
      var month = now.getMonth();

      var str = [
        hours % 12 || 12,
        ":",
        pad2(minutes),
        hours < 12 ? "am" : "pm",
        " - ",
        DAYS[day],
        ", ",
        date,
        " ",
        MONTHS[month]
      ].join("");

      el.text(str);

      var MIN = 60000;
      var timeToNextMinute = MIN - now % MIN;

      // wait a little longer so we avoid race conditions
      setTimeout(updateTime, timeToNextMinute + 1000);
    }

    function pad2(n) {
      return (n < 10 ? "0" : "") + n;
    }
  };

  $.fn.widgetCountUp = function() {
    var el = $(this);
    var value = parseFloat(el.attr("data-value"));
    var type = el.attr("data-type");
    var start = Date.now();
    var interval = setInterval(step, 16);
    step();

    function step() {
      var duration = 1000;
      var elapsed = Math.min(1, (Date.now() - start) / 1000);

      var stepValue = value * elapsed;
      var str;

      switch (type) {
        case "currency":
          str = "$" + formatCommaNumber(stepValue.toFixed(2));
          break;

        default:
          throw new Error("non-currency types not done yet");
      }

      el.text(str);

      if (elapsed === 1) {
        el.addClass("widget-countup-finished");
        clearInterval(interval);
      }
    }
  };

  $.fn.widgetPushButton = function() {
    var isMobile = screen.width < 768;

    var el = $(this);
    var offset = el.offset();
    var winHeight = isMobile ? window.innerHeight : 650;
    var bottomPadding = 20;

    var topPadding = Math.max(
      15,
      winHeight - offset.top - el[0].offsetHeight - bottomPadding
    );

    el.css({
      "padding-top": topPadding
    });
  };

  $.fn.widgetModalContents = function() {
    if (inIframe()) {
      // iframe handles modal content view
      return false;
    }

    repeatWhileOnPage(this[0], function() {
      $(this).css({
        "min-height": window.innerHeight + "px"
      });
    });
  };

  $.fn.widgetIframeAutoHeight = function() {
    var iframe = $(this);
    iframe.on("load", function() {
      var iframeEl = this;
      repeatWhileOnPage(iframeEl, resizeIframe.bind(null, iframeEl));
    });
  };

  $.fn.widgetDialogLink = function(el) {
    $(this).on("click", function(evt) {
      evt.preventDefault();

      var url = $(this).attr("href");
      var modal = getModal();
      var iframe = $("<iframe></iframe>");

      iframe.on("load", function() {
        var iframeEl = this;
        repeatWhileOnPage(iframeEl, resizeIframe.bind(null, iframeEl));
      });

      iframe.attr("src", url);

      modal.addClass("simple-modal-dialogframe");
      modal.find(".modal-content").append(iframe);
      modal.show();
    });
  };

  function repeatWhileOnPage(el, func, wait) {
    var timeout;

    wait = wait || 1000; // default every second

    function next() {
      if (!$.contains(document, el)) {
        return;
      }

      func.apply(el);

      setTimeout(next, wait);
    }

    setTimeout(next, 1);
  }

  function resizeIframe(iframeEl) {
    var iframe = $(iframeEl);
    iframe.attr("scrolling", "no");
    iframe.css({
      height: iframeEl.contentWindow.document.body.scrollHeight + "px"
    });
  }

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function getModal() {
    var modal = $(
      '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
        <div class="modal-dialog" role="document">\
          <div class="modal-content">\
          </div>\
        </div>\
      </div>'
    );

    modal.appendTo($("body"));

    return modal.modal();
  }

  $.fn.widgetViewPassword = function(el) {
    var self = $(this);

    var eye = $(
      '<button type="button" class="widget-viewpassword-toggle" tabindex="-1"></button>'
    );
    eye.on("click", function(evt) {
      var input = self.find("input");
      var on = input.attr("type") === "password";
      input.attr("type", on ? "text" : "password");
      eye.toggleClass("on", on);
    });

    self.append(eye);
  };

  $.fn.widgetAutoPhonePrefix = function() {
    var defaultPrefix = "+1";

    $(this).find("input").on("focus", function() {
      if (!$(this).val()) {
        $(this).val(defaultPrefix + " ");
      }
    });
    $(this).find("input").on("blur", function() {
      if ($.trim($(this).val()) === defaultPrefix) {
        $(this).val("");
      }
    });
  };
})();

window.Clipboard = (function(window, document, navigator) {
  var textArea,
      copy;

  function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
      textArea = document.createElement('textArea');
      textArea.value = text;
      textArea.readOnly = true;
      document.body.appendChild(textArea);
  }

  function selectText() {
      var range,
          selection;

      if (isOS()) {
          range = document.createRange();
          range.selectNodeContents(textArea);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
      } else {
          textArea.select();
      }
  }

  function copyToClipboard() {        
      var sCopy = document.execCommand('copy');
      document.body.removeChild(textArea);

      return sCopy;
  }

  copy = function(text, cb) {
      createTextArea(text);
      selectText();

      if (copyToClipboard()) {
        cb(null,true);
      } else {
        cb(null,false);
      }
  };

  return {
      copy: copy
  };
})(window, document, navigator);

function setLocalStorageItemValue(lsKey,el){
  var ls = window.localStorage;
  var lsVal = ls.getItem(lsKey);

  if (lsVal != "" || lsVal != null)
    el.value = lsVal;
}

function deleteLocalStorageItem(lsKey) {
  if (window.localStorage.getItem(lsKey) != null)
    window.localStorage.removeItem(lsKey);
}

function setPromoCode(lsKey,el) {
  
  setLocalStorageItemValue(lsKey,el);
  
  if (el.value != "") {
    el.parentElement.classList.add("has-success");
    el.classList.add("form-control-success");
  }
}

//Open a new window with help information
function dynamicHelp(url,element,settings,alertText,alertTitle,alertOkButton){
  
  window.open(url,'_blank',settings);
  
  try{
    element.focus();

  } catch (e) {

    dfAlertBox(alertText,alertTitle,alertOkButton);
  }
}

function sendGADepositEvent(gaEvent) {
  var nameType = localStorage.getItem('GAPaymentMethodNameType') || null;
  var gaEnabled = localStorage.getItem('GADepositTrackingEnabled') || false;
  var nstatus = gaEvent;
  var promocode = localStorage.getItem('PromoID') || '';

  window.dataLayer = window.dataLayer || [];
  
  if (gaEnabled && nameType) {
    window.dataLayer.push({
      'event': 'ga.event',
      'eventCategory': 'cashier',
      'eventAction': 'deposit ' + nstatus,
      'eventLabel': nameType
    });

    if ( nstatus == 'success' && promocode != ''){
      dataLayer.push({
        'event': 'ga.event',
        'eventCategory': 'engagement',
        'eventAction': 'promo code applied',
        'eventLabel': promocode
      });
    };

    if ( nstatus != 'attempt') {
      localStorage.removeItem('GAPaymentMethodNameType');
    };
  }
}

function IsQuickDepositMode() {
  var isQuickDeposit = localStorage.getItem("IsQuickDeposit") || null;
  if (isQuickDeposit == 'true') return true;
  else return false;
}

function addThousandSeparator(number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,");
}

$(document).on('ready', function() {

  if (inIframe()) {
    document.body.style.overflow = 'hidden';
    top.postMessage({'SetTop':true}, bolxdm);
  }
  
  function removeAddress(){    
    var obj= $(this).prev();
    if (obj.hasClass('form-control-danger')){
        obj.val('')
           .removeClass('form-control-danger')
           .parent().removeClass('has-danger');
    }    
  }

  if (document.URL.indexOf('viewPayoutDetails')>-1){
    var obj = $('input#AccountIdentifier');
    if(obj.length == 1 ){        
        var i  = obj[0].getBoundingClientRect();           
        obj.after( $( "<input/>",{
          'id':'btn',      
          'type':'button',
          'style':'width: 12px; height: 31px; opacity: -1; position: absolute;',      
          'click':removeAddress
          })
        );
      $('#btn').offset({left:i.right -12, top:i.bottom - 31});      
    }
  }

})

