//Global vars
//var livechatTimer;

function showcustommenu(e){
	//don't show custom context menu for form elements...
	var target = window.event ? window.event.srcElement : e ? e.target : null;
	var e = e ? e : window.event;
	if (target.type == "text" || target.type == "textarea" || target.type == "password" || target.type == "tel" || target.type == "number"){
			hidecustommenu(e);
            return true;
    } else {
		//Find out how close the mouse is to the corner of the window
		var rightedge=window.innerWidth-e.clientX;
		var bottomedge=window.innerHeight-e.clientY;

		var XpageOffset = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
		var YpageOffset = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

		//if the horizontal distance isn't enough to accomodate the width of the context menu
		if (rightedge<menuobj.offsetWidth)
			//move the horizontal position of the menu to the left by it's width
			menuobj.style.left=XpageOffset+e.clientX-menuobj.offsetWidth+ "px";
		else
			//position the horizontal position of the menu where the mouse was clicked
			menuobj.style.left=XpageOffset+e.clientX+ "px";

		//same concept with the vertical position
		if (bottomedge<menuobj.offsetHeight)
			menuobj.style.top=YpageOffset+e.clientY-menuobj.offsetHeight+ "px";
		else
			menuobj.style.top=YpageOffset+e.clientY+ "px";

		menuobj.style.visibility="visible";
		return false;
	}
}

function hidecustommenu(e){
	menuobj.style.visibility="hidden";
}

function highlightie5(e){
	var firingobj = window.event ? window.event.srcElement : e ? e.target : null;
	if (firingobj.className=="cntxtmenuitems"||firingobj.parentNode.className=="cntxtmenuitems"){
		if (firingobj.parentNode.className=="cntxtmenuitems") firingobj=firingobj.parentNode; //up one node
			firingobj.style.backgroundColor="highlight";
			firingobj.style.color="white";
	}
}

function lowlightie5(e){
	var firingobj = window.event ? window.event.srcElement : e ? e.target : null;
	if (firingobj.className=="cntxtmenuitems"||firingobj.parentNode.className=="cntxtmenuitems"){
		if (firingobj.parentNode.className=="cntxtmenuitems") firingobj=firingobj.parentNode; //up one node
			firingobj.style.backgroundColor="";
			firingobj.style.color="black";
	}
}

function isSSL() {
	return window.location.protocol == 'https:';
}

function SetCookie(name, value, exdays) {
	var exp = new Date();
	exp.setDate(exp.getDate() + exdays);
	var c_value=encodeURIComponent(value) + ((exdays==null) ? "" : "; expires=" + exp.toUTCString());
	if (isSSL()) { c_value +="; secure";}
	document.cookie = encodeURIComponent(name) + "=" + c_value;
}

// returns value of cookie or null if cookie does not exist
function GetCookie(name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==name){
			return decodeURIComponent(y);
		}
	}
}

function popUp(strURL,strHeight,strWidth) {
	strOptions="height="+strHeight+",width="+strWidth+",location=yes,status=yes,scrollbars=yes,resizable=yes";
	newWin = window.open(encodeURI(strURL), 'newWin', strOptions);
	newWin.focus();
}

function returntodepositspage (pageParams) {
	//check if IsQuickDeposit page. If so then go to original page
	var currentPage=location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	if (currentPage=="Quick_Deposit_CC.asp") {
		window.parent.reloadIframe();
	} else {
		window.location.href="deposits.asp?" + encodeURI(pageParams);
	}
}

function paymentPostRedirection (form,pageParams) {
	if ((form.target) != '_self') {
		form.sendDataSubmit.disabled = true; //prevent multiple posts
		form.sendDataSubmit.value = submitButtonClickedText;
		window.setInterval('returntodepositspage("' + encodeURI(pageParams) + '");' ,1000);
	}
}


