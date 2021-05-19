$(document).ready(function() {
    var ftdPreSelect = (document.getElementById("FTDPreSelect").value.toLowerCase() == 'true');

    if (ftdPreSelect) {
        document.getElementById("btnselected").click();
    }
});