myApp.service('CsrfTokenService', function ($timeout,$filter) {
    csrfservice = {};
    this.getCookie = function(c_name)
    {
        this.token="";
        //var promise = new Promise(function(resolve, reject) {
       return $timeout(function () {
            // var cookieValue = null;
            // if (document.cookie && document.cookie != '') {
            //     var cookies = document.cookie.split(';');
            //     for (var i = 0; i < cookies.length; i++) {
            //         var cookie = jQuery.trim(cookies[i]);
            //         // Does this cookie string begin with the name we want?
            //         if (cookie.substring(0, c_name.length + 1) == (c_name + '=')) {
            //             cookieValue = decodeURIComponent(cookie.substring(c_name.length + 1)); 
            //             break;
            //         }    
            //     }    
            // }    
            // console.log(cookieValue);
            // return cookieValue;
            
            if (document.cookie.length > 0)
            {
                
                c_start = document.cookie.indexOf(c_name + "=");
                
                if (c_start != -1)
                {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1)
                        c_end = document.cookie.length;
                    //console.log(unescape(document.cookie.substring(c_start,c_end)),"coooooooo");
                    //resolve(unescape(document.cookie.substring(c_start,c_end)));
                    return unescape(document.cookie.substring(c_start,c_end));
                    //this.token= unescape(document.cookie.substring(c_start,c_end));
                }
                
            }
            else
            {
                //$cookies.put("csrftoken",sha256_digest($filter('date')(new Date(), 'hh:mm:ss a')));
            }
            //console.log(document.cookie,"cookie");
            
        });
       // });
       // return promise;
    };
    //console.log(csrfservice);
    //return csrfservice;
});