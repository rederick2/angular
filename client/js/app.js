'use strict';

angular.module('angular-client-side-auth', ['ngCookies', 'ngRoute', 'firebase' , 'angularMoment', 'ngSanitize','angularFileUpload', 'wu.masonry']).
    
    value('fbURL', 'https://rederick2.firebaseio.com/users/').
    factory('Usersregistered', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    })
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl:    'home',
            controller:     'HomeCtrl',
            access:         access.user
        });
    
    $routeProvider.when('/login',
        {
            templateUrl:    'login',
            controller:     'LoginCtrl',
            access:         access.anon
        });
    $routeProvider.when('/register',
        {
            templateUrl:    'register',
            controller:     'RegisterCtrl',
            access:         access.anon
        });
    $routeProvider.when('/private',
        {
            templateUrl:    'private',
            controller:     'PrivateCtrl',
            access:         access.user
        });
    $routeProvider.when('/admin',
        {
            templateUrl:    'admin',
            controller:     'AdminCtrl',
            access:         access.admin
        });
    $routeProvider.when('/list',
        {
            templateUrl:    'listado',
            controller:     'ListCtrl',
            access:         access.admin
        });
    $routeProvider.when('/edit/:id',
        {
            templateUrl:    'edit',
            controller:     'EditCtrl',
            access:         access.admin
        });
    $routeProvider.when('/404',
        {
            templateUrl:    '404',
            access:         access.public
        });
    $routeProvider.when('/:id',
        {
            templateUrl:    'user',
            controller:     'UserCtrl',
            access:         access.user
        });
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

}])

    .run(['$rootScope', '$location', 'Auth', '$route', function ($rootScope, $location, Auth, $route) {

        // New look for Google Maps
        //google.maps.visualRefresh = true;

        $rootScope.photo = false;

        var lastRoute = $route.current;

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/login');
            }
            
        });

        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            

            if($rootScope.photo){
                
                if (window.confirm("Are you sure you wish to leave?")) { 
                  
                  $rootScope.photo = false;

                }else{
                    event.preventDefault();
                }
            }
            
        });
  

    }]);