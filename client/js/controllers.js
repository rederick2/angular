'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'angularFireAuth', function($rootScope, $scope, $location, $window, Auth, angularFireAuth) {

    $scope.rememberme = true;

    var url = "https://rederick2.firebaseio.com/";

    angularFireAuth.initialize(url, {scope: $scope, name: "user"});

    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        //$window.location.href = '/auth/' + provider;
        /*var ref = new Firebase('https://rederick2.firebaseio.com/users/');

        var auth = new FirebaseSimpleLogin(ref , function(error, user) {
                  
                });*/

        angularFireAuth.login(provider);

        $scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
            console.log(user);

            Auth.loginFb({
                provider : provider,
                id : user.id,
                username: user.username,
                email: user.email,
               // rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', function($rootScope) {

}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                firstname: $scope.firstname,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);


angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Auth', 'Users', '_' ,
function($rootScope, $scope, Auth, Users, _ ) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    var ref = new Firebase('https://rederick2.firebaseio.com/users/');

    ref.on('value' , function(snap){

        var data = snap.val();

        var result = _.where(data, {email: "rda_acym@hotmail.com"});

        console.log(result[0].username);
    });
     
    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });


    
}]);

angular.module('angular-client-side-auth')
.controller('EditCtrl',
['$rootScope', '$scope', '$location', 'angularFire', '$routeParams','Users', 'Auth', 
function($rootScope, $scope, $location, angularFire, $routeParams, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    var ref = new Firebase('https://rederick2.firebaseio.com/users/' + $routeParams.id);
     
    angularFire(ref , $scope, 'remote', {}).
    then(function() {
    $scope.user = angular.copy($scope.remote);
    $scope.user.$id = $routeParams.id;
   /* $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.project);
    }*/
    $scope.destroy = function() {
      $scope.remote = null;
      //console.log($scope.user.username);
      Auth.remove({
                    username : $scope.user.username
                },
                function() {
                    $location.path('/admin');
                },
                function(err) {
                    $rootScope.error = err;
                });
    };
    /*$scope.save = function() {
      $scope.remote = angular.copy($scope.project);
      $location.path('/');
    };*/
    });

}]);

angular.module('angular-client-side-auth')
.controller('ListCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'angularFireCollection', 'Usersregistered', function($rootScope, $scope, Users, Auth, angularFireCollection, Usersregistered ) {
    $scope.loading = false;
    $scope.userRoles = Auth.userRoles;

    console.log(angularFireCollection('https://rederick2.firebaseio.com/users/rederick2'));

    $scope.users = angularFireCollection('https://rederick2.firebaseio.com/users/');

}]);

