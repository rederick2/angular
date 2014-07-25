angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;
    $scope.username = '';

    //console.log($rootScope.userRegister);

    var url = "https://rederick2.firebaseio.com/";

    /*var Ref = new Firebase(url);
    var authFirebase = new FirebaseSimpleLogin(Ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);

            if(user.provider == 'facebook'){
                Auth.loginFb(user,
                function(res) {
                    window.location.href = '/';
                },
                function(err) {
                    $rootScope.error = err;
                });
            }

      } else {
        // user is logged out

      }
    });*/

    if($rootScope.userRegister)
    {

        $scope.username = $rootScope.userRegister.username;
        $scope.email = $rootScope.userRegister.email;
        $scope.name = $rootScope.userRegister.displayName;
    }


    $scope.$watch('username', function() {
        $scope.username = $scope.username != undefined ? $scope.username.toLowerCase().replace(/\s+/g,'') : $scope.username;
    });

    $scope.register = function() {
        var social = null;
        var picture = "";

        if($rootScope.userRegister)
        {
            if($rootScope.userRegister.provider == 'facebook'){
                picture = 'https://graph.facebook.com/'+$rootScope.userRegister.username+'/picture';
            }

            social = {provider: $rootScope.userRegister.provider, providerId: $rootScope.userRegister.id, token: $rootScope.userRegister.accessToken, picture:picture, link: $rootScope.userRegister.link} 
        }

        Auth.register({
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                name: $scope.name,
                role: $scope.role,
                social : social
            },
            function(res) {
                /*authFirebase.createUser(res.email, res.password, function(error, user) {
                  if (!error) {
                    console.log('User Id: ' + user.uid + ', Email: ' + user.email);
                    authFirebase.login('password', {email: res.email, password: res.password});
                  }
                });*/
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);