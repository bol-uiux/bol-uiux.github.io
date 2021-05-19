(function () {
    $(function () {
        $(".widget-cashier-balance").cashierBalanceWidget();
    });

    /** components */

    $.fn.cashierBalanceWidget = function () {
        var ele = $(this);
        var balance = parseFloat(ele.attr("data-balance"), 10);
        var bonus = parseFloat(ele.attr("data-bonus"), 10);
        var total = balance + bonus;

        if (total === 0) {
            return;
        }

        var bonusRatio = bonus / total;

        var bgColor = "#176cb7";
        var fillColor = "#274e75"

        if ($('meta[cashier*="V"]') && $('meta[cashier*="V"]')[0].attributes[0].value == "V5") {
            bgColor = "#176cb7";
            fillColor = "#274e75"
        } else {
            bgColor = "#F32D28";
            fillColor = "#2D2E2C"
        }




        ele.css({
            background: pieGradient(bonusRatio, bgColor, fillColor)
        });

        var dot1 = ele.find(".widget-cashier-balance-dot1");
        var dot2 = ele.find(".widget-cashier-balance-dot2");

        var dot2x = Math.sin(bonusRatio * Math.PI * 2);
        var dot2y = -Math.cos(bonusRatio * Math.PI * 2);

        dot1.css("display", "block");
        dot2.css({
            display: "block",
            left: (50 + dot2x * 50).toFixed(3) + "%",
            top: (50 + dot2y * 50).toFixed(3) + "%"
        });
    };

    function pieGradient(ratio, bgColor, fillColor) {
        if (ratio <= 0.5) {
            var angle = Math.round(90 + ratio * 360);
            return (
              "linear-gradient(" +
              angle +
              "deg, transparent 50%, " +
              bgColor +
              " 50.1%) 0 0," +
              "linear-gradient(90deg, " +
			  bgColor +
              " 50%, " +
			  "rgb(40, 45, 49)" +
              " 50.1%) 0 0"
            );
        } else {
            var angle = Math.round(-90 + ratio * 360);

            return (
              "linear-gradient(" +
              angle +
              "deg, transparent 50%, " +
              fillColor +
              " 50.1%) 0 0," +
              "linear-gradient(-90deg, " +
              fillColor +
              " 50%, " +
			  "rgb(40, 45, 49)" +
              " 50.1%) 0 0"
            );
        }
    }
})();