function redirectPageLoad (myform,pageParams) {
	if (myform) {
		// set the target of the form to 'noframes' if the processor doesn't work inside frames
		if ((myform.target=='noframes') && (top.location != location)) {
			myform.target="_blank"
		}

		if (myform.target =='_self'){
			setInnerHTMLbyID ("redirectInstructions",autoRedirectText,false);
			myform.sendDataSubmit.style.visibility="hidden"
//			myform.sendDataSubmit.value = submitButtonClickedText;	//not currently used
			window.setTimeout ("myform.submit();",750);
			window.setTimeout ("myform.sendDataSubmit.style.visibility = 'visible';",4500);
		} else {
			setInnerHTMLbyID ("redirectInstructions",newWindowRedirect,true);
			$(myform).on("submit", function(event){paymentPostRedirection (myform,pageParams)});
		}
	}
}

//Redirect, with No POST
function redirectPageLoadByURL (myform,redirectURL) {
	if (myform) {
	    setInnerHTMLbyID ("redirectInstructions",autoRedirectText,false);
		myform.sendDataSubmit.style.visibility="hidden"
		window.setTimeout ("window.location.replace('" + encodeURI(redirectURL) + "');",750);
		window.setTimeout ("myform.sendDataSubmit.style.visibility = 'visible';",4500);
	}
}

//additive is true or false, if true, add the text to existing text
function setInnerHTMLbyID (destObj,strHTML,additive) {
	var mydestObj=document.getElementById(destObj);
	if (mydestObj!=null) {
		if ((additive) && (mydestObj.innerHTML.length > 0)) {
		  	mydestObj.innerHTML=mydestObj.innerHTML + '<br>' + strHTML;
		} else {
			mydestObj.innerHTML=strHTML;
		}
	}
}

//dynamic status message
function SetStatus (StatusText) {
	if (StatusText.lastIndexOf('...')>0) {
		setInnerHTMLbyID ('loadingimg','<div class="dspinner"></div>',false);
	}
	setInnerHTMLbyID('dynamsgtext', StatusText, false);
}

//will set the message and hide the element
function ProcessingFinished (StatusText) {
	SetStatus(StatusText);
	var objDynaMsg=document.getElementById('dynamsgtext');
	if (objDynaMsg!=null){
		document.getElementById('dynamsg').style.display='none';
	}
}

function isValidInteger (n) {
	return ((n%1==0) && (n > 0));
}

function isValidDecimal(n) {
//    var testRegEx = /[0-9]{1,8}\.?[0-9]{0,2}/
	var testRegEx = /^\d+(\.\d{1,2})?$/
	return testRegEx.test(n)
}

function isValidNumber(n) {
	return ((n % 1 >= 0) && (n >= 0));
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var validEmail = pattern.test(emailAddress);
    return validEmail;
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g, "");
}
function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/, "");
}
function rtrim(stringToTrim) {
    return stringToTrim.replace(/\s+$/, "");
}

function checkForValue (d) {
	//checks for null, empty, and whitespace only
	var reWhitespace = /^\s+$/
	return !(d == null || d.length==0 || reWhitespace.test(d));
}


function isNumberKey(e,BaseValue,max){
    var charCode = (e.which) ? e.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
		return false;
	else {
		var BaseValueElement = document.getElementById(BaseValue);
		if (BaseValueElement == null) { return false; }
    var len = BaseValueElement.value.length;
    var index = e.srcElement.value.indexOf('.');
    if (index > 0 && charCode == 46) {
      return false;
    }
	if (BaseValueElement.value <= max && BaseValueElement.value>= 50) {
		var submit = $("#main").find("button[type=submit]");
		submit.toggleClass("btn-disabled", BaseValueElement.checkValidity());
	}
	if (BaseValueElement.value >= max) {
		document.getElementById(BaseValue).value = max;

        var feeEle = $(".cashier-deposit-feetip-text");
        var feeAmount = parseFloat(feeEle.attr("data-fee")).toFixed(5);
        var feeAmountToFixed = (feeAmount * 100).toFixed(2);
		var feeFromTotal = feeAmount * BaseValueElement.value;
		var total = parseFloat(BaseValueElement.value) + parseFloat(feeFromTotal);

        feeEle.text(
            "+" +
            feeAmountToFixed +
            "% Fee " +
            (total > 0 ? "= Total of $" + total.toFixed(2) + " USD" : "")
        );

        return false;
      }
	  else
	  {

	  }
    if (index > 0) {
      var CharAfterdot = len - index;
      if (CharAfterdot > 2) {
        return false;
      }
    }
      return true;
  }
}

