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
    //'ngCookies',
    //'ngResource',
    //'ngIdle',
    'app.directives',
    //'voiceRss',
    'jlareau.bowser',
    'base64',
]);
//angular.module('manage', ['ngResource']);
// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    //$httpProvider.defaults.headers = 'application/x-www-form-urlencoded';
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
    // for http request with session
    //$httpProvider.defaults.withCredentials = false;
    //ttsProvider.setSettings({ key: '5a1cc1a178c24b89ba23fd6e3b1bb6c5' });
    //$qProvider.errorOnUnhandledRejections(false);
    //IdleProvider.idle(10*60); // 10 minutes idle
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


myApp.run(['$http','$document','$rootScope','bowser', function run(  $http,$document,$rootScope,bowser ){
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
    //console.log($rootScope.browser);
    $rootScope.transcript="";
    //$rootScope.tabvalue={};
    
        // Idle.watch();
        
       /*
        $rootScope.$on('IdleTimeout', function() {
            var scope = angular.element(document.getElementById('changepwd')).scope();
            scope.logout();
            // end their session and redirect to login
        });*/
     
}])
// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});
