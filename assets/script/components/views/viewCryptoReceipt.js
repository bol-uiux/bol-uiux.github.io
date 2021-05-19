$(document).ready(function() {
    var qrCodeElement = document.getElementById("qrcode");
    if (qrCodeElement) {
        var cryptoAmount = document.getElementById("cryptoAmount");
        var walletAddress = document.getElementById("walletAddress");
        if (cryptoAmount && walletAddress) {
            var qrcode = new QRCode(qrCodeElement, {
                width: 150,
                height: 150,
            });
            qrcode.makeCode('bitcoin:' + walletAddress.value + '&amount=' + cryptoAmount.value);
            qrCodeElement.attributes.title.value = "";
        }
    }
});