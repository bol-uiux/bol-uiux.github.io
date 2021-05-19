//import _ from "highlight.js/lib/languages/*";

(function () {
    $(function () {
        var isBonusWalletAllowed = document.getElementById('IsBonusWalletAllowed').value;
        if (isBonusWalletAllowed === 'True') {
            $(".widget-cashier-balance").cashierBalanceWidgetWithBonusWalletAllowed();
        }
        else {
            $(".widget-cashier-balance").cashierBalanceWidget();
        }
        
    });

    /** components */

    $.fn.cashierBalanceWidget = function () {
        var ele = $(this);
        var balance = parseFloat(ele.attr("data-balance"), 10);
        var bonus = parseFloat(ele.attr("data-bonus"), 10);
        var total = balance + bonus;
        var bgColor = document.getElementById('bgColor').value;
        var fillColor = document.getElementById('fillColor').value;
        
        if (total === 0) {
            return;
        }

        var bonusRatio = bonus / total;
        
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

    $.fn.cashierBalanceWidgetWithBonusWalletAllowed = function () {
        var ele = $(this);
        var balance = parseFloat(ele.attr("data-cash"), 10);
        var bonus = parseFloat(ele.attr("data-bonus"), 10);
        var freePlay = parseFloat(ele.attr("data-freeplay"), 10);
        var total = balance + bonus + freePlay;
        var bgColor = document.getElementById('bgColor').value;
        var fillColor = document.getElementById('fillColor').value;
        var freePlayColor = document.getElementById('freePlayColor').value;

        if (total === 0) {
            return;
        }

        var bonusRatio = bonus / total;
        var freePlayRatio = freePlay / total;

        ele.css({
            background: pieGradientWithBonusWalletAllowed(bonusRatio, freePlayRatio, bgColor, fillColor, freePlayColor)
        });
    };

    function pieGradientWithBonusWalletAllowed(ratio, freePlayRatio, bgColor, fillColor, freePlayColor) {
        var ratioAngle = Math.round(ratio * 360);
        var freePlayAngle = Math.round(freePlayRatio * 360);
        var angle = Math.round(360 - (ratioAngle + freePlayAngle));

        return (            
            "conic-gradient(" + fillColor + " " + ratioAngle + "deg, "
            + freePlayColor + " " + ratioAngle + "deg " + (freePlayAngle + ratioAngle) + "deg, "
            + bgColor + " " + (freePlayAngle + ratioAngle) + "deg)"
        );
    }
})();
