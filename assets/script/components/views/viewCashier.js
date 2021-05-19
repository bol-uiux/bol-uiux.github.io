$(function(){
    $('button.btn.btn-link').click(function(){
            setTimeout( function(){
            $('body').height($('.layout-graybarcontent-inner').height());
            }, 400);
    })
});

var Local = {};
(function(ctx) {

    var paymentBtns = document.querySelectorAll("[data-index]");
    var mainButtons = document.querySelectorAll(".cashier-main-buttons");
    var mainOptions = document.querySelectorAll(".cashier-main-options-wrapper");

    function init () {

        var sorted = [];
        var parent;
        parent = typeof(paymentBtns[0]) !== 'undefined' ? paymentBtns[0].parentElement : [];
        var mainDepositButton = mainButtons[0];
        var mainWithdrawalButton = mainButtons[1];

        for (var i = 0; i < mainButtons.length; i++) {

            mainButtons[i].addEventListener('click', handleMainButtonClick);

        }

        for (var i = 0; i < paymentBtns.length; i++) {

            sorted[paymentBtns[i].dataset.index] = paymentBtns[i];

        }

        for (var i = 0; i < sorted.length; i++) {

            if (sorted[i] != null) parent.appendChild(sorted[i])

        }

    }

    function handleMainButtonClick(e) {
        return false;
        var isActive = e.target.className.indexOf('active') >= 0;
        if (isActive) {
            //Do nothing, clicking the active button
        } else {
            for (var i = 0; i < mainButtons.length; i++) {
                if (mainOptions[i].style.display === "none") {
                    mainOptions[i].style.display = "block";
                } else {
                    mainOptions[i].style.display = "none";
                }
                if (mainButtons[i].className.indexOf('active') >= 0) {
                    mainButtons[i].className = "cashier-main-buttons btn btn-default";
                } else {
                    mainButtons[i].className = "cashier-main-buttons btn btn-primary active";
                }
            }
        }
    }

    function retrieveMainButtonType (name) {

        console.log(name.split('cashier-')[1]);
        return name.split('cashier-')[0].split('-options-wrapper')[0];

    }

    ctx.init = init;
})(Local);

Local.init();

$(document).ready(function () {
    var dataHover = "";

    var btnHover = document.getElementsByClassName("btn-hover");

    function handleBtnMouseOver (e) {
        e.stopPropagation();
        el = e.target;
        while (el.tagName != "DIV") el = el.parentElement; //Look for the target div
        dataHoverEl = document.getElementsByClassName(el.dataset.hover)[0]; //The target div contains the className to change
        dataHover = dataHoverEl.innerHTML; //Set the text from the previously selected div
        if (el.dataset.htext != "") dataHoverEl.innerHTML = el.dataset.htext; //Replace if not empty
    }

    function handleBtnMouseOut (e) {
        e.stopPropagation();
        el = e.target;
        while (el.tagName != "DIV") el = el.parentElement; //Look for the target div
        dataHoverEl = document.getElementsByClassName(el.dataset.hover)[0];
        dataHoverEl.innerHTML = dataHover;
    }

    for (var i = 0; i < btnHover.length; i++) btnHover[i].addEventListener('mouseover', handleBtnMouseOver, false);
    for (var i = 0; i < btnHover.length; i++) btnHover[i].addEventListener('mouseout', handleBtnMouseOut, false);

    $("#showDepositMethods").click(function () {

        $header = $(this);
        //getting the next element
        $content = $header.next();
        if ($content.is(':visible')) {
            $header.addClass('collapsed');
        } else {
            $header.removeClass('collapsed');
        }
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {
            //execute this after slideToggle is done
            return true;
        });
    });
    
    $("#modalClose").click(function(event){
		event.preventDefault();
		$("#PODisclaimer").modal('hide');
	})
});