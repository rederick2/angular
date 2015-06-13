angular.module('unsApp')
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