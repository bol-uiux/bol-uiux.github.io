var DepositLimit = {};
(function(out) {
    "use strict";
    var _Identifiername;
    var _SbookId;
    var _Pin;
    var _Method;
    var _callback;
    var _callbackError;
    var url = "./ajax-scripts/deposit-limits.asp";
    var _params;
    var _isConfigured;
    var _CurrencyCode;
    function init(SbookId,Pin,Method,CallBack,CallBackError,Params,CurrencyCode)
    {
        
        _SbookId = SbookId;
        _Pin = Pin;
        _Method = Method;
        _callback =CallBack;
        _callbackError = CallBackError;
        _params = Params;
        _CurrencyCode = CurrencyCode;
        _isConfigured = document.getElementById("LimitConfig").value;
         
        
    
    }

    function GetDataDepositLimmit(identifier,CardTpe)
    {
         
        var data = { 
            'SbookID': _SbookId , 
            'Pin': _Pin,
            'Method':_Method ,
            'identifier':identifier.trim(),
            'CurrencyCode': _CurrencyCode,
            'IdentifierType':CardTpe
            
        };

        var header = { 'X-Bearer-Token': _params }
        Utility.getJSONData(url,"POST",data,_callback,_callbackError,header )
    }

    
    function ValidateIdentifierDataConfig(identifier)
    {
        identifier = identifier.split(/\s/).join('');
        let rates = document.getElementsByName('LimitConfigCards');
        var rtvalidData = false;
            rates.forEach((rate) => {
                 var SubIdentifier = identifier.split("*")[0];
                 var  index = rate.value.indexOf(SubIdentifier);

                 
                if(rate.value == identifier || index>-1)
                    {
                        
                         
                        var jsonreturn = { "status":"success","payload":{"min-limit":rate.dataset.min,"max-limit":rate.dataset.max,"extra-data":rate.dataset.extra}}
                        _callback(jsonreturn);
                        rtvalidData =  true;
                    }
            });

            return rtvalidData;
    }

    function Validate(identifier,CardTpe)
    {
        if(_isConfigured!="False")
        {
            if(ValidateIdentifierDataConfig(identifier) == false)
                GetDataDepositLimmit(identifier,CardTpe);
        }else
        {
            _callbackError(null);
        }
         
    }
    
    // Exports
     out.init = init;
     out.Validate = Validate;
   

})(DepositLimit);




var Utility = {};
(function(out) {
    "use strict";


    
function getJSONData(serviceURL,type, parameters, callback_results, callback_error,headers ) {

   
    $.ajax({
        async: true,
        url: serviceURL,
        type: type,
        dataType: "json",
        data: parameters,
        headers: headers,
        success: function (data) {
            callback_results(data);
        },
        error: function (e) {
            //result = false;
            callback_error(e);
        }
    });

};
    
    // Exports
     out.getJSONData = getJSONData;

    

})(Utility);