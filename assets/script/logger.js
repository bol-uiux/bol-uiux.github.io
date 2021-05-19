(function ($) {
    

    var ss = sessionStorage;

    $.fn.ssGet = function (key) {

        if (key) {
            return ss.getItem(key);
        }
        return ss.getItem(this.Id);
    };

    $.fn.ssSet = function (key, value) {

        if (key) {
            ss.setItem(key, value);
            return;
        }
        ss.setItem(this.Id, this.val());
    };

    $.fn.ssDel = function (key) {
        if (key) {
            ss.removeItem(key);
            return;
        }
        ss.removeItem(this.Id);
    };

    $.fn.ssClear = function () { ss.clear(); };

    $.fn.addUILog = function (key, msg) {
        if (key == undefined || key == "" || msg == undefined || msg == "") return false;

        var errors = $.fn.ssGet(key);
        
        if (errors && errors.length +msg.length>1900){
            $.fn.saveUILog(); 
        }
        msg =   $.extend({location : window.location.href},
                        JSON.parse(msg),                         
                        JSON.parse(errors));
       
        $.fn.ssSet(key, JSON.stringify(msg));
        
                
    }

    $.fn.saveUILog = function (key, urlOtp) {
        try {
            
            var url = (urlOtp == "" || urlOtp == undefined ?
                "/components/include/messageerrorservice.asp" :
                urlOtp) + "?" + window.location.href.slice(window.location.href.indexOf('?') + 1);

            var errors = $.fn.ssGet(key == undefined ? "messageError" : key);
            
            if (errors != null) {
                var tempErrors = { MessageError: errors, typeid: 2 };
                $.fn.ssClear();

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url,
                    data: tempErrors,                   
                    async:true                      
                });
            }           
           
            
        } catch (e) {
            //$(window).off('beforeunload');
            console.log(e);
        }
    }


    setTimeout(function(){ 
        $.fn.saveUILog(); 
        return true; 
    },100); 

}(jQuery));