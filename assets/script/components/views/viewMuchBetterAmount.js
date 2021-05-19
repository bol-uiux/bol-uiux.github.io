var Minimum = $("#SbookMinAmount").val();
var Maximum = $("#SbookMaxAmount").val();
var CurrencyCode = $("#CurrencyCode").val();
var PhoneNumberMinLenght = $("#PhoneNumberMinLenght").val();
var MuchBetterIsDataValid  = $("#MuchBetterIsDataValid").val();
var MuchBetterFunctions = {};

(function (out) {

    function init(){
        
        $(".cashier-depositoptions-item").click(function() {
            checkForm();
        });
    
        $("#DepositAmount,#AreaCode,#PhoneNumber").change(function(){
            checkForm();
        });

        $("#AreaCode,#PhoneNumber").keyup(function(){
            checkForm();
        });

        $("#AreaCode,#PhoneNumber").keypress(function(event){
            
            var digit;
            digit = String.fromCharCode(event.which);
    
            if (!/^\d+$/.test(digit)) {
                event.preventDefault();
                return;
            }
        });
    }

    out.init = init;

})(MuchBetterFunctions);

//Submits the form contained in the modal
function SubmitForm(){

    $('#MuchBetterRedirect').off('submit');
    $('#MuchBetterRedirect').submit();
}

//Checks that all fields are valid
function checkForm(){
        
    var invalidFields,response;
    
    invalidFields = 0;
    response = false;
if (MuchBetterIsDataValid != "1" )
{     if( $("#AreaCode").val() == ""){
   
        $("#AreaCode").addClass("form-control-danger");
        $("#AreaCode").parent().addClass("has-danger");
        $('#AreaCodeText').css("color","#d9534f");
        invalidFields++

    }else{

        $("#AreaCode").parent().removeClass("has-danger");
        $('#AreaCodeText').css("color","#4A4A4A");
    }

    if( $("#PhoneNumber").val() == "" || $("#PhoneNumber").val().length < PhoneNumberMinLenght ){
        
        $("#PhoneNumber").addClass("form-control-danger");
        $("#PhoneNumber").parent().addClass("has-danger");
        $('#PhoneNumberText').css("color","#d9534f");
        invalidFields++

    }else{

        $("#PhoneNumber").parent().removeClass("has-danger");
        $('#PhoneNumberText').css("color","#4A4A4A");
    }
}
    if(parseFloat($("#DepositAmount").val())!= NaN &&
        parseFloat($("#DepositAmount").val())>=Minimum && parseFloat($("#DepositAmount").val())<=Maximum){ 

        $("#CreateDepositButton").removeClass("btn-disabled" ).addClass("btn-primary");
        $("#CreateDepositButton").attr("disabled", false);

    }else{
        
        $("#CreateDepositeButton").removeClass("btn-primary" ).addClass("btn-disabled");
        $("#CreateDepositButton").attr("disabled", true);
        invalidFields++
    }

    if (invalidFields == 0 ){

        response = true;
    }

    
    return response;
}

$(document).ready(function(){

    MuchBetterFunctions.init();

});