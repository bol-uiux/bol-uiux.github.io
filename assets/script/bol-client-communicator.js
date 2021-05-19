var bolClientExecuted = false;
var bolxdm = document.querySelector('meta[name="parentPath"]').getAttribute("content");

$.prototype.showG2C = function (){ top.postMessage({'G2C':true}, bolxdm);};
$.prototype.hideG2C = function (){ top.postMessage({'G2C':false}, bolxdm);};

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
var Interval ;
function showChat() {
    try {
         if(inIframe())
         {
             
            $('#bol_xdm').showG2C();
         }else
         {
              
            Interval = setInterval(OpenChat, 500);
         }
        
    } catch (e) {
        return false;
    }
}

function sendMessage(message) {
    console.log('sending message to ' + bolxdm + ' with message ' + JSON.stringify(message));
    top.postMessage(message, bolxdm);
  }
 

function OpenChat() {
    $('[id^=LPMcontainer]').click(); 
    clearInterval(Interval);
}

function hideChat() {
    try {
        $('#bol_xdm').hideG2C();
    } catch (e) {
        return false;
    }
}

 
$(document).ready(function() { //start after HTML, images have loaded
    // LIVE PERSON JQUERY -->
    if(!inIframe()){ 
    function openLivePerson(e) {
        e.preventDefault(); // For not go to top the window -->
        $('[id^=LPMcontainer]').click();
                $("#contact-us-modal").modal('hide');


        var backdrop = document.getElementsByClassName("modal-backdrop");
        for (var i = 1; i < backdrop.length; i++)
            backdrop.parentElement.removeChild(backdrop[i]); //removes any extra backdrops

    }

    // BEGIN LivePerson Monitor. -->
    window.lpTag = window.lpTag || {}, "undefined" == typeof window.lpTag._tagCount ? (window.lpTag = {
        site: '90263191' || "",
        section: lpTag.section || "",
        tagletSection: lpTag.tagletSection || null,
        autoStart: lpTag.autoStart !== !1,
        ovr: lpTag.ovr || {},
        _v: "1.8.0",
        _tagCount: 1,
        protocol: "https:",
        events: { bind: function(t, e, i) { lpTag.defer(function() { lpTag.events.bind(t, e, i) }, 0) }, trigger: function(t, e, i) { lpTag.defer(function() { lpTag.events.trigger(t, e, i) }, 1) } },
        defer: function(t, e) { 0 == e ? (this._defB = this._defB || [], this._defB.push(t)) : 1 == e ? (this._defT = this._defT || [], this._defT.push(t)) : (this._defL = this._defL || [], this._defL.push(t)) },
        load: function(t, e, i) {
            var n = this;
            setTimeout(function() { n._load(t, e, i) }, 0)
        },
        _load: function(t, e, i) {
            var n = t;
            t || (n = this.protocol + "//" + (this.ovr && this.ovr.domain ? this.ovr.domain : "lptag.liveperson.net") + "/tag/tag.js?site=" + this.site);
            var a = document.createElement("script");
            a.setAttribute("charset", e ? e : "UTF-8"), i && a.setAttribute("id", i), a.setAttribute("src", n), document.getElementsByTagName("head").item(0).appendChild(a)
        },
        init: function() {
            this._timing = this._timing || {}, this._timing.start = (new Date).getTime();
            var t = this;
            window.attachEvent ? window.attachEvent("onload", function() { t._domReady("domReady") }) : (window.addEventListener("DOMContentLoaded", function() { t._domReady("contReady") }, !1), window.addEventListener("load", function() { t._domReady("domReady") }, !1)), "undefined" == typeof window._lptStop && this.load()
        },
        start: function() { this.autoStart = !0 },
        _domReady: function(t) { this.isDom || (this.isDom = !0, this.events.trigger("LPT", "DOM_READY", { t: t })), this._timing[t] = (new Date).getTime() },
        vars: lpTag.vars || [],
        dbs: lpTag.dbs || [],
        ctn: lpTag.ctn || [],
        sdes: lpTag.sdes || [],
        hooks: lpTag.hooks || [],
        ev: lpTag.ev || []
    }, lpTag.init()) : window.lpTag._tagCount += 1;
   
}
    // END LivePerson Monitor. -->
    
});
 