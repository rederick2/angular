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
                window.location.href = '/';
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
                //$location.path('/');
                window.location.href = '/';
            },
            function(err) {
                $rootScope.error = err;
            });
        });
    };
}]);
