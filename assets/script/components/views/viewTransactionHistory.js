(function () {
  const LimitAttempts = 2;
  var CountAttempts = 0;
  var Message_Log_ENDPOINT = "./controllers/controllerMessageLog.asp";
  var NA_SESSION_AUTH_KEY = "ANGULAR_PERSISTENCE_STORAGE::key";
  var NA_SESSION_AUTH_ENDPOINT = document.getElementById('NASessionTokenEndpoint').value;
  var NA_SESSION_AUTH_HEADERS = {
    gsetting: "bolsite",
    "Content-type": "application/json",
    cashier: "true",
  };
  var PIN = document.getElementById('PIN').value;
  var SbookID = document.getElementById('SbookID').value;
  var NA_SESSION_AUTH_METHOD = "POST";

   
function setTokenStorage(tokenJwt)
{
  sessionStorage.setItem(
    NA_SESSION_AUTH_KEY,
    '{"data":"' + tokenJwt+ '"}'
    
  );
  
  if (localStorage.getItem("didReload") === null) {
    localStorage.setItem("didReload", 1);
    location.reload();
  } else {
    localStorage.removeItem("didReload");
    document.body.style.display = "block"; //data won't be available at first request, reload and display body then
  }
}

function saveLogCashier()
{ 
  
  var data = { 
  'Pin': PIN, 
  'SbookId': SbookID,
  'IsNa':IsNa 
    };
  $.ajax({
    method: NA_SESSION_AUTH_METHOD,
    url: Message_Log_ENDPOINT,
    data: data,
     
    success: function (response) {
 

    },
    error: function (err) {
       
    },
  });
}
function attemptsRequestoToken(PIN)
{
   CountAttempts++;
   if(CountAttempts <= LimitAttempts)
   {       
      requestNAToken(PIN);
   }else
   {
      saveLogCashier();
   }

}
  var requestNAToken = function (PIN) {
    $.ajax({
      method: NA_SESSION_AUTH_METHOD,
      url: NA_SESSION_AUTH_ENDPOINT,
      data: '\'' + PIN + '\'',
      headers: NA_SESSION_AUTH_HEADERS,
      success: function (response) {

         if(response.tokenJwt!=null)
            setTokenStorage(response.tokenJwt);
         else 
            attemptsRequestoToken(PIN);

      },
      error: function (err) {
        attemptsRequestoToken(PIN);
      },
    });
  };

  var nATokenExists = function () {
    var NAKey = sessionStorage.getItem(NA_SESSION_AUTH_KEY) || "";
    return NAKey && NAKey.length > 0;
  };
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

  function GetTokenByCookie()
  {
    var tokenJwt = getCookie("key");

     
    setTokenStorage(tokenJwt)
      if(tokenJwt == null)
         saveLogCashier()
     
  }

  sessionStorage.removeItem('ANGULAR_PERSISTENCE_STORAGE');
  sessionStorage.removeItem('ANGULAR_PERSISTENCE_STORAGE::loginRedirect');
  sessionStorage.removeItem('ANGULAR_PERSISTENCE_STORAGE::redirectURL');

  var IsNa  = localStorage.getItem("NewArchFlag");
    if(IsNa == "1")
    {
       
      GetTokenByCookie();
      
    }else
    {
      requestNAToken(PIN);
    }
      
   
})();
