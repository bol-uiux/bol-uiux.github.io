"use strict";

var Utility = {};
(function (out) {

    // List of Pages that don't need to Update Height in BOLClientCommunicator.
    var EXCLUDE_HEIGHT_PAGES = [
        "viewECheckAmount.ASP"
    ];

    function shouldUpdateHeight () {

        var isQuickDeposit = document.getElementById("IsQuickDeposit").value; 
        var isQuickDeposit = (isQuickDeposit === "True"); // Proper way to convert a string to bool in JS

        if (!isQuickDeposit) return true; // If NOT QuickDeposit, no need to do validate, just resize when needed.

        // Is Quick Deposit? Okay, check if current page is in Exclude list, if so don't resize.
        var path 		= window.location.pathname;
        var pageName 	= path.substring(path.lastIndexOf('/') + 1);

        for (var i = 0; i < EXCLUDE_HEIGHT_PAGES.length; i += 1) {
            var page = EXCLUDE_HEIGHT_PAGES[i];
            if (page === pageName) return false;
        }
  
        // Not in the list? Just resize.
        return true;
    }

    function setSpriteByClassName (className, x, y, iterate, index) {

        if (!iterate)  {

            if (typeof index === "undefined") index = 0;

            var img = document.getElementsByClassName(className)[index];
            if (img) img.style.backgroundPosition = x + "px " + y +"px";
        }
        else {
            var imgs = document.getElementsByClassName(className);
            var numImages = imgs.length;

            for (var i = 0; i < numImages; i += 1) {
                var img = imgs[i];
                img.style.backgroundPosition = x + "px " + y +"px";
            }
        }
    }

    /*
        hideNodeByClassName
        - Just hides a node by applying display: none
    */
    function hideNodeByClassName (className, iterate, index) {
        if (!iterate) {

            if (typeof index === "undefined") index = 0;
            var node = document.getElementsByClassName(className)[index];
            node.style.display = "none";

        }
        else {
            var nodes    = document.getElementsByClassName(className);
            var numNodes = nodes.length;

            for (var i = 0; i < numNodes; i += 1) {
                var node = nodes[i];
                node.style.display = "none";
            }
        }
    }

    function hideNodesByTagName (tagName, iterate, index) {
        if (!iterate) {

            if (typeof index === "undefined") index = 0;
            var node = document.getElementsByTagName(tagName)[index];
            node.style.display = "none";

        }
        else {
            var nodes    = document.getElementsByTagName(tagName);
            var numNodes = nodes.length;

            for (var i = 0; i < numNodes; i += 1) {
                var node = nodes[i];
                node.style.display = "none";
            }
        }
    }

    /*
    Returns the IE true/false
    */
    function msieversion() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        var isIe = false

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
        {
          isIe = true
        }

        return isIe;
    }

    /**
     * Verify and modify the url if the navigated is IE
     * @param {element of the url to eliminate} pathToDelete 
     * @param {url to verify} url 
     */
    function checkUrlToRedirectIE(pathToDelete,url){

        if (msieversion()) {
                            
            url = url.replace(pathToDelete,"");
            url = "./" + url;
        } 

        return url
    }

		/**
		 * Call directly the proactive chat
		 * @param {*} sectionString 
		 * @param {*} faildepositString 
		 */
		function callProactiveChat(sectionString,faildepositString){
			lpTag.newPage(window.location.href,{section: [sectionString, 
				faildepositString]});
		}

		/**
		 * Lauchs the proactive chat for failed deposit
		 * @param {*} isInFrame true if the cashier is in the iframe, false otherwise
		 * @param {*} proactiveChatID Sportsbook identifier
		 * @param {*} useOnload true if the function must be included into onload function, 
		 * false otherwise
		 */
    function depositFailLauchProactiveChat(isInFrame,proactiveChatID,useOnload){
			if(isInFrame){
				sendMessage({'G2C':false,'depositDidFail': true, 'TxnStatus':{'IsSuccess': false, 'TraceID':0 }});
			}
			else if (proactiveChatID == "1"){
				console.log({"G2C":false,"depositDidFail": true, "TxnStatus":{"IsSuccess": false, "TraceID":0 }});

				if (useOnload){
					window.onload = function() {
						callProactiveChat("mobile-bol-section-engagement-attr-liveperson", 
							"mobile-section-proactive-faileddeposit-cbol");
					}
				}
				else {
					callProactiveChat("mobile-bol-section-engagement-attr-liveperson", 
						"mobile-section-proactive-faileddeposit-cbol");
				}
			}
			else if (proactiveChatID == "5"){
				console.log({"G2C":false,"depositDidFail": true, "TxnStatus":{"IsSuccess": false, "TraceID":0 }});
				
				if (useOnload){
					window.onload = function() {
						callProactiveChat("mobile-sb-section-engagement-attr-liveperson", 
							"mobile-section-proactive-failddeposit-sb");
					}
				}
				else {
					callProactiveChat("mobile-sb-section-engagement-attr-liveperson", 
						"mobile-section-proactive-failddeposit-sb");
				}
			}
    }

    // Exports
    out.setSpriteByClassName    						= setSpriteByClassName;
    out.hideNodeByClassName     						= hideNodeByClassName;
    out.hideNodesByTagName      						= hideNodesByTagName;
    out.msieversion             						= msieversion;
    out.checkUrlToRedirectIE    						= checkUrlToRedirectIE;
    out.shouldUpdateHeight      						= shouldUpdateHeight
		out.depositFailLauchProactiveChat	      = depositFailLauchProactiveChat;
    
})(Utility);


