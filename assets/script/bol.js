$(document).ready(function()
{
	$("#PromoID").click(function ()
	{
		//$(".SubmitButton").attr("disabled", "disabled");	
		
	}).blur(function()
	{
		var promoCode = $(this).val();
		if(promoCode != "")
		{
			var promoCodeValidationURL = "PromoCodeValidation.asp";
			var PIN = querySt("PIN");
			var Sportsbook = querySt("Sportsbook");

		    //Search PIN in form as hidden field if undefined.
			if (PIN === undefined || PIN === null) {
			    PIN = $("#PIN").val();
			}

		    //Sportsbook in form as hidden field if undefined.
			if (Sportsbook === undefined || Sportsbook === null) {
			    Sportsbook = $("#sportsbook").val();
			}

			promoCodeValidationURL = promoCodeValidationURL + "?PCode=" + promoCode + "&PIN=" + PIN + "&Sportsbook=" + Sportsbook;
			
			$.get(promoCodeValidationURL, function(data) {
				if(data == "True")
				{
					$(".SubmitButton").removeAttr('disabled');
				}
				else
				{
					alert('The promo code is incorrect');
					$("#PromoID").val('');
				}
			});
		}
		else
		{
			$(".SubmitButton").removeAttr('disabled');
		}
	});
});

function querySt(ji) {
	hu = window.location.search.substring(1);
	gy = hu.split("&");
	for (i=0;i<gy.length;i++) {
		ft = gy[i].split("=");
		if (ft[0] == ji) {
			return ft[1];
		}
	}
}