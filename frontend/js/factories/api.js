myApp.factory('apiService', function ($http, $q, $timeout) {
    
    //adminurl2 = "http://localhost:8000/";
    adminurl2 = "http://104.46.103.162:8000/";
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
        
        
       
        getQlikChart:function(formData,callback){
            
            return    $http({
                url:adminurl2+'chat/',
                method: 'POST',
                data:$.param(formData),
                headers: {'X-CSRFToken': formData.csrfmiddlewaretoken},
            });
        }
    };
    //return responsedata;
});