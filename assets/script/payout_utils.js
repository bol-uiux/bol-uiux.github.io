function InitModal2FA()
{
  $('#TwoFactorAuthModal').modal('show');
}

$(document).ready(function() {
$(window).keydown(function(event){
    if(event.keyCode == 13) {
    event.preventDefault();
    return false;
    }
});
});

$("#help_btn").click(function () {
    var help_btn = document.getElementById("help_btn_questionmark");

    help_btn.style.display = "inline-block";
});

var h_amt = parseFloat(document.getElementById("hidden_amt").value);
var h_fee = parseFloat(document.getElementById("hidden_fee").value);
var real_total_elm = document.getElementById("real_total");
var real_total = h_amt + h_fee;


// Removes Extra Iverkat
var btn = document.getElementById("TwoFASubmit");

if (btn != undefined){

    btn.addEventListener("click", function () {
    
        var overlay = document.getElementsByClassName("modal-backdrop fade show");
        overlay[0].style.display = "none";
        $('#TwoFactorAuthModal').modal('hide');
    }, false);
}