function isBTCNumberKey(e,BaseValue,max){
    var charCode = (e.which) ? e.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
		return false;
	else {
		var BaseValueElement = document.getElementById(BaseValue);
		if (BaseValueElement == null) { return false; }
    var len = BaseValueElement.value.length;
    var index = e.srcElement.value.indexOf('.');
    if (index > 0 && charCode == 46) {
      return false;
    }
	if (BaseValueElement.value >= max) {
		document.getElementById(BaseValue).value = max;

        return false;
      }
	  else
	  {

	  }
    if (index > 0) {
      var CharAfterdot = len - index;
      if (CharAfterdot > 2) {
        return false;
      }
    }

  }
}

function showLocalCurrencyValue(BaseValue,DisplayAt){
	if ((document.forms['main'])) {//check if form is present...
		var BaseValueElement = document.getElementById(BaseValue);
		if(FXBuyRate == null){return;}
		if(BaseValue == null){return;}
		if(BaseValueElement.value == null){return;}
		BaseValue = trim(BaseValueElement.value);
		BaseValueElement.value = BaseValue;
		if (BaseValue < 0) {
			convertedvalue =0
		} else {
			convertedvalue = BaseValue / FXBuyRate;
		}

		if (isValidDecimal(BaseValue)==false) {
			convertedvalue = 0;
		}

		convertedvalue = (Math.round(convertedvalue * 100) / 100);
		if (convertedvalue.toFixed) {
			convertedvalue = convertedvalue.toFixed(2);
		} else {
			convertedvalue = (Math.round(convertedvalue*100)/100);
		}
		if( (isNaN(convertedvalue)) || convertedvalue == 0){convertedvalue = "0.00";}
		document.main.amount.value=convertedvalue;
		if (document.getElementById(DisplayAt)) {
			document.getElementById(DisplayAt).innerHTML=convertedvalue;
		}
		if((document.getElementById(DisplayAt)!=null)){document.getElementById(DisplayAt).innerHTML=convertedvalue;}
	}
}


function CalculateProcessingFee(ProcessingFee) {
	var ProcessingFeePercentage = ProcessingFee
	var ProcessingFee = parseFloat(document.main.amount.value) * ProcessingFeePercentage / 100;
	var ToBeCredited = parseFloat(document.main.amount.value) - ProcessingFee;

	if (document.main.amount.value != 0){
		dfAlertBox('Processing Fee\n\nAmount: '+ '\t\t<div style=\'float:right\'>' + document.main.amount.value + '</div>\n' + 'Processing fee: ' + '\t<div style=\'float:right\'>' + ProcessingFee.toFixed(2) + '</div>\n' + 'To be credited: ' + '\t<div style=\'float:right\'>' + ToBeCredited.toFixed(2) + '</div>', 'Information','OK');
	} else {
		dfAlertBox('Enter a deposit amount.','Information', 'OK');
	}
}

//This functions reduce font size in all div elements with text inside textElement
function fitText(textElement, maxWidth, initialFont){
	$('#' + textElement + ' div').each (function(){
		var div = $(this);
		var span = $("<span style='visibility:hidden'></span>");
		span.appendTo('body');
		var size = initialFont;
		span.text (div.text());
		while ((span.width() > maxWidth) & (size > 1)) {
			size = parseInt (span.css("font-size"),0);
			span.css("font-size", size-1);
		}
		div.css("font-size", span.css("font-size"));
	});
};

function convertToHTML (string){
    string = string.replace(/\n/g,'<br/>');
    string = string.replace(/\t/g,'&nbsp;&nbsp;');
    return string;
}

