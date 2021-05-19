function GADepositTrackingEcheck() {

	if ($("#currentGADepositTrackingSetting").val() == "1") {
		var nametype = localStorage.getItem('GAPaymentMethodNameType');
		var nstatus = "attempt";
		var promocode = $("#PromoID").val();

		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'event': 'ga.event',
			'eventCategory': 'cashier',
			'eventAction': 'deposit ' + nstatus,
			'eventLabel': nametype
		});

		if (nstatus == 'success' && promocode != '') {
			dataLayer.push({
				'event': 'ga.event',
				'eventCategory': 'engagement',
				'eventAction': 'promo code applied',
				'eventLabel': promocode
			});
		};

		if (nstatus != 'attempt') {
			localStorage.removeItem('GAPaymentMethodNameType');
		};

	}

}

function GADepositTrackingClickBody() {
	if ($("#divGA").attr("setting") == "1") {
		localStorage.setItem('GAPaymentMethodNameType', nametype);

		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'event': 'ga.event',
			'eventCategory': 'cashier',
			'eventAction': 'click - body',
			'eventLabel': nametype
		});

	}
}
