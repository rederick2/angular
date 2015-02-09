'use strict';

angular.module('angular-client-side-auth', ['ngRoute', 'firebase' , 'ngCookies',  'angularMoment', 'ngSanitize','angularFileUpload', 'wu.masonry', '$strap.directives', 'xeditable', 'ui.bootstrap', 'ngAutocomplete'])
    
    /*.value('fbURL', 'https://rederick2.firebaseio.com/users/')
    .factory('Usersregistered', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    })*/
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl:    'user',
            controller:     'UserCtrl',
            access:         access.user
        });

    $routeProvider.when('/home',
        {
            templateUrl:    'home',
            controller:     'HomeCtrl',
            access:         access.anon
        });

    $routeProvider.when('/live',
        {
            templateUrl:    'live',
            //controller:     'HomeCtrl',
            access:         access.public
        });

    $routeProvider.when('/cursos/:id',
        {
            templateUrl:    'curso',
            controller:     'CursoCtrl',
            access:         access.user
        });

   /*$routeProvider.when('/login',
        {
            templateUrl:    'login',
            controller:     'LoginCtrl',
            access:         access.anon
        });*/
    /*$routeProvider.when('/register',
        {
            templateUrl:    'register',
            controller:     'RegisterCtrl',
            access:         access.anon
        });*/
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
    $routeProvider.when('/messages',
        {
            templateUrl:    'messages',
            controller:     'MessagesCtrl',
            access:         access.user
        });
    $routeProvider.when('/messages/:id',
        {
            templateUrl:    'messages',
            controller:     'MessagesCtrl',
            access:         access.user
        });
    $routeProvider.when('/firepad',
        {
            templateUrl:    'firepad',
            controller:     'FirepadCtrl',
            access:         access.user
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
    $routeProvider.when('/:id/picture',
        {
            templateUrl:    'picture',
            controller:     'PictureCtrl',
            access:         access.user
        });

    $routeProvider.when('/:id/profile',
        {
            templateUrl:    'profile',
            controller:     'ProfileCtrl',
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
                $location.path('/home');
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

    .run(['$rootScope', '$location', 'Auth', 'Users', 'Files', '$route', 'editableOptions', function ($rootScope, $location, Auth, Users, Files, $route, editableOptions) {

        // New look for Google Maps
        //google.maps.visualRefresh = true;

        $rootScope.imgProfile = '';

        editableOptions.theme = 'bs3';

        $rootScope.photo = false;

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/home');
            }

            if(Auth.isLoggedIn()){

                Users.getByUsername({username:Auth.user.username} , 
                function(res){

                    //console.log(res[0]);
                    if(res.length != 0){
                        $rootScope.imgProfile = res.picture; //+ '?' + (Math.random()*10);
                        $rootScope.fullname = res.name;
                    }

                }, function(err){
                    $rootScope.error = err;
                });

            }

            
            
        });

        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            

            if($rootScope.photo){
                
                if (window.confirm("Deseas abandonar esta página?")) { 
                  
                  Files.destroy({
                                    public_id: $rootScope.public_id
                                },
                                function(res){

                                    $rootScope.photo = false;

                                }, 
                                function(err){
                                    $rootScope.error = err;
                                });
                  

                }else{
                    event.preventDefault();
                }
            }
            
        });
  

    }]);