function dfAlertBox (message, title, okText){
	var alertDialog = $('#alertDialog');

	if (alertDialog.length == 0){
		alertDialog = $("<div style='text-align:left;' id='alertDialog'></div>");
	}

    message = convertToHTML (message);

	alertDialog.text('');
	alertDialog.append(message);
	alertDialog.dialog ({ autoOpen: false, modal: true, resizable: false, title: title,
		buttons: [{ text: okText, click: function() {
			$( this ).dialog( "close" );
		}}]
	}).height("auto");

	displayLoading ('stop');
	alertDialog.dialog ('open');
	$('.ui-dialog :button').blur();

    //Support RTL style modifications in jquery UI
	if ($("body").css("direction").toLowerCase() == "rtl") {
	    $('.ui-dialog-content').css('text-align', 'right');

	    $('.ui-dialog-titlebar-close').css('right', 'auto').css('left', '.3em');
	    $('.ui-dialog-buttonset').css('float', 'left');

	}
};

function dfConfirmBox (message, title, yesText, noText, okCallBack){
	var alertDialog = $('#alertDialog');
	var buttons = [,];
	buttons['OK'] = yesText;
	buttons['Cancel'] = noText ;

	var buttonArray = {};
		buttonArray[buttons['OK']] = function() {
			//Set Ok function here
			okCallBack();
		};
	buttonArray[buttons['Cancel']] = function() {
		//Set Cancel function here
		$( this ).dialog( "close" );
	};

	if (alertDialog.length == 0){
		alertDialog = $("<div style='text-align:left;' id='alertDialog'></div>");
	}

	message = convertToHTML (message);

	alertDialog.text('');
	alertDialog.append(message);
	alertDialog.dialog ({
		autoOpen: false,
		modal: true,
		resizable: false,
		title: title,
		buttons: buttonArray
	}).height("auto");

	displayLoading ('stop');
	alertDialog.dialog('open');

    //Support RTL style modifications in jquery UI
	if ($("body").css("direction").toLowerCase() == "rtl") {
	    $('.ui-dialog-content').css('text-align', 'right');

	    $('.ui-dialog-titlebar-close').css('right', 'auto').css('left', '.3em');
	    $('.ui-dialog-buttonset').css('float', 'left');

	}
};

function dfConfirmBoxAmt (message, title, yesText, noText, okCallBack, obj, min, max, balance){
	var alertDialog = $('#alertDialog');
	var buttons = [,];
	buttons['OK'] = yesText;
	buttons['Cancel'] = noText ;

	var buttonArray = {};
		buttonArray[buttons['OK']] = function() {
			//Set Ok function here
			var e = document.getElementById("cmbNewAmt");
			var newvalue = e.options[e.selectedIndex].value;
			obj.value = newvalue;
			okCallBack();
			$( this ).dialog( "close" );

		};
	buttonArray[buttons['Cancel']] = function() {
		//Set Cancel function here
		$( this ).dialog( "close" );
	};

	if (alertDialog.length == 0){
		alertDialog = $("<div style='text-align:left;' id='alertDialog'></div>");
	}

	message = convertToHTML (message);

	alertDialog.text('');
	alertDialog.append(message);
	alertDialog.append("</br></br>");

	var controlcmb;
	controlcmb = "New Amount: <select id='cmbNewAmt' name='cmbNewAmt'>"

	var i;
	i = min;
	while ((i <= max) && (i <= balance)) {
    controlcmb = controlcmb + "<option value='" + i  +  "'>" + i + "</option>";
    i = i + 500;
	}

	controlcmb = controlcmb + "</select>";

	controlcmb = convertToHTML (controlcmb);

	alertDialog.append(controlcmb);


	alertDialog.dialog ({
		autoOpen: false,
		modal: true,
		resizable: false,
		title: title,
		buttons: buttonArray
	}).height("auto");

	displayLoading ('stop');
	alertDialog.dialog('open');

    //Support RTL style modifications in jquery UI
	if ($("body").css("direction").toLowerCase() == "rtl") {
	    $('.ui-dialog-content').css('text-align', 'right');

	    $('.ui-dialog-titlebar-close').css('right', 'auto').css('left', '.3em');
	    $('.ui-dialog-buttonset').css('float', 'left');

	}
};

