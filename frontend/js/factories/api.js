myApp.factory('apiService', function ($http, $q, $timeout) {
    
    //adminurl2 = "http://localhost:8000/";
    adminurl2 = "http://104.46.103.162:8000/";
    adminUrl3 = "http://localhost/api/";
    //adminUrl3 = "http://104.46.103.162:8095/api/";
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl2 + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        // This is a demo Service for POST Method.
        login:function(formData, callback) {
            
            // $http.post(adminurl + "api.php?func=getautocomplete&string=" + request).then(function (response) {
            //     console.log("Hello",response);
            //     return response;
            // });
            
            return $http({
                url:adminUrl3+ "Chatbotuser/loginuser",
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
            });
           
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
        savebookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/savebookmark",
                method: 'POST',
                data: formData,
            });
            
        },
        deletebookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/deletebookmark",
                method: 'POST',
                data: formData,
            });
            
        },
        viewbookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/viewbookmark",
                method: 'POST',
                data: formData,
            });
            
        },
        getbookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/getbookmark",
                method: 'POST',
                data: formData,
            });
            
        },
        sendmail:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotuser/sendmail",
                method: 'POST',
                data: formData,
                // headers : {
                //     'Content-Type' : 'application/json'
                // },
                // transformRequest :  [function (data, headers) {
                //     //just send data without modifying
                //     return data;
                // }],
                contentType: "application/x-www-form-urlencoded",
            });
            
        },
        getQlikChart:function(formData,callback){
            
            return    $http({
                url:adminurl2+'chat/',
                method: 'POST',
                data:$.param(formData),
                headers: {'X-CSRFToken': formData.csrfmiddlewaretoken,'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            });
        }
    };
    //return responsedata;
});