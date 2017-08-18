myApp.factory('apiService', function ($http, $q, $timeout,CsrfTokenService,$httpParamSerializer) {
    //adminurl = "http://wohlig.co.in/chatbotapi/index.php/json/";
    adminurl = "http://35.161.160.7:8091/";
    var adminUrl2 = "http://wohlig.io/api/";
    var adminUrl3 = "http://192.168.0.107/api/"
    //var adminUrl3 = "http://localhost/api/";
    //return
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        // This is a demo Service for POST Method.
        getautocomplete: function(formData, callback) {
            
            // $http.post(adminurl + "api.php?func=getautocomplete&string=" + request).then(function (response) {
            //     console.log("Hello",response);
            //     return response;
            // });
            return $http({
                url:adminUrl3+ "Chatbotautocomplete/getautocomplete",
                //url: "http://wohlig.co.in/chatbotapi/index.php/json/" + 'getautocomplete',
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData
            })
        },
        login:function(formData, callback) {
            
            // $http.post(adminurl + "api.php?func=getautocomplete&string=" + request).then(function (response) {
            //     console.log("Hello",response);
            //     return response;
            // });
            
            return $http({
                //url: "http://wohlig.co.in/chatbotapi/index.php/json/" + 'login/',
                url:adminUrl3+ "Chatbotuser/loginuser",
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
                //withCredentials: false,
                //dataType:"json",
            });
            /*
            return    $http({
                url:adminurl+'authenticate/',
                method: 'POST',
                data:{username : "pratik", password : "asdf",'csrfmiddlewaretoken': "Vfpx6pWJYBx7dbX35vwXm7P9xj3xNPyUJbSx9IlwgcRHReN974ZC5rEbvgpRQdY2"},
                //xsrfHeaderName :"X-CSRFToken",
                //xsrfCookieName :"csrftoken",
                withCredentials: true,
                headers: {'Content-Type': 'application/json; charset=utf-8','X-CSRFToken': "Vfpx6pWJYBx7dbX35vwXm7P9xj3xNPyUJbSx9IlwgcRHReN974ZC5rEbvgpRQdY2"},
            });
             */
        },
        logout:function(formData, callback) {
            
           
            return $http({
                //url: "http://wohlig.co.in/chatbotapi/index.php/json/" + 'login/',
                url:adminUrl3+ "Chatbotuserlogs/logoutuser",
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
                //withCredentials: false,
                //dataType:"json",
            });
            
        },
        changepassword:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/changepassword',
                method: 'POST',
                data: formData
            });
            // $.ajax({
            //     url : adminurl+"changepassword",
            //     data: formData,
            //     headers: {'X-CSRFToken': CsrfTokenService.getCookie("csrftoken")},
            //     type: "POST",
            //     dataType: "json",
                
            // });
        },
        crnsubmit:function(formData,callback){
            return    $http({
                url:adminurl+'srandcrn/',
                method: 'POST',
                data:{user_input : 2, user_id : 1,number_type:'CRN','csrfmiddlewaretoken': "Vfpx6pWJYBx7dbX35vwXm7P9xj3xNPyUJbSx9IlwgcRHReN974ZC5rEbvgpRQdY2"},
                //xsrfHeaderName :"X-CSRFToken",
                //xsrfCookieName :"csrftoken",
                //withCredentials: false,
                headers: {'Content-Type': 'application/json; charset=utf-8','X-CSRFToken': "Vfpx6pWJYBx7dbX35vwXm7P9xj3xNPyUJbSx9IlwgcRHReN974ZC5rEbvgpRQdY2"},
            });
        },
        gettabdata:function(formData,callback){
            
            return    $http({
                url:adminurl+'get_tab_data/',
                method: 'POST',
                data:$.param(formData),
                dataType:"json",
                //xsrfHeaderName :"X-CSRFToken",
                //xsrfCookieName :"csrftoken",
                //withCredentials: false,
                headers: {'X-CSRFToken': formData.csrfmiddlewaretoken},
            });
            /*
            var data = $.param(formData);
        
            var config = {
                dataType:"json",
                'Content-Type': 'application/json',
                headers : { 'X-CSRFToken': formData.csrfmiddlewaretoken}
            }
            return $http.post(adminurl+'get_tab_data/', data,config).success(function(data,status,headers,config){
                
            });*/

        },
        getSysMsg:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotautolist/getSysMsg',
                method: 'POST',
                data:(formData),
                //withCredentials: false,
                //headers: {'Content-Type': 'application/json','X-CSRFToken': "Vfpx6pWJYBx7dbX35vwXm7P9xj3xNPyUJbSx9IlwgcRHReN974ZC5rEbvgpRQdY2"},
            });
            
            
        },
        getDthlinkRes:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotautolist/getDthlink',
                method: 'POST',
                data:(formData),
                //withCredentials: false
            });
            
            
        },
        forgotpassword:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/forgotpassword',
                method: 'POST',
                data: formData
            });
        },
        isvalidpasswordresetreq:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/isvalidpasswordresetreq',
                method: 'POST',
                data: formData
            });
        },
        changepassword2:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/resetpassword',
                method: 'POST',
                data: formData
            });
        },
        getttsSpeech:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotautolist/getttsSpeech',
                method: 'POST',
                data:(formData),
                //withCredentials: false
            });
            
            
        },
        startRecording:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/startRecording',
                method: 'POST',
                data:(formData),
               
            });
            
            
        },
        stopRecording:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/stopRecording',
                method: 'POST',
                data:(formData),
                
            });
            
            
        },
        tts:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/startRecoding1',
                method: 'POST',
                data:(formData),
            });
            
            
        },
        startRecording:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/startRecording',
                method: 'POST',
                data:(formData),
                withCredentials: false
            });
            
            
        },
        stopRecording:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/stopRecording',
                method: 'POST',
                data:(formData),
                withCredentials: false
            });
            
            
        },
        tts:function(formData,callback){
            //console.log(formData);
            return    $http({
                //url:adminurl+'out/'+formData.user_id+"/",
                url: adminUrl3 + 'Chatbotvoice/startRecoding1',
                method: 'POST',
                data:(formData),
                withCredentials: false
            });
            
            
        },
        getQlikChart:function(formData,callback){
            
            return    $http({
                url:adminurl+'getQlikChart/',
                method: 'POST',
                data:$.param(formData),
                dataType:"json",
                //xsrfHeaderName :"X-CSRFToken",
                //xsrfCookieName :"csrftoken",
                //withCredentials: false,
                //headers: {'X-CSRFToken': formData.csrfmiddlewaretoken},
            });
        }
    };
    //return responsedata;
});