function dfAlertCloseBox (message, title, closeText){
	var alertDialog = $('#alertDialog');

	if (alertDialog.length == 0){
		alertDialog = $("<div style='text-align:left;' id='alertDialog'></div>");
	}

    message = convertToHTML (message);

	alertDialog.text('');
	alertDialog.append(message);
	alertDialog.dialog ({ autoOpen: false, modal: true, resizable: false, title: title,
		buttons: [{ text: closeText, click: function() {
		    try {
				CloseWindow ();
			}
   			catch (e) {
				window.close();
			}
		}}]
	}).height("auto");

	displayLoading ('stop');
	alertDialog.dialog ('open');
	$('.ui-dialog :button').blur();

    //Support RTL style modifications in jquery UI
	if ($("body").css("direction").toLowerCase() == "rtl") {
	    $('.ui-dialog-content').css('text-align', 'right');

	    $('.ui-dialog-titlebar-close').css('right', 'auto').css('left', '.3em');
	    $('.ui-dialog-buttonset').css('float', 'left');

	}
};

//Center an element
function centerElement (element){
	element.css("position","fixed");
	element.css("top", Math.max(0, (($(window).height() - element.outerHeight()) / 2)) + "px");
	element.css("left", Math.max(0, (($(window).width() - element.outerWidth()) / 2)) + "px");
};

/*
Display loading animation in jQuery
action: ('start': starts animation,
		'stop': stops animation)
*/
function displayLoading (action) {
	var divSpinner = $('#divSpinner');
	if (action == 'start') {
		if (divSpinner.length == 0) {
			var opts = {
				lines: 11, // The number of lines to draw
				length: 0, // The length of each line
				width: 10, // The line thickness
				radius: 17, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#fff', // #rgb or #rrggbb or array of colors
				speed: 1, // Rounds per second
				trail: 30, // Afterglow percentage
				shadow: true, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: '50%', // Top position relative to parent
				left: '50%' // Left position relative to parent
			};

			var div = $("<div class='loadingAnimation' id='divSpinner' ></div>");
			var spinner = new Spinner(opts).spin(div[0]);
			$(document.body).append(div);
			centerElement(div);
		} else {
			divSpinner.show();
        }

		//Set spinner timeout, for 30 seconds
		setTimeout(function () {
			divSpinner.hide();
		}, 30000);

	    //Support RTL style modifications in jquery UI
		if ($("body").css("direction").toLowerCase() == "rtl") {
		    $('.spinner').css('left', '65%');
		}

	} else if (action == 'stop') {
		divSpinner.hide();
	}
};

//Loading Spinner Code
//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});


//if inside a frame, send a PostMessage to parent iFrame to resize frame height to height of current document
function postMessageContentHeight() {
    if (top.location != location) {
        var currentHeight;
        currentHeight = $('body').height() // Get the body's height!
        var dfdoc_height = parseInt(currentHeight)+25;
		parent.postMessage(dfdoc_height,"*");//* allows this to post to any parent iframe regardless of domain
		//console.log(dfdoc_height);
		//alert(currentHeight);
	}
}

