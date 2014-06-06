angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;
    $scope.username = '';


    $scope.$watch('username', function() {
        $scope.username = $scope.username != undefined ? $scope.username.toLowerCase().replace(/\s+/g,'') : $scope.username;
    });

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