(function() {
  if (location.search === "?__testloading") {
    // testing in development mode with no JS enabled
    return;
  }

  $(function() {
    // 3rd party widgets
    $(".widget-contentslider").each(function() {
      $(this).widgetContentSlider();
    });
  });

  /** widgets */

  $.fn.widgetContentSlider = function() {
    var ele = $(this);
    var items = ele.find(".contentslider-content-item");
    var dots = ele.find(".contentslider-dots");
    var count = items.length;
    var AUTO_PAGINATE_WAIT = 5000;

    for (var i = 0; i < count; i++) {
      var dot = $(
        '<button type="button" class="contentslider-dots-item"><span></span></button>'
      );
      dot.on("click", setIndex.bind(null, i));
      dots.append(dot);
    }

    var dotButtons = dots.find("button");
    var onIndex = 0;

    setIndex(0);

    // preload all the images
    // once they're ready we begin auto scroll
    // (otherwise it will look bad)
    $(window).on("load", function() {
      var loadCount = 0;
      items.each(function() {
        var img = new Image();
        img.onload = function() {
          if (++loadCount === items.length) {
            waitSetNextIndex();
          }
        };
        img.src = $(this).attr("data-background-url");
      });
    });

    var timeout = 0;
    function waitSetNextIndex() {
      clearTimeout(timeout);
      timeout = setTimeout(setNextIndex, AUTO_PAGINATE_WAIT);
    }

    function setNextIndex() {
      setIndex((onIndex + 1) % count);
    }

    function setIndex(index) {
      onIndex = index;

      var onItem = items.eq(index);

      items.not(onItem).removeClass("on");
      onItem.addClass("on");

      dotButtons.removeClass("on");
      dotButtons.eq(index).addClass("on");

      for (var i = 0; i < count; i++) {
        ele.css({
          "background-image": "url(" + onItem.attr("data-background-url") + ")"
        });
      }

      waitSetNextIndex();
    }
  };
})();
