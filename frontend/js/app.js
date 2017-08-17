// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'ui.swiper',
    'angularPromiseButtons',
    'toastr',
    'ngCookies',
    'ngResource',
    'ngIdle',
    'app.directives',
    'voiceRss',
    'jlareau.bowser'
]);
//angular.module('manage', ['ngResource']);
// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,$resourceProvider,IdleProvider,ttsProvider,$qProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
    $resourceProvider.defaults.stripTrailingSlashes = false;
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    
    // for http request with session
    //$httpProvider.defaults.withCredentials = false;
    ttsProvider.setSettings({ key: '5a1cc1a178c24b89ba23fd6e3b1bb6c5' });
    //$qProvider.errorOnUnhandledRejections(false);
    IdleProvider.idle(10*60); // 10 minutes idle
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: tempateURL,
            controller: 'LoginCtrl'
        })
        .state('forgotpassword', {
            url: "/forgotpassword/:id",
            templateUrl: tempateURL,
            controller: 'ForgotPasswordCtrl'
        })
        .state('form', {
            url: "/form",
            templateUrl: tempateURL,
            controller: 'FormCtrl'
        })
        .state('grid', {
            url: "/grid",
            templateUrl: tempateURL,
            controller: 'GridCtrl'
        });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});

/*var xhRequest = new XMLHttpRequest();
xhRequest.open("GET", "http://localhost:8080", false);
xhRequest.send(null);

myApp.constant("CSRF_TOKEN", xhRequest.responseText);
myApp.run(['$http', 'CSRF_TOKEN', function($http, CSRF_TOKEN) {    
    $http.defaults.headers.common['X-Csrf-Token'] = CSRF_TOKEN;
}]);*/


myApp.run(['$http','$cookies','beforeUnload','$document','$rootScope','Idle','bowser', function run(  $http, $cookies,beforeUnload,$document,$rootScope,Idle,bowser ){
    // For CSRF token compatibility with Django
    
    //$http.defaults.xsrfCookieName = 'csrftoken';
    //$http.defaults.xsrfHeaderName = 'X-CSRFToken';
    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
    //** django urls loves trailling slashes which angularjs removes by default.
    //$resourceProvider.defaults.stripTrailingSlashes = false;
     //return function(scope, elm, attrs) {
    if ( bowser.msie )
        $rootScope.browser = "msie";
    if ( bowser.firefox )
        $rootScope.browser = "firefox";
    if ( bowser.chrome )
        $rootScope.browser = "chrome";
    if ( bowser.safari )
        $rootScope.browser = "safari";
    if ( bowser.opera )
        $rootScope.browser = "opera";
    if ( bowser.android )
        $rootScope.browser = "android"; //native
    if ( bowser.ios )
        $rootScope.browser = "ios"; //native
    if ( bowser.samsungBrowser )
        $rootScope.browser = "samsungBrowser"; //native
    if ( bowser.msedge )
        $rootScope.browser = "msedge";
    
    $rootScope.transcript="";
    $rootScope.tabvalue={};
    
         Idle.watch();
        $document.on("keydown", function(e) {
            if(e.ctrlKey && (e.key == "p" || e.charCode == 16 || e.charCode == 112 || e.keyCode == 80) ){
                //alert("Please use the Print PDF button below for a better rendering on the document");
                //e.cancelBubble = true;
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }  
            else if(e.ctrlKey && (e.which == 16 || e.keyCode == 73))
            {
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
            else if(e.ctrlKey && (e.which == 67 ))
            {
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
            else if(e.ctrlKey && (e.which == 85 ))
            {
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
            else if((e.which == 44 ))
            {
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
            if(e.which === 123){
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
        });
        $document.on("keyup", function(e) {
            if((e.keyCode == 44 ))
            {
                e.preventDefault();
                window.stop(); // Works in all browsers but IE    
                document.execCommand("Stop"); // Works in IE
                return false; // Don't even know why it's here. Does nothing.  
            }
        });
        $(document).bind("contextmenu",function(e) {
            //e.preventDefault();
        });
        $rootScope.$on('IdleTimeout', function() {
            var scope = angular.element(document.getElementById('changepwd')).scope();
            scope.logout();
            // end their session and redirect to login
        });
    //};
    //Hide Code
    // var currentInnerHtml;
    // var element = new Image();
    // var elementWithHiddenContent = document.querySelector("script");
    // var innerHtml = elementWithHiddenContent.innerHTML;

    // element.__defineGetter__("id", function() {
    //     currentInnerHtml = "";
    // });

    // setInterval(function() {
    //     currentInnerHtml = innerHtml;
    //     //console.log(element);
    //     //console.clear();
    //     elementWithHiddenContent.innerHTML = currentInnerHtml;
    // }, 1000);


    var checkStatus;

    var element2 = new Image();
    // var element = document.createElement('any');
    element2.__defineGetter__('id', function() {
        checkStatus = 'on';
    });
    setInterval(function() {
        
        // if(checkStatus == 'on')
        //     alert("Disable Developer Tool");
        checkStatus = 'off';
        //console.log(element2);
        //console.clear();
        //document.querySelector('#devtool-status').innerHTML = checkStatus;
    }, 1000)
     
}])
// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});

myApp.factory('beforeUnload', function ($rootScope, $window,CsrfTokenService,apiService) {
    // Events are broadcast outside the Scope Lifecycle
    
    $window.onbeforeunload = function (e) {
        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        // CsrfTokenService.getCookie("csrftoken").then(function(token) {
        //     // $rootScope.formData = {sessionid:$.jStorage.get("sessionid"),user:$.jStorage.get("id"),csrfmiddlewaretoken:token};
        //     // apiService.logout($rootScope.formData).then(function (callback){
        //     //     $.jStorage.flush();
                
        //     // });
        
        // });
        if (event.defaultPrevented) {
            //return confirmation.message;
        }
    };
    
    $window.onunload = function () {
        //$rootScope.$broadcast('onUnload');
    };
    return {};
});
