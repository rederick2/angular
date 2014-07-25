angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'angularFireAuth', function($rootScope, $scope, $location, $window, Auth, angularFireAuth) {

    $scope.rememberme = true;

    var url = "https://rederick2.firebaseio.com/";

    var Ref = new Firebase(url);
    var authFirebase = new FirebaseSimpleLogin(Ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        //console.log(1);

            if(user.provider == 'facebook'){
                
                Auth.loginFb(user,
                function(res) {

                    if(res.login == 'true')
                    {

                        $location.path('/');

                    }else{

                        $rootScope.userRegister = user;
                        $location.path('/register');

                    }
                },
                function(err) {
                    $rootScope.error = err;
                });
                
            }

      } else {
        // user is logged out

      }
    });

    //angularFireAuth.initialize(url, {scope: $scope, name: "user"});

    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                console.log(res);
                authFirebase.login('password', {email: res.email, password: res.password});
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

        authFirebase.login(provider);

        /*$scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
            console.log(user);

            if(provider == 'facebook'){
                Auth.loginFb(user,
                function(res) {
                    window.location.href = '/';
                },
                function(err) {
                    $rootScope.error = err;
                });
            }
        });*/
    };
}]);
