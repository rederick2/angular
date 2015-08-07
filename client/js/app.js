'use strict';

angular.module('unsApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'materialDatePicker', 'ngMenuSidenav', 'firebase' , 'ngCookies',  'angularMoment', 'ngSanitize','angularFileUpload', 'wu.masonry', '$strap.directives', 'xeditable', 'ui.bootstrap', 'ngAutocomplete'])
    
    /*.value('fbURL', 'https://rederick2.firebaseio.com/users/')
    .factory('Usersregistered', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    })*/
    .config(['$routeProvider', '$locationProvider', '$httpProvider', '$mdIconProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $httpProvider, $mdIconProvider, $mdThemingProvider) {
        $mdThemingProvider.theme('altTheme')
            .primaryPalette('purple');

        $mdIconProvider
            .iconSet('action', 'img/iconsets/action-icons.svg', 24)
            .iconSet('alert', 'img/iconsets/alert-icons.svg', 24)
            .iconSet('av', 'img/iconsets/av-icons.svg', 24)
            .iconSet('communication', 'img/iconsets/communication-icons.svg', 24)
            .iconSet('content', 'img/iconsets/content-icons.svg', 24)
            .iconSet('device', 'img/iconsets/device-icons.svg', 24)
            .iconSet('editor', 'img/iconsets/editor-icons.svg', 24)
            .iconSet('file', 'img/iconsets/file-icons.svg', 24)
            .iconSet('hardware', 'img/iconsets/hardware-icons.svg', 24)
            .iconSet('icons', 'img/iconsets/icons-icons.svg', 24)
            .iconSet('image', 'img/iconsets/image-icons.svg', 24)
            .iconSet('maps', 'img/iconsets/maps-icons.svg', 24)
            .iconSet('navigation', 'img/iconsets/navigation-icons.svg', 24)
            .iconSet('notification', 'img/iconsets/notification-icons.svg', 24)
            .iconSet('social', 'img/iconsets/social-icons.svg', 24)
            .iconSet('toggle', 'img/iconsets/toggle-icons.svg', 24)
            .defaultIconSet('img/iconsets/core-icons.svg', 24);

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
            controller:     'LiveCtrl',
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
    $routeProvider.when('/post/:id',
        {
            templateUrl:    'post',
            controller:     'PostCtrl',
            access:         access.public
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

    /*var interceptor = ['$location', '$q', function($location, $q) {
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

    $httpProvider.responseInterceptors.push(interceptor);*/

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

        $rootScope.goToPerson = function(to, event) {

            $location.path('/' + to + '/profile');

        }


        $rootScope.navigateTo = function(to, event) {

            $location.path(to);
        }

  

    }]);