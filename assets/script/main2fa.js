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
      $(".widget-selectplaceholder").each(function() {
        $(this).widgetSelectPlaceholder();
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
      $(".widget-pushbottom").each(function() {
        $(this).widgetPushButton();
      });
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
  
      $(".widget-dialogclose").each(function() {
        $(this).widgetModalClose();
      });
  
      $(".layout-graybarcontent").each(function() {
        $(this).add($(this).find(".layout-graybarcontent-inner")).css({
          "min-height": window.innerHeight + "px"
        });
      });
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
      var instant = !!el.attr("data-instant");
      var duration = 1000;
  
      step();
  
      function step() {
        var elapsed = instant ? 1 : Math.min(1, (Date.now() - start) / 1000);
  
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
          if (!instant) {
            el.addClass("widget-countup-finished");
          }
          clearInterval(interval);
        }
      }
    };
  
    $.fn.widgetPushButton = function() {
      var el = $(this);
  
      function refresh() {
        var isMobile = screen.width < 768;
  
        el.css({
          "padding-top": "0"
        });
  
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
      }
  
      refresh();
      el.bind("refresh", refresh); // allow other scripts to re-run the pushbutton
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
  
    $.fn.widgetModalClose = function() {
      $(this).on("click", function(evt) {
        if (!evt.isDefaultPrevented()) {
          try {
            if (window.parent === window) {
              // we're the top, redirect as normal
              throw new Error();
            }
          } catch (err) {
            // try-catch since some browsers may throw just by checking 'parent'
            return;
          }
          evt.preventDefault();
          var parentDoc = window.parent.document;
          window.parent.$(".simple-modal-dialogframe").modal("toggle");
          window.parent.$(".simple-modal-dialogframe").find("iframe").remove();
        }
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
        modal.modal("show");
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
  
    // we want to dynamically size some iframes to the height of their contents
    // this is not straight forward in JS
    function resizeIframe(iframeEl) {
      var iframe = $(iframeEl);
      iframe.attr("scrolling", "no");
  
      try {
        var iframeWindow = iframeEl.contentWindow;
        var iframeBody = $(iframeWindow.document.body);
  
        // measure body scroll height
        const bodyHeight = iframeBody.prop("offsetHeight");
  
        // firefox wasn't measuring the scroll height when the iframe has some modals, so account for that:
        const modalHeight =
          iframeBody.find(".modal-absolute").prop("offsetHeight") || 0;
        // set the height
        iframe.css({
          height: Math.max(bodyHeight, modalHeight) + "px"
        });
      } catch (ignore) {
        console.log(ignore);
        iframe.css({
          height: 600 + "px"
        });
        iframe.attr("scrolling", "yes");
      }
    }
  
    function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  
    function getModal() {
      var modal = $(".modal");
      if (modal.length) {
        // reset contents
        modal.find(".modal-content").empty();
        return modal;
      }
      var modal = $(
        '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
          <div class="modal-dialog" role="document">\
            <div class="modal-content">\
            </div>\
          </div>\
        </div>'
      );
  
      modal.appendTo($("body"));
  
      return modal;
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
  
    $.fn.widgetSelectPlaceholder = function() {
      var select = $(this).find("select");
  
      function toggleClass() {
        select.toggleClass("empty", select.val());
      }
  
      select.on("change", toggleClass);
      toggleClass();
    };
  })();
  
function hide_email(emilString){
    var splitEmail  = emilString.split("@")
    var domain      = splitEmail[1];
    var name        = splitEmail[0];
    return name.substring(0,0).concat("*********@").concat(domain)
}


function hide_phone_number(number){
  var cuantos = number.length;
  var tele = [];
  for (var i = 0; i < cuantos; i++) {
      if(i < 10){
          tele[i] = number[i].replace(/^\d+$/, "*");
      }
      else{
          tele[i] = number[i];
      }
  }
  
  var full_phone = "";
  for (var i = 0; i < cuantos; i++) {
      full_phone += tele[i];
  }
  return full_phone;
  //return number;
}

window.onload = function () {

  var type2FA = document.getElementById("hidden_2fa_type").value;

  if (type2FA === "phone") {
    var rawPhoneNumber          = document.getElementById("hidden_user_phonenumber").value;
    var hidden_phone_number     = hide_phone_number(rawPhoneNumber);   

    var phone_number_span       = document.getElementById("hidden_phone_number");
    phone_number_span.innerHTML = hidden_phone_number;

  }

  else if (type2FA === "mail") {
      var email         = document.getElementById("hidden_user_email").value;
      var hidden_email  = hide_email(email);
    
      var email_span = document.getElementById("hidden_email");
      email_span.innerHTML = hidden_email;
  }


}