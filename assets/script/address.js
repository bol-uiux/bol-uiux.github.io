(function () {
    $(function () {
        $(".form-address").addressForm();
    });

    var ZIP_LABELS = {
        US: "Zip",
        CA: "Postal code",
        AU: "Postcode",
        GB: "Postcode",
        default: "Zip / PostCode"
    };

    var STATE_LABELS = {
        US: "State",
        CA: "Province"
        // other regions don't have this field
    };

    // countries to use zip lookup for
    // number is number of digits expected in zip before requesting
    var COUNTRY_ZIP_LOOKUPS = {
        US: 5
    };

    /** components */

    $.fn.addressForm = function () {
        var form = $(this);

        var $country = form.find("select[name=country]");
        var $state = form.find("select[name=province]");
        var $city = form.find("input[name=city]");
        var $zip = form.find("input[name=zip]");
        
        if ($zip.length === 0) $zip = form.find("input[name=pcode]");
        
        $country.on("change", onCountryChange);
        onCountryChange();

        $zip.on("change", onZipChange);
        onZipChange();

        function onCountryChange() {
            var countryCode = $country.val();
            var zipLabel = ZIP_LABELS[countryCode] || ZIP_LABELS.default;
            var stateLabel = STATE_LABELS[countryCode];

            $zip.attr("placeholder", zipLabel);

            if (stateLabel) {
                $state.show();
               // loadStates();
            } else {
                $state.hide();
            }
        }

        function onZipChange() {
            var countryCode = $country.val();
            var zipVal = $zip.val();
            var zipLookup = COUNTRY_ZIP_LOOKUPS[countryCode];

            if (
              !zipLookup || // no zip lookup for this country
              zipVal.length != zipLookup // zip is not yet the right length
            ) {
                return;
            }

            $.getJSON(
              "./assets/data/zip-regions/" +
                countryCode +
                "/" +
                encodeURIComponent(zipVal) +
                ".json",
              function (region) {
                  $state.val(region.state);
                  $city.val(region.city);

                  $city.blur();
                  $state.change();
              }
            );
        }

        function loadStates() {
            var countryCode = $country.val();
            var stateLabel = STATE_LABELS[countryCode];

            $state.empty();
            $state.append($("<option value=''></option>").text(stateLabel));

            $.getJSON(
              "./assets/data/country-states/" + countryCode + ".json",
              function (states) {
                  for (var i = 0; i < states.length; i++) {
                      var state = states[i];
                      $state.append(
                        $("<option></option>").val(state.ID).text(state.Name)
                      );
                  }
              }
            );
        }
    };
})();
