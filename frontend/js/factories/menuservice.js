myApp.factory('Menuservice', function($rootScope,$http, $q, $timeout,apiService) {
    return {
        foo: function() {
            alert("I'm foo!");
        },
        
    };
});