//GENERAL PAGE EVENTS -add loading animation to key elements
$(document).ready(function() {
	$('input[type*="submit"],#dfmenu .simplebutton,.toppaymentbutton,#depositoptions .paymentbutton,.recentpaymentmethodarea .paymentbutton').click(
		function(e){
			if ($( this ).hasClass( "noloader" )==false) {
				var alertDialog = $('#alertDialog');
				if (alertDialog.length == 0 || !alertDialog.is(":visible")) {
					var objhref;
					objhref = $( this ).attr( "href" );
					if (typeof objhref !="undefined") {
						//rewriting this to allow the loader to show on iOS
						displayLoading ('start');
						e.preventDefault();
						location.href=objhref;
					} else {
					 	displayLoading ('start');
					}
				}
			}
		}
	);

	//back button cache issues (iOS)
	//http://stackoverflow.com/questions/11979156/mobile-safari-back-button
	//stop the loader, enable the SubmitButton and reset the defaultValue text of the button
	$(window).bind("pageshow", function(event) {
    	if (event.originalEvent.persisted) {
			displayLoading ('stop');
			//TODO cannot reset the value of the button back to defaultValue so using Submit
			$(".SubmitButton").prop("disabled",false).val("Submit");
//        	window.location.reload(); //last resort
	    }
	});

	//** this section handles the showing/hiding of the custom card drop down **CardNumber
	//$('#btnRecentlyUsedCards').click(function(e) {
	$('#CardNumber').click(function(e) {
		//debugger
		//cannot position a hidden element... show/toggle it first
		$("#RecentlyUsedCreditCardsBox").toggle().position({
			my: "left top",
			at: "left bottom",
			of: $("#CardNumber"),
			collision: "none"
		});
		e.preventDefault();
		e.stopPropagation();
	});

	//clicking anywhere else will hide the drop down
	$(document).on('click touchend', function (evt) {
		//don't hide if the card list was clicked/touched - checks if the target is under the parent
		var target = evt.target || window.event.srcElement;
		if ($("#RecentlyUsedCreditCardsBox").has(target).length == 0) {
			$("#RecentlyUsedCreditCardsBox").hide();
		}
	});

	//resizing window will hide the drop down
	$(window).on('resize', function () {
		
		var path 		= window.location.pathname;
        var pageName 	= path.substring(path.lastIndexOf('/') + 1);

		if (pageName != "viewCCDeposit.asp"){
			$("#RecentlyUsedCreditCardsBox").hide();
		}
	});
	//** end of custom card drop down **//

	postMessageContentHeight();

});


//iovation setup - moved here to prevent making a call for another js file - START
// basic configuration
var io_install_stm = false;// do not install Active X
var io_exclude_stm = 15;// do not run Active X
var io_install_flash = false;// do not install Flash
var io_enable_rip = true;// collect Real IP information
var io_Custom_BlackBoxReady = false;//global flag if black box is fully ready

//callback to set flag and BlackBox value
var io_bb_callback = function (bb, isComplete){
	io_Custom_BlackBoxReady=isComplete;
	var BlackBoxField = document.getElementById("BlackBox");
	BlackBoxField.value = bb;
	if ((isComplete==true) && (window.location.pathname.search(new RegExp("customerreview.asp", "ig"))>0)) {
		document.main.submit();
	}
};
//iovation - END

//Function to determine if device is Touch Screen Supported/Enabled.
function isTouchSupported() {
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = "ontouchstart" in document.createElement("div");

    if (msTouchEnabled || generalTouchEnabled) {
        return true;
    }
    return false;
}

//Validate BitCoin Address
function isValidBitCoinAddress(address) {
    address = address.replace("-", "")
    var result = false;

    if (address.length > 34 || address.length < 27)  /* not valid string length */
        return result;

    if (/[0OIl]/.test(address))   /* this character are invalid in base58 encoding */
        return result;

    $.ajax({
        url: "https://blockchain.info/it/q/addressbalance/" + address,   /* return balance in satoshi */
        async: false
    }).done(function (data) {
        var isnum = /^\d+$/.test(data);
        if (isnum) {                         /* if the returned data are all digits, it's valid */
            result = true;
        }
    })
	.fail(function () {
	    //Failing for IE7-8, Access Denied status, pass this client side check for this scenarios
	    result = true;
	});
    return result;
}

//Validate is browser supports flash
function hasFlash() {
	var support = false;

	//IE only
	if ("ActiveXObject" in window) {
		try {
			support = !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"));
		} catch (e) {
			support = false;
		}
		//W3C, better support in legacy browser
	} else {
		support = !!navigator.mimeTypes['application/x-shockwave-flash'];
	}

	return support;
}
(function() {
	$(function() {
		$target = $('.dotbutton')
		$target.click(function(){
			if ($(this).attr('data-toggle')){
				$('.dotbutton[data-toggle!=collapse]').attr('style','display:block');
				$('#desc').attr('style','display:block;color:black');
				$('.dotbutton[data-toggle*=collapse]').attr('style','display:none');
			}
			else{
				if($("#btn").is("button")){
					$('#desc').attr('style','display:none');
					$(this).attr('style','display:none');
					$('.dotbutton[data-toggle*=collapse]').attr('style','block');
				}
			}
		});
		$('.collapse').click(function(){ $('.dotbutton[data-toggle*=collapse]').attr('style','block');	});
	});
})();